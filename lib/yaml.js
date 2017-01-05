const YAML = require('yamljs')
const fs = require('fs')

const INPUT_FILE_NAME = './data/result/dictionary.json'
const OUTPUT_FILE_NAME = './data/result/dictionary.yml'

var json = JSON.parse(fs.readFileSync(INPUT_FILE_NAME, 'utf8'))
var ary = Object.keys(json).map(v => json[v])

fs.writeFile(OUTPUT_FILE_NAME, YAML.stringify(ary, 2, 2), err => {
  if (err) {
    console.log(err)
  } else {
    console.log('output YAML ' + OUTPUT_FILE_NAME)
  }
})
