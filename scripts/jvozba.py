# -*- coding: utf-8 -*-
'''lujvo 合成 tools'''
import json
import re
from util import lujvo_score, get_cv, permissible_c, is_cmevla

def jvozba(parts: list, forbid_la_lai_doi=False):
    '''
    lujvo 合成
    '''
    rafsis_ary = [get_candid(raf, i == len(parts) - 1) for i, raf in enumerate(parts)]

    def maps(rafsi_list):
        '''
        answer results
        '''
        result = normalize(rafsi_list)
        return {'lujvo': ''.join(result), 'score': lujvo_score(result)}

    answers = [maps(x) for x in create_every_possibility(rafsis_ary)]

    def la_lai_doi(lujvo):
        '''
        filter function:
        '''
        return not (
            is_cmevla(lujvo) and forbid_la_lai_doi and (
                re.search(r'^(lai|doi)', lujvo) or\
                re.search(r'[aeiouy](lai|doi)', lujvo) or\
                re.search(r'^la[^u]', lujvo) or\
                re.search(r'[aeiouy]la[^u]', lujvo)
            )
        )

    answersf = [x for x in answers if la_lai_doi(x['lujvo'])]
    return sorted(answersf, key=lambda an: an['score'])


def normalize(rafsi_list):
    '''
    rafsi_listにlujvoとして繋げる際に必要なhyphen文字を補完
    '''
    rafsis = rafsi_list[:]
    result = [rafsis.pop()]
    while rafsis:
        rafsi = rafsis.pop()
        rafsi_cv = get_cv(rafsi)

        end = rafsi[-1]
        init = result[0][0]

        if rafsi_cv == 'CVCC' or rafsi_cv == 'CCVC':
            result.insert(0, 'y')
        elif get_cv(end) == 'C' \
            and get_cv(init) == 'C' \
            and permissible_c(end + init) == 0:
            result.insert(0, 'y')
        elif end == 'n' and result[0][:2] in ['ts', 'tc', 'dz', 'dj']:
            result.insert(0, 'y')
        elif not rafsis:
            if rafsi_cv == 'CVV' or rafsi_cv == "CV'V":
                if len(rafsi_list) > 2 or not get_cv(result[0]) == 'CCV':
                    hyphen = 'n' if result[0][0] == 'r' else 'r'
                    result.insert(0, hyphen)

            elif rafsi_cv == 'CVC' and tosmabru(rafsi, result):
                result.insert(0, 'y')

        result.insert(0, rafsi)
    return result

# tosmabru test
# https://mw.lojban.org/papri/tosmabru
def tosmabru(rafsi, rest):
    '''
    tosmabru test
    '''
    if is_cmevla(rest[-1]):
        return

    index = 0
    for i, resti in enumerate(rest):
        resti_cv = get_cv(resti)
        if resti_cv == 'CVC':
            continue
        index = i
        if resti == 'y' or (resti_cv == 'CVCCV' and permissible_c(resti[2:4]) == 2):
            break
        else:
            return False

    tmp1 = rafsi
    tmp2 = rest[0]
    j = 0
    while True:
        if tmp2 == 'y':
            return True
        if permissible_c(tmp1[-1] + tmp2[0]) != 2:
            return False

        j += 1
        tmp1 = tmp2
        tmp2 = rest[j]
        if j > index:
            break
    return True

def create_every_possibility(rafsi_list):
    '''
    可能性のある組み合わせを全て返す
    '''
    ary = rafsi_list[:]

    if not len(ary):
        return [[]]

    rafsis = ary.pop()
    result = []

    for rafs in rafsis:
        result += [f + [rafs] for f in create_every_possibility(ary)]
    return result


JSON_PATH = './data/origin/jbovlaste.json'
with open(JSON_PATH, 'r', encoding='utf-8') as text:
    DICTIONARY = json.loads(text.read())

def get_candid(valsi, islast=False):
    '''
    get_candid("bloti", false) ==> ["lot", "blo", "lo'i", "blot"]
    get_candid("gismu", true)  ==> ["gim", "gi'u", "gismu", "gism"]
    '''
    for data in DICTIONARY['words']:
        if data['word'] == valsi:
            if data['type'] == 'cmavo':
                return list(data['rafsi'].values())
            elif data['type'] == 'gismu':
                gismu = valsi
                candid = list(data['rafsi'].values())

                if islast:
                    candid.append(gismu)

                gism = gismu[:-1]
                if gism != 'brod':
                    candid.append(gism)
                return candid
    print('not found')

if __name__ == '__main__':
    # if sys.argv[1]:
    print(create_every_possibility([[1, 11], [2], [3, 33, 333]]))
    print(get_candid("gismu", True))
    for answer in jvozba(['lujvo', 'zbasu']):
        print(answer['lujvo'], answer['score'])
