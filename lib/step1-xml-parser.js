/**
 *  jbovlaste xml-export in japanese
 *  http://jbovlaste.lojban.org/export/xml-export.html?lang=ja
 *  上記リンク先でダウンロードしたXMLデータを整理する
 */

"use strict";
const fs = require("fs");

const INPUT_FILE_NAME  = "./data/origin/xml-export.xml";
const OUTPUT_FILE_NAME = "./data/neatly/xml-export.xml";

// XML を読み込んで不要な文字列を削除
let xml = fs.readFileSync( INPUT_FILE_NAME, "utf8")
            .replace(/( {2}<user>[\n\w \s<>\/.]+<\/user>| {2}<definitionid>[0-9]+<\/definitionid>)\n/g, "")
            .replace(/-compound/g, "");// cmavo*

// XML を出力
fs.writeFile( OUTPUT_FILE_NAME, xml, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("output XML " + OUTPUT_FILE_NAME);
  }
});

module.exports = xml;
// export default xml;
