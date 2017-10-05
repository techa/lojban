# -*- coding: utf-8 -*-
'''make json file from jbovlaste.xml'''
import xml.etree.ElementTree as ET
# import copy
import json
import myparser

XML_PATH = './data/origin/jbovlaste.xml'
JSON_PATH = './data/origin/jbovlaste.json'
ROOT = ET.parse(XML_PATH).getroot()
DICTIONARY = {}
WORDS = []
QUOTATION = []
USERS = {}

# lojban
def parse(root):
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
    for valsi in root[0]:
        data = valsi.attrib.copy()
        # type
        types = data['type'].replace('bu-letteral', 'cmavo')
        data['type'] = types

        if 'compound' in types:
            data['compound'] = True
            data['type'] = types.replace('-compound', '')

        if 'experimental' in types:
            data['experimental'] = True
            data['type'] = types.replace('experimental ', '')

        if 'unofficial' in data:
            data['unofficial'] = True

        parse_valsi(data, valsi)

    marge_nlword(root[1])
    return WORDS

def parse_valsi(data, valsi):
    '''parse valsi tree to data'''
    for child in valsi:
        # selmaho
        # rafsi
        # definition -> def, ps
        # notes
        if hasattr(myparser, child.tag):
            getattr(myparser, child.tag)(data, child.text, QUOTATION)

        # glossword -> ja
        elif child.tag == 'glossword':
            myparser.add(data, 'ja', child.attrib['word'])
            if 'sense' in child.attrib:
                myparser.add(data, 'sense', child.attrib['sense'])

        # delete user & definitionid
        elif child.tag == 'definitionid':
            pass
        elif child.tag == 'user':
            username, realname = child
            if username.text not in USERS:
                USERS[username.text] = {
                    'name': realname.text,
                    'count': 1
                }
            else:
                USERS[username.text]['count'] += 1
        else:
            data[child.tag] = child.text
    WORDS.append(data)

def marge_nlword(root):
    '''parse nlword tree to WORDS'''
    for nlword in root[1]:
        for data in WORDS:
            if data['word'] == nlword.attrib['valsi']:
                myparser.add(data, 'ja', nlword.attrib['word'])
                if 'sense' in nlword.attrib:
                    myparser.add(data, 'sense', nlword.attrib['sense'])
                break
        else:
            print('nlword not in words', nlword.attrib['valsi'])

DICTIONARY['words'] = parse(ROOT)
DICTIONARY['quotations'] = QUOTATION
DICTIONARY['users'] = USERS

print('QUOTATION result -----------------')
print(QUOTATION)
print('USERS result -----------------')
print(USERS)
print('Count -----------------')
print(len(DICTIONARY['words']))

with open(JSON_PATH, 'w', encoding='utf-8') as text:
    text.write(json.dumps(DICTIONARY, ensure_ascii=False, indent=2))

# if __name__ == '__main__':
#     sys.argv[1]
