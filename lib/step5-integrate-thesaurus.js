'use strict'
const _ = require('lodash')
const fs = require('fs')
const CONSTANT = require('./constant')
const KEY_NAMES = CONSTANT.KEY_NAMES
const fileName = 'thesaurus'

var thesaurus = {}
fs.readFileSync('./data/origin/' + fileName + '-en.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach(value => {
    value = value.match(/([0-9]{6}) ([^ ]+) +(.+)/)
    if (value) {
      var key = value[2]
      if (thesaurus[key]) {
        thesaurus[key][KEY_NAMES.THESAURUS_IDS].push(+value[1])
      // console.log("複数に分類される。" + key + thesaurus[key].thesaurus.length)
      } else {
        thesaurus[key] = {
          [KEY_NAMES.GLOSSWORD_EN]: value[3],
          [KEY_NAMES.THESAURUS_IDS]: [+value[1]]
        }
      }
    }
  })
fs.readFileSync('./data/origin/' + fileName + '.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach(value => {
    value = value.split(/\t/)
    if (value) {
      Object.assign(thesaurus[value[0]] || {}, {
        [KEY_NAMES.GLOSSWORD]: value[1],
        [KEY_NAMES.THESAURUS_JA]: value.slice(2)
      })
    }
  })

const DICTIONARY_FILE_PATH = './data/result/dictionary.json'
var dictionary = JSON.parse(fs.readFileSync(DICTIONARY_FILE_PATH, 'utf8'))

var thesaurusEN = []
fs.readFileSync('./data/origin/' + fileName + '-en.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach(value => {
    value = value.match(/([0-9]{6}) (.{5}) (.+)/)
    if (value) {
      var key = value[2].trim()
      var word = (dictionary[key][KEY_NAMES.GLOSSWORD] || [])[0] || ''
      for (var i = word.length; i < 8; i++) {
        word += '　'
      }
      thesaurusEN.push([
        value[1],
        thesaurus[key][KEY_NAMES.THESAURUS_IDS].join('-'),
        `${value[1]} ${value[2]} ${word} ${thesaurus[key][KEY_NAMES.THESAURUS_JA]}`
      ])
    }
  })
  // _.sortBy(thesaurusEN, 0).map(v => v[1]).join("\n")

fs.writeFile('./data/neatly/' + fileName + '.txt', _.chain(thesaurusEN).sortBy(1).sortBy(0).map(v => v[2]).join('\n'), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('js saved to ./data/neatly/' + fileName + '.txt')
  }
})

fs.writeFile('./data/neatly/' + fileName + '.json', JSON.stringify(thesaurus, null, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('js saved to ./data/neatly/' + fileName + '.json')
  }
})
