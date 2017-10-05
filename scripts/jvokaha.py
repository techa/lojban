# -*- coding: utf-8 -*-
'''lujvo 分解 tools'''
import sys
from util import get_cv
from jvozba import  normalize

def jvokaha(lujvo: str, trimh=True):
    '''
    lujvo 分解
    '''
    if trimh:
        lujvo = lujvo.replace('h', "'")
    result = _jvokaha(lujvo)
    # filter(lambda x: len(x) != 1, result)
    rafsi_list = [x for x in result if len(x) != 1]

    re_lujvo = ''.join(normalize(rafsi_list))

    if lujvo == re_lujvo:
        return result
    else:
        raise ValueError('malformed lujvo {{{}}} it should be {{{}}}'.format(lujvo, re_lujvo))

def _jvokaha(lujvo: str):
    '''
    jvokaha2("fu'ivla") --> ["fu'i", "vla"]
    jvokaha2("fu'irvla") --> ["fu'i", "r", "vla"]
    jvokaha2("pasymabru") --> ["pas", "y", "mabru"]
    jvokaha2("pasmabru") --> ["pas", "mabru"]
    '''
    original_lujvo = lujvo
    result = []
    while True:
        if lujvo == '':
            return result

        lujvo_cv = get_cv(lujvo)

        # remove hyphen
        if len(result) > 0 and len(result[-1]) != 1:
            if lujvo[0] == 'y' \
            or lujvo[:2] == 'nr' \
            or lujvo[0] == 'r' and lujvo_cv[1] == 'C':
                result.append(lujvo[0])
                lujvo = lujvo[1:]
                continue

        if lujvo_cv[:3] == 'CVV' \
            and lujvo[1:3] in ['ai', 'ei', 'oi', 'au']:
            result.append(lujvo[:3])
            lujvo = lujvo[3:]
            continue

        if lujvo_cv[:4] == "CV'V":
            result.append(lujvo[:4])
            lujvo = lujvo[4:]
            continue

        if lujvo_cv[:5] == 'CVCCY' \
            or lujvo_cv[:5] == 'CCVCY':
            result.append(lujvo[:4])
            result.append('y')
            lujvo = lujvo[5:]
            continue

        if lujvo_cv == 'CVCCV' \
            or lujvo_cv == 'CCVCV':
            result.append(lujvo)
            return result

        if lujvo_cv[:3] == 'CVC' \
            or lujvo_cv[:3] == 'CCV':
            result.append(lujvo[:3])
            lujvo = lujvo[3:]
            continue

        raise ValueError(original_lujvo, lujvo)
    return result

if __name__ == '__main__':
    if len(sys.argv) == 1:
        for _lujvo in ["fu'ivla", 'selbritcita', 'jvokaha', 'sofybakni', 'zgovla']:
            print(_lujvo, jvokaha(_lujvo))
    else:
        for _lujvo in sys.argv[1:]:
            print(_lujvo, jvokaha(_lujvo))
