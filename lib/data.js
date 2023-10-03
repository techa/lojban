/**
 * node lib/data.js
 * dictionary データ分析
 */

const [,, ...argv] = process.argv
const fs = require('fs-extra')
const {PARSER} = require('./constant')

const DICTIONARY_FILE_PATH = './data/result/dictionary.json'
const dictionary = fs.readJsonSync(DICTIONARY_FILE_PATH, 'utf8')

const types = {
  gismu: 0,
  cmavo: 0,
  lujvo: 0,
}
const shapes = {
  CCVcv: 0,
  cVCCv: 0,
  cVccv: 0,
}
const {PREFIX_CC, PERMIT_CC, CONSONANT, VOWEL} = PARSER
const re = {
  CCVcv: new RegExp(`${PREFIX_CC}[${VOWEL}][${CONSONANT}][${VOWEL}]`),
  cVCCv: new RegExp(`[${CONSONANT}][${VOWEL}]${PREFIX_CC}[${VOWEL}]`),
  cVccv: new RegExp(`[${CONSONANT}][${VOWEL}]${PERMIT_CC}[${VOWEL}]`),
  CC: new RegExp(`${PREFIX_CC}`),
  cc: new RegExp(`${PERMIT_CC}`),
}
const cc = {
  CC: 0,
  cc: 0,
}

for (const key in dictionary) {
  const {type, word} = dictionary[key]

  if (!types[type]) {
    types[type] = 0
  }
  types[type]++

  // gismu
  if (type === 'gismu') {
    if (re.CCVcv.test(word)) {
      shapes.CCVcv++
    } else if (re.cVCCv.test(word)) {
      shapes.cVCCv++
    } else if (re.cVccv.test(word)) {
      shapes.cVccv++
    }

    // cc
    let match
    if ((match = word.match(re.CC))) {
      cc.CC++
    } else if ((match = word.match(re.cc))) {
      cc.cc++
    }
    cc[match[0]] = (cc[match[0]] || 0) + 1
  }
}
console.log('types', types)
console.log('shapes', shapes)
console.log('cc.CC', cc.CC, 'cc.cc', cc.cc)

console.log('ccs', Object.entries(cc)
  .sort((a, b) => b[1] - a[1])
  .filter((item) => !re.CC.test(item[0]))
  .reduce((a, b) => {
    a[b[0]] = b[1]
    return a
  }, {})
)
