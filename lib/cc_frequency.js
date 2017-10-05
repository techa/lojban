import fs from 'fs'
import { PARSER } from './constant.js'

function ccFrequency (text) {
  let index = -1
  const result = []
  const data = {}

  do {
    index = text.indexOf(/[dzjbvgtscpfkrlmnx][dzjbvgtscpfkrlmnx]/, index + 1)
    const cc = text[index] + text[index + 1]
    const prefix = text[index - 1]
    const suffix = /\W|\r|\n|\r\n/.exec(text[index + 2]) ? '-' : text[index + 2]
    data[cc] = data[cc] || {
      count: 0,
      prefix: [],
      suffix: [],
    }
    data[cc].count++
    if (!data[cc].prefix.includes(prefix)) {
      data[cc].prefix.push(prefix)
    }
    if (!data[cc].prefix.includes(suffix)) {
      data[cc].prefix.push(suffix)
    }
  } while (text.length > index && index > -1)
}
