/**
 * step2-xml2jsで作成したデータを整理再構成して出力する
 * 例文、大意、読み方、語呂合わせ、関連語などをそれぞれの項目に分けたり
 * そのほか細々とした表記ブレなどを修正する
 */
'use strict'
const fs = require('fs')
const KEY_NAMES = require('./constant').KEY_NAMES
const DATA = JSON.parse(fs.readFileSync('./data/neatly/xml-export.json', 'utf8'))
const OUTPUT_FILE_NAME = './data/result/dictionary.json'

// 最終的に出力するオブジェクト
let dictionary = {}

// DATAは { valsis:[], nlwords:[] }の構造をしている
// まずはvalsisを整理してdictionaryに格納
DATA.valsis.forEach((valsi) => {
  // word & type  ===============================================================================
  let word = valsi.word
  // dictionaryに格納する単語データオブジェクト
  let wordData = {
    [KEY_NAMES.WORD]: valsi.word,
    [KEY_NAMES.TYPE]: valsi.type.replace(/experimental /g, '').replace('bu-letteral', 'cmavo')
  }

  // selmaho  ==================================================================================
  if (valsi.selmaho) {
    wordData[KEY_NAMES.SELMAHO] = valsi.selmaho
  }
  // selma'o (cmavo 類名)の統合と破棄   https://mw.lojban.org/papri/文法改良案
  [
    [/^(JOI|JA|A|BIhI|VUhU|JOhI)\*?\d?$/, 'JOI'],
    [/^(FEhE|MOhI|NAhE)\*?\d?$/, 'NAhE'],
    [/^(KI|BAI|PU|ZI|ZEhA|FAhA|VA|VEhA|VIhA|TAhE|ZAhO|CAhA|CUhE)\*?\d?$/, 'BAI'],
    [/^(LA|LE)\*?\d?$/, 'LE'],
    [/^(FUhE|UI|CAI|NAI|DAhO|FUhO|RAhO|GAhO)\*?\d?[ab]?$/, 'UI'],
    [/^(ME|NUhA)\*?\d?$/, 'ME'],
    [/^(LAU|TEI|FOI|BY)\*?\d?$/, 'BY']
  ].some(parser => {
    if (parser[0].test(valsi.selmaho)) {
      wordData[KEY_NAMES.SELMAHO_IMPROVEMENT] = parser[1]
    }
  })

  // rafsi  =================================================================================
  if (typeof valsi.rafsi === 'string') {
    valsi.rafsi = [valsi.rafsi]
  }
  if (valsi.rafsi) {
    wordData[KEY_NAMES.RAFSI] = {} // { CVC:, CCV:, CVV: }
    valsi.rafsi.forEach(v => {
      wordData[KEY_NAMES.RAFSI][v.replace(/'?[iuaeo]/g, 'V').replace(/[^iuaeoV]/g, 'C')] = v
    })
  }

  // valsi.glosswordをsetGlossword、setSenseに格納============================================
  let setGlossword = wordData[KEY_NAMES.GLOSSWORD] = new Set()
  let setSense = wordData[KEY_NAMES.SENSE] = new Set()

  if (valsi.glossword && valsi.glossword[0]) {
    valsi.glossword.forEach(v => setGlossword.add(v.word))
    valsi.glossword.forEach(v => {
      if (v.sense && !setGlossword.has(v.sense)) {
        setSense.add(v.sense)
      }
    })
  }
  // DEFINITION =================================================================================
  let definition = wordData[KEY_NAMES.DEFINITION] = (valsi.definition || '').replace(/試験的\s?(cmavo|gismu).?/, '')
  if (definition && valsi.type !== 'cmavo') {
    let ps = 0
    ;(definition.match(/\w\w?_\w\$/g) || []).forEach(v => {
      let i = +v.match(/_(\d)\$/)[1]
      if (ps < i) {
        ps = i
      }
    })
    if (ps) {
      wordData[KEY_NAMES.PS_NUMBER] = ps
    }
  }

  // NOTES==================================================================================
  let notes = wordData[KEY_NAMES.NOTES] = (valsi.notes || '').replace(/試験的\s?(cmavo|gismu).?/, '')

  // 例文exampleSentencesを分離して配列に----------------------------------------
  notes = notes
    .replace('’', "'")
    .replace(/(「[\w'\.,\-\+\/ ]+?)(\s?[／=]\s?)(.+?」\s?(?:[\(（].+?[\)）])?(』）)?)/g, (match, p1, p2, p3) => {
      if (!wordData[KEY_NAMES.EXAMPLE_SENTENCES]) {
        wordData[KEY_NAMES.EXAMPLE_SENTENCES] = []
      }
      wordData[KEY_NAMES.EXAMPLE_SENTENCES].push((p1 + '／' + p3).trim())
      return ''
    })
  // 大意,読み方,語呂合わせ,関連語を分離----------------------
  // "・"で区切られていることを利用している
  if (notes) {
    notes += ' ・'
    ;[
      [KEY_NAMES.GLOSSWORD, '大意'],
      [KEY_NAMES.RUBY, '読み方'],
      [KEY_NAMES.PUN, '語呂合わせ'],
      [KEY_NAMES.CONNECTIONS, '?関連語?']
    ].forEach(parser => {
      // ・に挟まれたものをnotesから切り出す・
      notes = notes.replace(new RegExp(`(?:・${parser[1]}\\s?[：:]\\s?(.*?)(?:[\\s\\)）」]・))`, 'g'), (match, p1) => {
        if (p1) {
          wordData[parser[0]] = p1.trim()
        }
        return '・'
      })
    })

    // remove "・"
    notes = notes.slice(0, -1).trim()

    if (notes) {
      wordData[KEY_NAMES.NOTES] = notes
    } else {
      delete wordData[KEY_NAMES.NOTES]
    }

    // 大意----------------------------------------
    if (typeof wordData[KEY_NAMES.GLOSSWORD] === 'string') {
      setGlossword.add(wordData[KEY_NAMES.GLOSSWORD])
    }
    // 読み方を削除----------------------------------------
    if (wordData[KEY_NAMES.RUBY]) {
      delete wordData[KEY_NAMES.RUBY]
    }

    // lujvo notes -> cf--------------------------------------
    if (/(\{\w+\}[ ,]*)+/.test(wordData[KEY_NAMES.NOTES])) {
      let cf = ''
      wordData[KEY_NAMES.NOTES] = wordData[KEY_NAMES.NOTES].replace(/(\{['\w]+\}[ ,;]*)/g, (match, p1) => {
        cf += p1
        return ''
      })

      wordData[KEY_NAMES.CONNECTIONS] = cf + (wordData[KEY_NAMES.CONNECTIONS] ? ' ' + wordData[KEY_NAMES.CONNECTIONS] : '')
      if (!wordData[KEY_NAMES.NOTES]) {
        delete wordData[KEY_NAMES.NOTES]
      }
    }
    // cf 関連語----------------------------------------
    if (wordData[KEY_NAMES.CONNECTIONS]) {
      wordData[KEY_NAMES.CONNECTIONS] = new Set(
        wordData[KEY_NAMES.CONNECTIONS]
          .replace(/[\{\}]/g, '')
          .split(/[ ,;]+/)
          .map(v => v.replace(/[\(（]\s*[^\s\w]+\s*[）\)]/, '').trim())
      )
    }
  }

  wordData[KEY_NAMES.GLOSSWORD] = setGlossword
  wordData[KEY_NAMES.SENSE] = setSense

  // Flgs======================================================================-
  if (/experimental/.test(valsi.type)) {
    wordData[KEY_NAMES.EXPERIMENTAL_FLG] = true
  }
  if (valsi.unofficial) {
    wordData[KEY_NAMES.UNOFFICIAL_FLG] = true
  }

  dictionary[ word ] = wordData
})

DATA.nlwords.forEach((nlword) => {
  // let word = nlword.valsi.replace(/\'/g, APOSTROPHE)
  let word = nlword.valsi
  let wordData = dictionary[ word ]

  if (wordData) {
    if (wordData[KEY_NAMES.GLOSSWORD].has(nlword.word)) {
      dictionary[word][KEY_NAMES.GLOSSWORD].add(nlword.word)
    }
    if (wordData[KEY_NAMES.SENSE].has(nlword.sense)) {
      dictionary[word][KEY_NAMES.SENSE].add(nlword.sense)
    }
  } else {
    console.log(`nlwordsにあってvalsisにない単語  ${word}  がある！`)
  }
})

// dictionary to JSON ==========================================================
// set convert to Array
Object.keys(dictionary).forEach((word) => {
  [KEY_NAMES.GLOSSWORD, KEY_NAMES.SENSE, KEY_NAMES.CONNECTIONS].forEach(keynames => {
    let g = dictionary[ word ][keynames]
    if (g && g.size) {
      dictionary[ word ][keynames] = Array.from(g)
    } else {
      delete dictionary[ word ][keynames]
    }
  })
})

// LOG ================================================================
var testResult = {}
Object.keys(dictionary).forEach((word) => {
  let v = dictionary[word]
  let type = v[KEY_NAMES.TYPE].replace(/[\-'\s]/g, '')
  testResult[type] = (testResult[type] | 0) + 1
})
console.log(testResult)

// dictionary to Array
// dictionary = Object.keys(dictionary).map(word => {
//   return dictionary[ word ]
// })

// Format as a dictionary string
fs.writeFile(OUTPUT_FILE_NAME, JSON.stringify(dictionary, null, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('output JSON ' + OUTPUT_FILE_NAME)
  }
})
module.exports = dictionary
