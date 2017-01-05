/**
 * frequencyフォルダの中にあるtxtデータから単語登場頻度を分析して
 * neatly/frequency.jsonに保存
 * step4-integrate-frequencyを実行してdictionaryファイルにデータ追加を行うこと
 */
'use strict'
const _ = require('lodash')
const fs = require('fs')

const OUTPUT_FILE_NAME = './data/neatly/frequency.json'

var frequency = {}
var frequencyOnly = {}

// frequencyフォルダの全てのtxtデータをfrequencyに解析して加える=================================
fs.readdirSync('./frequency').forEach((fileName) => {
  let loj = 0
  let notloj = 0
  fs.readFileSync('./frequency/' + fileName, 'utf8')
    .replace(/[ìí]/g, 'i')
    .replace(/[ùú]/g, 'u')
    .replace(/[àá]/g, 'a')
    .replace(/[òó]/g, 'o')
    .replace(/[èé]/g, 'e')
    .split(/[\s,"\(\)\[\]:;\*\-+=\?!\/«»0-9]+/)
    .forEach((value) => {
      value = value.replace(/^\./, '')
      if (/^[iuaeoydzjbvgtscpfkrlnmx']*[iuaeoy]$/.test(value)) {
        if (!frequency[value]) {
          frequency[value] = 0
        }
        frequency[value]++
        loj++
      } else {
        if (!frequencyOnly[value]) {
          frequencyOnly[value] = 0
        }
        frequencyOnly[value]++
        notloj++
      }
    })
  console.log(`lo: ${loj}, not: ${notloj} ,total:${loj + notloj}`, fileName)
})

// ソートした配列に (lodash)=================================
frequency = _.chain(frequency).pairs().sortBy('1').reverse().value()
//
console.log('frequency size = ' + frequency.length)
console.log('frequencyOnly  = ' + Object.keys(frequencyOnly).length)

// ファイル出力=================================
fs.writeFile(OUTPUT_FILE_NAME, JSON.stringify(_.zipObject(frequency), null, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('frequency saved ' + OUTPUT_FILE_NAME)
  }
})
module.exports = frequency
