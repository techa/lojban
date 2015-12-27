var fs = require("fs");

var origin_data = {};
var OUTPUT_FILENAME = "./data/neatly/cmavo-gismu-en.json";
// var cmavo = fs.readFileSync("./data/origin/cmavo.txt","utf8");
// var gismu = fs.readFileSync("./data/origin/gismu.txt","utf8");

function readAndWhite (fileName, parser, keyNames) {
  var text = fs.readFileSync("./data/origin/"+ fileName +".txt","utf8");

  var lines = text.split(/\n/);

  lines.forEach((line, line_counter)=> {

    var match_result = line.match( parser );

    if ( !match_result ) {
      console.error("parser Error line" + line_counter);
      return;
    }
    else {
      match_result.shift();
      // console.log(match_result);

      // 語頭の.を排除して'を_に変換してkey_nameにする
      var key_name = match_result[0].replace(/\'/g,"_");

      var valsi = match_result.reduce((obj, value, i)=> {
        value = (value||"").trim();
        if (value) {
          obj[ keyNames[i] ] = value;
        }
        return obj;
      }, {type: fileName}); // obj 初期値
    }
    origin_data[ key_name ] = valsi;
  });
}
readAndWhite(
  "cmavo",
//  valsi           selmaho       en     thesaurus                   cf
  /[ \.]([\'\w]+) +([\w0-9\*]+) +(.+?) {2,}(.+)(?: {2,}|\n)(?:\(cf\.(.+)\))?/,
  ["valsi", "selmaho", "en", "thesaurus", "cf"]
);
readAndWhite(
  "gismu",
//  valsi         rafsi          en           definition       n1        n2                    cf
  /([\w' ]{5}) (.{3} .{3} .{4}) (.+) {2,}.+ {2,}(.+) {2,}(?:(\w{1,2}) +(\w{1,3}))? {4}.*(?:cf.(.+)\))?/,
  ["valsi", "rafsi", "en", "definition", "n1", "n2", "cf"]
);



fs.writeFile(OUTPUT_FILENAME, JSON.stringify(origin_data, null, 2), function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved to " + OUTPUT_FILENAME);
  }
});
