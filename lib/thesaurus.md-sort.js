/**
 * command> node lib/thesaurus.md-sort.js
 * https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
 * https://nodejs.org/dist/latest-v6.x/docs/api/process.html#process_process_argv
 */

const [,, ...argv] = process.argv
const fs = require('fs')
const readFilePath = './data/origin/thesaurus.md'
const writeFilePath = './data/origin/thesaurus.md'

const originText = fs.readFileSync(readFilePath, 'utf8')
const lines = originText
  .split(/[\r?\n]/)
  .filter((lines) => lines) // ????
let expText = ''

// remove Table Header prefix
expText += lines.splice(0, 2).join('\n') + '\n'

function sort (compare) {
  expText += lines
    .map((line) => line.split('|'))
    .sort(compare)
    .map((cells) => cells.join('|'))
    .join('\n')
}
const ascii = 'abcdefghijklmnopqrstuvwxyz'
const zerci = 'yiuaeodzjbvgtscpfkrlmnxhqw'
const zer   = 'ʌɪuɔcodzǝbtyqsepfkjlɴnxħŋɛ'
function zerciiNum (gismu) {
  let st = ''
  for (let i = 0; i < gismu.length; i++) {
    st += ascii[zerci.indexOf(gismu[i])]
  }
  return st
}
function ascii2zerci (gismu) {
  let st = ''
  for (let i = 0; i < gismu.length; i++) {
    st += zer[zerci.indexOf(gismu[i])]
  }
  return st
}
function zerci2ascii (gismu) {
  let st = ''
  for (let i = 0; i < gismu.length; i++) {
    st += zerci[zer.indexOf(gismu[i])]
  }
  return st
}

if (/addnum/i.test(argv[0])) {
  // add number
  expText += lines
    .map((line, i) => `|${i + 1}` + line)
    .join('\n')
} else if (/addzer/i.test(argv[0])) {
  // add zercii
  expText += lines
    .map((line, i) => {
      return line.slice(0, 17) +
        ascii2zerci(line.slice(9, 14)) + ' | ' +
        line.slice(17)
    })
    .join('\n')
} else if (argv[0] === 're') {
  if (argv[1] === 'num') {
    // re number
    expText += lines
      .map((line, i) => {
        const stri = i + 1 + ''
        return `|${stri.padStart(5)}` + line.slice(6)
      })
      .join('\n')
  } else {
    // re zercii / ascii
    let parser
    lines.some((line) => {
      const gismu = line.slice(9, 14)
      if (/[ʌɪɔəɴħŋɛ]/.test(gismu)) {
        parser = zerci2ascii
        return 'zer'
      }
      if (/[yiamhqw]/.test(gismu)) {
        parser = ascii2zerci
        return 'abc'
      }
      return false
    })
    expText += lines
      .map((line, i) => {
        return line.slice(0, 9) +
          parser(line.slice(9, 14)) +
          line.slice(14)
      })
      .join('\n')
  }
} else {
  // sort
  const col = parseInt(argv[0]) || {
    num: 1,
    ABC: 2,
    abc: 2,
    zercii: 3
  }[argv[0]] || 1

  switch (col) {
    // Numberでソート
    case 1:
      sort((a, b) => {
        return parseInt(a[col]) > parseInt(b[col]) ? 1 : -1
      })
      break
    // gismuをアルファベット順でソート
    case 2:
      sort((a, b) => {
        return a[col].trim() > b[col].trim() ? 1 : -1
      })
      break
    // gismuをゼルシー順でソート
    case 3:
      sort((a, b) => {
        const _a = zerciiNum(a[2].trim())
        const _b = zerciiNum(b[2].trim())
        return _a > _b ? 1 : -1
      })
      break

    default:
      console.warn('無効なコマンド')
      break
  }
}

fs.writeFile(writeFilePath, expText, function (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    console.log('saved')
  }
})
