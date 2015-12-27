
const fs = require("fs");
const KEY_NAMES = require("./constant").KEY_NAMES;
const KANA = {
  "'a": "ハ", "'i": "ヒ", "'u": "フ", "'e": "ヘ", "'o": "ホ",
  a :"ア",  i :"イ",  u :"ウ",  e :"エ",  o :"オ",  y:"ァ",
  ka:"カ",  ki:"キ",  ku:"ク",  ke:"ケ",  ko:"コ", ky:"カァ",
  ga:"ガ",  gi:"ギ",  gu:"グ",  ge:"ゲ",  go:"ゴ", gy:"グァ",
  sa:"サ",  si:"スィ",su:"ス",  se:"セ",  so:"ソ", sy:"スァ",
  za:"ザ",  zi:"ズィ",zu:"ズ",  ze:"ゼ",  zo:"ゾ", zy:"ゾァ",
  ca:"シャ",ci:"シ",  cu:"シュ",ce:"シェ",co:"ショ", cy:"シァ",
  ja:"ジャ",ji:"ジ",  ju:"ジュ",je:"ジェ",jo:"ジョ", jy:"ジャ",
  ta:"タ",  ti:"ティ",tu:"トゥ",te:"テ",  to:"ト", ty:"テァ",
  da:"ダ",  di:"ディ",du:"ドゥ",de:"デ",  do:"ド", dy:"ドァ",
  na:"ナ",  ni:"ニ",  nu:"ヌ",  ne:"ネ",  no:"ノ", ny:"ヌァ", n:"ン",
  ba:"バ",  bi:"ビ",  bu:"ブ",  be:"ベ",  bo:"ボ", by:"ブァ",
  pa:"パ",  pi:"ピ",  pu:"プ",  pe:"ペ",  po:"ポ", py:"プァ",
  ma:"マ",  mi:"ミ",  mu:"ム",  me:"メ",  mo:"モ", my:"ムァ",
  ra:"ラ",  ri:"リ",  ru:"ル",  re:"レ",  ro:"ロ", ry:"ロァ",
  la:"ルァ",li:"ルィ",lu:"ルゥ",le:"ルェ",lo:"ルォ", ly:"ルゥァ",
  fa:"ファ",fi:"フィ",fu:"フ",  fe:"フェ",fo:"フォ", fy:"ファ",
  va:"ヴァ",vi:"ヴィ",vu:"ヴ",  ve:"ヴェ",vo:"ヴォ", vy:"ヴォァ",
  xa:"クァ",xi:"クィ",xu:"クゥ",xe:"クェ",xo:"クォ", xy:"クァ",
  dza:"ヅァ",dzi:"ヅィ",dzu:"ヅ",  dze:"ヅェ",dzo:"ヅォ",
  dja:"ヂャ",dji:"ヂィ",dju:"ヂュ",dje:"ヂェ",djo:"ヂョ",
  tsa:"ツァ",tsi:"ツィ",tsu:"ツ",  tse:"ツェ",tso:"ツォ",
  tca:"チャ",tci:"チ",  tcu:"チュ",tce:"チェ",tco:"チョ"
};

// word
// type
// SELMAHO
// RAFSI
// 以下変更可能項目------
// DEFINITION
// NOTES
// EXAMPLE_SENTENCES
// GLOSSWORD  {set}
// GLOSSWORD_EN
// PUN
// CONNECTIONS  {set}
//
const set_keys = [KEY_NAMES.GLOSSWORD, KEY_NAMES.CONNECTIONS];
class Valsi {
  constructor(data) {
    this.data = data
    set_keys.forEach(v => this.data[v] = new Set(this.data[v]))
  }
  toJSON() {
    set_keys.forEach(v => this.data[v] = Array.from(this.data[v]))
    return this.data
  }
  // 読み方をカタカナにして返す
  // @returns {string}
  kana() {
    let word = this.data[KEY_NAMES.WORD]
    let yomi = ""
    while (word) {
      word = word.replace(
        // ------------KANA------------------------------|-----------連続子音の一文字目------------
        /^((?:[dzjbvgtscpfkrlmnx\']|dz|dj|ts|tc)?[iuaeoy]|[dzjbvgtscpfkrlmnx](?=[dzjbvgtscpfkrlmnx]))/,
        (match, p1) => {
          if (KANA[p1]) {
            // KANA---
            yomi += KANA[p1]
          }else if (KANA[p1 + "u"]) {
            // 連続子音の一文字目--
            yomi += KANA[p1 + "u"]
          }else {
            console.error("KANA error" + word)
          }
          return ""
        }
      );
    }
    return yomi
  }

}

module.exports = class Dictionary {
  constructor(filePath) {
    this.filePath = filePath
    this.data = new Map()
    this.key_map = new Map()

    // JSON file load
    let dictionary = JSON.parse(fs.readFileSync(filePath, "utf8"))

    Object.keys(dictionary).forEach(word => {
      // create main DATA map
      this.data.set( word, new Valsi(dictionary[word]) )

      // create rafsi key map-------
      // 自身を追加
      this.key_map.set(word, word);
      // gismuの4文字rafsiを追加
      if (word[KEY_NAMES.TYPE] === "gismu") {
        this.key_map.set(word.replace(/.$/, ""), word);
      }
      // rafsiを追加
      if (word[KEY_NAMES.RAFSI]) {
        Object.keys(word[KEY_NAMES.RAFSI]).forEach(v => {
          this.key_map.set(v, word)
        })
      }
    })

  }

  get(word) {
    return this.data.get(this.key_map[word])
  }

  has(word) {
    return this.key_map.has(word)
  }

  //
  exportJSON(filePath) {
    let dictionary = {}
    this.data.forEach((val, word)=> {
      dictionary[ word ] = val
    })
    //
    fs.writeFile(filePath || this.filePath, JSON.stringify( dictionary, null, 2), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("export JSON " + this.filePath)
      }
    });
  }
}
