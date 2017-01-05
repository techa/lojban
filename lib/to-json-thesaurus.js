const fs = require('fs')
const common = require('./common')
const apostrophe = common.apostrophe
const keynames = common.keynames

const fileName = 'thesaurus'

var thesaurus = {}
fs.readFileSync('./data/origin/' + fileName + '-en.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach((value) => {
    value = value.match(/([0-9]{6}) ([^ ]+) +(.+)/)
    if (value) {
      var key = value[2].replace(/'/, apostrophe)
      if (thesaurus[key]) {
        thesaurus[key][keynames.thesaurusIDs].push(+value[1])
      // console.log("複数に分類される。" + key + thesaurus[key].thesaurus.length)
      } else {
        thesaurus[key] = {
          [keynames.glosswordEN]: value[3],
          [keynames.thesaurusIDs]: [+value[1]]
        }
      }
    }
  })
fs.readFileSync('./data/origin/' + fileName + '.txt', 'utf8')
  .split(/[\r\n]/)
  .forEach((value) => {
    value = value.split(/\t/)
    if (value) {
      Object.assign(thesaurus[value[0].replace(/'/, apostrophe)] || {}, {
        [keynames.glossword]: value[1],
        [keynames.thesaurusJA]: value.slice(2)
      })
    }
  })

fs.writeFile('./data/neatly/' + fileName + '.json', JSON.stringify(thesaurus, null, 2), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('js saved to ./data/neatly/' + fileName + '.json')
  }
})
