/**
 * step1で整理したXMLをxml2jsでJSONに変換する
 */
"use strict";
const fs  = require("fs");
const parser = require("xml2js").parseString;

const INPUT_FILE_NAME  = "./data/neatly/xml-export.xml";
const OUTPUT_FILE_NAME = "./data/neatly/xml-export.json";

const xml = fs.readFileSync(INPUT_FILE_NAME, "utf8");
// const xml = require("./step1-xml-parser");

// XML を JSONに変換＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
parser(xml, {
  // OPTIONS   https://github.com/Leonidas-from-XIV/node-xml2js
  mergeAttrs: true, // 属性も子としてマージ
  explicitArray: false, // ないとテキストが全て配列に入れられてしまう
}, function(error, result) {
  // 単語データ配列
  let obj = {
    valsis: result.dictionary.direction[0].valsi,
    nlwords: result.dictionary.direction[1].nlword
  };

  fs.writeFile(OUTPUT_FILE_NAME, JSON.stringify( obj, null, 2), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("output JSON " + OUTPUT_FILE_NAME);
    }
  });
  module.exports = obj;
});
