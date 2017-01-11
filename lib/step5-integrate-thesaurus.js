'use strict'
const _ = require('lodash')
const fs = require('fs')
const CONSTANT = require('./constant')
const KEY_NAMES = CONSTANT.KEY_NAMES
const fileName = 'thesaurus'

const DICTIONARY_FILE_PATH = './data/result/dictionary.json'
var dictionary = JSON.parse(fs.readFileSync(DICTIONARY_FILE_PATH, 'utf8'))
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

      // dictionary
      if (dictionary[key]) {
        // GLOSSWORD_EN
        if (dictionary[key][KEY_NAMES.GLOSSWORD_EN]) {
          if (!dictionary[key][KEY_NAMES.GLOSSWORD_EN].includes(value[3])) {
            dictionary[key][KEY_NAMES.GLOSSWORD_EN].push(value[3])
          }
          dictionary[key][KEY_NAMES.GLOSSWORD_EN] = _.uniq(dictionary[key][KEY_NAMES.GLOSSWORD_EN])
        } else {
          dictionary[key][KEY_NAMES.GLOSSWORD_EN] = [value[3]]
        }
        // THESAURUS_IDS
        if (dictionary[key][KEY_NAMES.THESAURUS_IDS] &&
          !dictionary[key][KEY_NAMES.THESAURUS_IDS].includes(+value[1])) {
          dictionary[key][KEY_NAMES.THESAURUS_IDS].push(+value[1])
        } else {
          dictionary[key][KEY_NAMES.THESAURUS_IDS] = [+value[1]]
        }
      } else {
        console.log('dictionaryに存在しない単語' + key)
      }
    }
  })

const thesaurusCount = {}
fs.readFileSync('./data/origin/' + fileName + '.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach(value => {
    value = value.split(/\t/)
    if (value) {
      var key = value[0].trim()
      const thesaurusJA = value.slice(2)
      Object.assign(thesaurus[key] || {}, {
        [KEY_NAMES.GLOSSWORD]: value[1],
        [KEY_NAMES.THESAURUS_JA]: thesaurusJA
      })

      // thesaurusCount
      thesaurusJA.forEach((word, i) => {
        if (!thesaurusCount[word]) {
          thesaurusCount[word] = {
            word: '  '.repeat(i) + (i ? '- ' : '') + word + (i ? '' : ':'),
            sort: thesaurusJA.join(''),
            count: 0,
            rafsi: [0, 0, 0, 0]
          }
        }
        thesaurusCount[word].count++
        if (dictionary[key]) {
          if (dictionary[key][KEY_NAMES.RAFSI]) {
            thesaurusCount[word].rafsi[Object.keys(dictionary[key][KEY_NAMES.RAFSI]).length]++
          } else {
            thesaurusCount[word].rafsi[0]++
          }
        }
      })

      // dictionary
      if (dictionary[key]) {
        if (dictionary[key][KEY_NAMES.GLOSSWORD]) {
          if (!dictionary[key][KEY_NAMES.GLOSSWORD].includes(value[1])) {
            dictionary[key][KEY_NAMES.GLOSSWORD].push(value[1])
          }
        } else {
          dictionary[key][KEY_NAMES.GLOSSWORD] = [value[1]]
        }
        dictionary[key][KEY_NAMES.THESAURUS_JA] = thesaurusJA
      }
    }
  })

// function stringCount (str) {
//   var r = 0
//   for (var i = 0; i < str.length; i++) {
//     var c = str.charCodeAt(i)
//     if (' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.indexOf(c) >= 0) {
//       r += 1
//     } else {
//       r += 2
//     }
//   }
//   return r
// }
// // http://www.geocities.jp/scs00046/pages/2006112701.html
// function countLength (str) {
//   var r = 0
//   for (var i = 0; i < str.length; i++) {
//     var c = str.charCodeAt(i)
//     // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
//     // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
//     if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
//       r += 1
//     } else {
//       r += 2
//     }
//   }
//   return r
// }
function strLength (str) {
  let len = 0
  str = escape(str)
  for (let i = 0; i < str.length; i++, len++) {
    if (str.charAt(i) === '%') {
      if (str.charAt(++i) === 'u') {
        i += 3
        len++
      }
      i++
    }
  }
  return len
}
const thesaurusMemo = _.chain(thesaurusCount).values().value().map(({word, count, rafsi}) => {
  let rafsicount = rafsi.reduce((str, raf) => {
    return str + ' -' + ' '.repeat(3 - (raf + '').length) + raf
  }, '')
  let text = `${word} # (${count})`
  text += ' '.repeat(30 - strLength(text)) + rafsicount
  console.log(text)
  return text
})
fs.writeFile('./memo/thesaurus.yml', thesaurusMemo.join('\n'), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('js saved to ./data/neatly/' + fileName + '.txt')
  }
})

var thesaurusEN = []
fs.readFileSync('./data/origin/' + fileName + '-en.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach(value => {
    value = value.match(/([0-9]{6}) (.{5}) (.+)/)
    if (value) {
      const idnum = value[1]
      var key = value[2].trim()
      var word = (dictionary[key][KEY_NAMES.GLOSSWORD] || [])[0] || ''
      for (var i = word.length; i < 8; i++) {
        word += '　'
      }
      if (_.findIndex(thesaurusEN, [idnum, key]) === -1) {
        thesaurusEN.push([
          idnum,
          key,
          thesaurus[key][KEY_NAMES.THESAURUS_IDS].join('-'),
          `${idnum} ${key} ${word} ${thesaurus[key][KEY_NAMES.THESAURUS_JA] || '--'}`
        ])
      }
    }
  })
  // _.sortBy(thesaurusEN, 0).map(v => v[1]).join("\n")

fs.writeFile('./data/neatly/' + fileName + '.txt', _.chain(thesaurusEN).sortBy(2).sortBy(0).map(v => v[3]).join('\n'), function (err) {
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

// Format as a dictionary string
fs.writeFile(DICTIONARY_FILE_PATH, JSON.stringify(dictionary, 2, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('output JSON ' + DICTIONARY_FILE_PATH)
  }
})
