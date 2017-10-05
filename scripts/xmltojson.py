# -*- coding: utf-8 -*-
import re
import util
import json
import xml.etree.ElementTree as ET
from functools import wraps

# decorator
def setter(key, types=str):
    def wrapper(fn):
        @wraps(fn)
        def wrapped(self, *args, **kwargs):
            value = fn(self, *args, **kwargs)
            if types is list:
                if key not in self.data:
                    self.data[key] = []
                # set add
                if value not in self.data[key]:
                    self.data[key].append(value)
            elif types is dict:
                if key not in self.data:
                    self.data[key] = {}
                # merge dict
                self.data[key].update(value)
            else:
                if type(value) == str:
                    value = value.strip(' 　')
                if value:
                    self.data[key] = value
            return value
        return wrapped
    return wrapper

def strip_ext(value):
    '''試験的...を削除'''
    return re.sub(r'試験的\s?(\w+).?', '', value)
RE_EXAM = re.compile(r"「([\w'\.,\-+/ ]+?)(?:\s?[／=]\s?)(.+?)」\s?([(（].+?[)）](?:』）)?)?")

# Main Class
class XmlToJson:
    '''
    "words": [
        {
            "word": "a",
            "type": "cmavo",
            "selmaho": "A",
            "def": "sumti 論理和（OR）／～や～ ： 接続詞（論理・後置・sumti）； 前部と後部はどちらか或いは共に真",
            "exam": [
                ["lo plise .a lo badna cu se citka", "リンゴやバナナを食べる"]
            ],
        },
        {
            "word": "jijnu",
            "type": "gismu",
            "rafsi": {
                "CVC": "jij"
            },
            "def": "$x_1$ は $x_2$ （命題）を $x_3$ （題目）について直感する／勘づく",
            "ps": 3,
            "ja": [
                "直感"
            ],
            "cf": [
                [
                    "djuno",
                    ...
                ]
            ],
            "notes": "「虫の知らせ」も。"
        },
    ]
    '''

    def __init__(self, data=[], quotations=[], users={}):
        self.words = data
        self.quotations = quotations
        self.users = users
        self.data = {}

    def parse(self, xml_path):
        root = ET.parse(xml_path).getroot()
        for valsi in root[0]:
            # merge word, unofficial, type
            self.data = valsi.attrib.copy()

            self.types(valsi.attrib['type'])

            for child in valsi:
                # selmaho
                # rafsi
                # definition -> def, ps
                # notes
                if hasattr(self, child.tag):
                    getattr(self, child.tag)(child.text)

                # glossword -> ja
                elif child.tag == 'glossword':
                    self.gloss(child.attrib['word'], child.attrib.get('sense'))
                # keyword
                elif child.tag == 'keyword':
                    self.keyword(child.attrib['word'], child.attrib.get('sense'))

                # delete definitionid
                elif child.tag == 'definitionid':
                    pass
                # user
                elif child.tag == 'user':
                    username, realname = child
                    if username.text not in self.users:
                        self.users[username.text] = {
                            'name': realname.text,
                            'count': 1
                        }
                    else:
                        self.users[username.text]['count'] += 1
                else:
                    print(child)
            self.words.append(self.data)

        for nlword in root[1]:
            for data in self.words:
                if data['word'] == nlword.attrib['valsi']:
                    self.gloss(nlword.attrib['word'], nlword.get('sense'))
                    break
            else:
                print('nlword not in words', nlword.attrib['valsi'])

        print('QUOTATION result -----------------')
        print(self.quotations)
        print()
        print('USERS result -----------------')
        print(self.users)
        print()
        print('Count -----------------')
        print(len(self.words))

    def export(self, json_path):
        with open(json_path, 'w', encoding='utf-8') as text:
            text.write(json.dumps({
                'words': self.words,
                'users': self.users,
                'quotations': self.quotations
            }, ensure_ascii=False, indent=2))

    @setter('type')
    def types(self, value):
        '''data に typeを作成して代入'''
        types = value.replace('bu-letteral', 'cmavo')

        if 'compound' in types:
            self.data['compound'] = True
            types = types.replace('-compound', '')

        if 'experimental' in types:
            self.data['experimental'] = True
            types = types.replace('experimental ', '')
        return types

    @setter('keyword', list)
    def keyword(self, word, sense=False):
        if sense:
            self.sense(sense)
        return word
    # info
    @setter('gloss', list)
    def gloss(self, word, sense=False):
        if sense:
            self.sense(sense)
        return word

    @setter('sense', list)
    def sense(self, value):
        return value


    @setter('rafsi', dict)
    def rafsi(self, value):
        '''data に rafsiを作成して代入'''
        return {
            util.get_cv(value, True): value
        }

    @setter('selmaho')
    def selmaho(self, value):
        '''data に selmahoを代入'''
        return value

    @setter('def')
    def definition(self, value):
        '''data に definitionを代入'''
        return strip_ext(value)

    @setter('ps')
    def ps(self, value):
        '''data に psを代入'''
        if self.data['type'] != 'cmavo':
            ps_num = 0
            for match in re.findall(r'_(\d)\$', value):
                num = int(match)
                if ps_num < num:
                    ps_num = num
            return ps_num

    @setter('notes')
    def notes(self, value):
        '''data に notes, ja, pun, cf を代入'''
        value = strip_ext(value)
        value = value.replace('’', "'")

        # exams
        def repl(match):
            self.exams(match)
            return ''
        value = RE_EXAM.sub(repl, value)

        # info
        NOTES_INFO = [
            ('gloss', '大意'),
            ('ruby', '読み方'),
            ('pun', '語呂合わせ'),
            ('cf', '?関連語?')]
        value += ' ・'
        for key, jaword in NOTES_INFO:
            reg = r'(?:・{}\s?[：:]\s?(.*?)(?:[\s)）」](?:・|\s*$)))'.format(jaword)
            def repl(match):
                # self[key](match.group(1))
                getattr(self, key)(match.group(1))
                return '・'
            value = re.sub(reg, repl, value)
        return re.sub(r'・$', '', value)

    @setter('exams', list)
    def exams(self, match):
        loj, japan, cap = match.groups()
        exam = [loj, japan]
        if cap:
            if cap not in self.quotations:
                self.quotations.append(cap)
            exam.append(self.quotations.index(cap))
        return exam

    # info
    @setter('pun')
    def pun(self, value):
        return value

    # info
    @setter('ruby')
    def ruby(self, value):
        return value

    # info
    @setter('cf')
    def cf(self, value):
        value = re.sub(r'[{}]', '', value)
        cfs = value.split(';')
        return [cfw.strip(' 　') for cfx in cfs for cfw in cfx.split(',')]


if __name__ == '__main__':
    XML_PATH = './data/origin/jbovlaste.xml'
    JSON_PATH = './data/origin/jbovlaste.json'

    parser = XmlToJson()
    parser.parse(XML_PATH)
    parser.export(JSON_PATH)
