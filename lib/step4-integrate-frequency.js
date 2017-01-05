'use strict'
const _ = require('lodash')
const fs = require('fs')
// const Dictionary = require("dictionary")
const LojbanUtil = require('./loj-util')
const CONSTANT = require('./constant')
const KEY_NAMES = CONSTANT.KEY_NAMES

const DICTIONARY_FILE_PATH = './data/result/dictionary.json'
const INPUT_FILE_NAME = './data/neatly/frequency.json'
const OUTPUT_FILE_NAME = './data/result/frequency.json'

// var dictionary = new Dictionary(DICTIONARY_FILE_PATH)
var dictionary = JSON.parse(fs.readFileSync(DICTIONARY_FILE_PATH, 'utf8'))
var frequency = JSON.parse(fs.readFileSync(INPUT_FILE_NAME, 'utf8'))

// lujvo分解の時rafsiであるかどうかの判断の為に用いる。
// rafsimap.has(分解したもの)で判定する。
var rafsimap = new Map()
var rafsimap2 = new Map()

// dictionaryにfrequencyScore用のobjectを追加
// rafsimap
Object.keys(dictionary).forEach((word) => {
  let valsi = dictionary[word]
  dictionary[word][KEY_NAMES.FREQUENCY_SCORE] = {[word]: 0}
  rafsimap.set(word, word)

  if (valsi[KEY_NAMES.TYPE] === 'gismu') {
    dictionary[word][KEY_NAMES.FREQUENCY_SCORE][word.replace(/.$/, '')] = 0
    rafsimap.set(word.slice(0, -1), word)
  }
  if (valsi[KEY_NAMES.RAFSI]) {
    Object.keys(valsi[KEY_NAMES.RAFSI]).forEach(k => {
      let v = valsi[KEY_NAMES.RAFSI][k]
      dictionary[word][KEY_NAMES.FREQUENCY_SCORE][v] = 0
      if (rafsimap.has(v)) {
        rafsimap2.set(v, word)
      } else {
        rafsimap.set(v, word)
      }
    })
  }
})

// 分解してnewFrequencyを新たに作成==================
var util = new LojbanUtil()
let n = 0
let newFrequency = {}
let frequencyRank = {}
// ----------------------------------------------------
Object.keys(frequency).forEach((word) => {
  // let valsi = dictionary[word]
  let score = frequency[word]

  if (rafsimap.has(word)) {
    if (!newFrequency[ word ]) {
      newFrequency[ word ] = 0
    }
    newFrequency[ word ] += score

    if (!frequencyRank[ rafsimap.get(word) ]) {
      frequencyRank[ rafsimap.get(word) ] = 0
    }
    frequencyRank[ rafsimap.get(word) ] += score

    dictionary[ rafsimap.get(word) ][KEY_NAMES.FREQUENCY_SCORE][ word ] += score
  } else {
    // lujvo分解！！
    let rafsis = util.spliter(word, rafsimap)
    rafsis.forEach(v => {
      if (!newFrequency[ v ]) {
        newFrequency[ v ] = 0
      }
      newFrequency[ v ] += score

      let wordkey = rafsimap.get(v)
      if (!frequencyRank[ wordkey ]) {
        frequencyRank[ wordkey ] = 0
      }
      frequencyRank[ wordkey ] += +score

      dictionary[ wordkey ][KEY_NAMES.FREQUENCY_SCORE][ v ] += score
    })
    if (!rafsis.length) {
      n++
    }
  }
})
console.log('frequencyのうち分解できなかった単語の数  =', n + ' / ' + Object.keys(frequency).length)

// Rank============================================================================
let rank = 1
frequencyRank = _.chain(frequencyRank)
  .pairs()
  .sortBy(1)
  .reverse()
  .value()
frequencyRank.reduce((prev, cur, i) => {
  // 100回以上登場した単語はランク順位を付ける
  if (dictionary[cur[0]] && cur[1] > 100) {
    if (prev[1] > cur[1]) {
      rank = i + 1
    }
    dictionary[cur[0]][KEY_NAMES.FREQUENCY_RANK] = rank
  // console.log("ranking", cur, rank)
  }
  return cur
}, ['---', 0])

// Format as a dictionary string
fs.writeFile(DICTIONARY_FILE_PATH, JSON.stringify(dictionary, 2, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('output JSON ' + DICTIONARY_FILE_PATH)
  }
})

// Format as a newFrequency string
fs.writeFile(OUTPUT_FILE_NAME, JSON.stringify(_.zipObject(frequencyRank), null, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('output JSON ' + OUTPUT_FILE_NAME)
  }
})
module.exports = dictionary
