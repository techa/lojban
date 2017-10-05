# -*- coding: utf-8 -*-
'''lojban dictionary'''
import sys, json
class Dictionary:
    def __init__(self, json_path='./data/origin/jbovlaste.json'):
        with open(json_path, 'r', encoding='utf-8') as text:
            DICTIONARY = json.loads(text.read())
            self.words = DICTIONARY['words']
            self.quotations = DICTIONARY['quotations']
            self.users = DICTIONARY['users']

    def get_word(self, valsi):
        for data in self.words:
            if data['word'] == valsi:
                return data
        for data in self.words:
            if valsi in data['rafsi'].values():
                return data
    def get_words(self, *valsis):
        return [self.get_word(valsi) for valsi in valsis]


