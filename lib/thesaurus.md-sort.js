const fs = require('fs')

const fileName = './data/origin/thesaurus.md'
// node lib/thesaurus.md-sort.js

let text = fs.readFileSync(fileName, 'utf8')
  .split(/[\r?\n]/)

let prefix = text.slice(0, 2).join('\n')

// text = text
// .slice(2)
// .map((value, i) => `|${i + 1}` + value)
// .join('\n')

const row = 2
text = text.slice(2)
  .map((value, i) => value.split('|'))
  .sort((a, b) => {
    return a[row] > b[row] ? 1 : -1
  })
  .map((value, i) => value.join('|'))
  .join('\n')

fs.writeFile(fileName, prefix + '\n' + text, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('js saved to ' + fileName)
  }
})
