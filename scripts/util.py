# -*- coding: utf-8 -*-
'''lojban tools'''
import re

ZL = 'dzjbvgtscpfkrlmnx'
def get_cv(text: str, apos=True):
    '''母音をV、子音をCに変換した文字列を返す'''
    cvc = ''
    for char in text:
        if char in 'iuaeo':
            cvc += 'V'
        elif char in ZL:
            cvc += 'C'
        elif char == 'y':
            cvc += 'Y'
        elif char == "'":
            cvc += "'" if apos else ''
        else:
            raise ValueError('There is a character which Lojban does not use:' + text)

    return cvc

CC = (
    #dzjbvgtscpfkrlmnx
    '02211100000021110', # d
    '20022200000011210', # z
    '20022200000011210', # j
    '11101100000022110', # b
    '11110100000022110', # v
    '11111000000022110', # g
    '00000002211121111', # t
    '00000020022222221', # s
    '00000020022222220', # c
    '00000011101122111', # p
    '00000011110122111', # f
    '00000011111022110', # k
    '11111111111101111', # r
    '11111111111110111', # l
    '10111111111122011', # m
    '11111111111111101', # n
    '00000011011022110'  # x
)

def permissible_c(rafsi: str):
    '''2: initial ok; 1: ok; 0: none'''
    return int(CC[ZL.index(rafsi[0])][ZL.index(rafsi[1])])

def is_cmevla(valsi: str):
    '''check cmevla'''
    return len(valsi) > 0 and valsi[-1] not in 'iuaeoy'

SELMAHO_REGS = [
    (
        re.compile(r'^({})(\*)?(\d)?$'.format(reg)),
        reg[:reg.index('|')]
    ) for reg in [
        'JOI|JA|A|BIhI|VUhU|JOhI',
        'NAhE|FEhE|MOhI',
        'BAI|KI|PU|ZI|ZEhA|FAhA|VA|VEhA|VIhA|TAhE|ZAhO|CAhA|CUhE',
        'LE|LA',
        'UI|FUhE|CAI|NAI|DAhO|FUhO|RAhO|GAhO',
        'ME|NUhA',
        'BY|LAU|TEI|FOI'
    ]
]
def selmaho2(selmaho: str):
    '''selmahoを代入'''
    for reg in SELMAHO_REGS:
        if re.search(reg[0], selmaho):
            return reg[1]

# https://mw.lojban.org/papri/Tansky-Lechevalier_scoring_algorithm
def lujvo_score(rafsis: list):
    '''
    score が小さいほうが良いlujvo
    '''
    lujvo = ''.join(rafsis)
    # 1. Count the total number of letters, including hyphens and apostrophes; call it "L".
    L = len(lujvo)
    # 2. Count the number of apostrophes; call it "A".
    A = len(lujvo.split("'")) - 1
    # 3. Count the number of "y"-, "r"-, and "n"-hyphens; call it "H".
    H = 0
    # 4. For each rafsi, find the value in the following table.
    #    Sum this value over all rafsi; call it "R":
    R = 0
    for x in rafsis:
        cv = get_cv(x)
        if cv == 'C' or cv == 'Y':
            H += 1
        elif cv == 'CVCCV':
            R += 1
        elif cv == 'CVCC':
            R += 2
        elif cv == 'CCVCV':
            R += 3
        elif cv == 'CCVC':
            R += 4
        elif cv == 'CVC':
            R += 5
        elif cv == "CV'V":
            R += 6
        elif cv == 'CCV':
            R += 7
        elif cv == 'CVV':
            R += 8
    # 5. Count the number of vowels, not including "y"; call it "V".
    V = len(re.findall(r'[aeiou]', lujvo))
    # 6. The score is then: (1000 * L) - (500 * A) + (100 * H) - (10 * R) - V
    return (1000 * L) - (500 * A) + (100 * H) - (10 * R) - V
