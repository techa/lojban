# -*- coding: utf-8 -*-
import re
import util
def add(data, key, value):
    '''data に listを作成して代入'''
    if key not in data:
        data[key] = []
    if value not in data[key]:
        data[key].append(value)

def rafsi(data, value, *arg):
    '''data に rafsiを作成して代入'''
    if 'rafsi' not in data:
        data['rafsi'] = {}
    data['rafsi'][util.get_cv(value, True)] = value

def selmaho(data, value, *arg):
    '''data に selmahoを代入'''
    data['selmaho'] = value

def strip_ext(value):
    '''試験的...を削除'''
    return re.sub(r'試験的\s?(\w+).?', '', value)

def definition(data, value, *arg):
    '''data に definition, psを代入'''
    data['def'] = strip_ext(value)
    if data['type'] != 'cmavo':
        ps_num = 0
        for match in re.findall(r'_(\d)\$', value):
            num = int(match)
            if ps_num < num:
                ps_num = num
                data['ps'] = num

RE_EXAM = re.compile(r"「([\w'\.,\-+/ ]+?)(?:\s?[／=]\s?)(.+?)」\s?([(（].+?[)）](?:』）)?)?")
NOTES_PUN = [('ja', '大意'), ('ruby', '読み方'), ('pun', '語呂合わせ'), ('cf', '?関連語?')]
PUN_CH = re.compile(r'(?:(\w+?[(（].+?[）)]))')
PUN_JA = re.compile(r'(?:＜(.+?)＞)')
PUN_EN = re.compile(r'(?:(\w+?))')

def repl(data, key, match):
    '''relacer callback'''
    if key == 'ja':
        add(data, key, match)
    elif key == 'pun':
        # search = PUN.search(match)
        data[key] = match
    elif key == 'cf':
        match = re.sub(r'[{}]', '', match)
        cfs = match.split(';')
        for cfx in cfs:
            add(data, key, [cfw.strip(' 　') for cfw in cfx.split(',')])
    elif key == 'ruby':
        data[key] = match
    return '・'

def notes(data, value, quotation):
    '''data に notes, ja, pun, cf を代入'''
    value = strip_ext(value)
    value = value.replace('’', "'")
    exams = []
    for loj, jaa, cap in RE_EXAM.findall(value):
        exam = [loj, jaa]
        if cap:
            if cap not in quotation:
                quotation.append(cap)
            exam.append(quotation.index(cap))
        exams.append(exam)
        value = RE_EXAM.sub('', value)
    if exams:
        data['exam'] = exams

    value += ' ・'
    for key, jaword in NOTES_PUN:
        reg = '(?:・{0}\\s?[：:]\\s?(.*?)(?:[\\s)）」](?:・|\\s*$)))'.format(jaword)
        value = re.sub(reg, lambda match: repl(data, key, match.group(1)), value)

    value = re.sub(r'・$', '', value).strip(' 　')
    if value:
        data['notes'] = value
