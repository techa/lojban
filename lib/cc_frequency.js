/**
 * テキストから子音連結を抽出しデータ化
 *
 * node ./lib/cc_frequency.js
 */

const [, , ...argv] = process.argv;
// const fs = require('fs-extra')

// const DICTIONARY_FILE_PATH = './data/result/dictionary.json'
// const dictionary = fs.readJsonSync(DICTIONARY_FILE_PATH, 'utf8')
// const data = {}

const fs = require("fs");
const data = {};

const CCs = `
dr zd jd br vr gr tr st ct pr fr kr       zm
         bl vl gl          pl fl kl       jm
         zb zv zg          sp sf sk sr sl sm sn
         jb jv jg          cp cf ck cr cl cm cn`;
const ccs = `
nd nz nj mb nv ng nt ns nc mp nf nk nr nl nm mn
rd rz rj rb rv rg rt rs rc rp rf rk    rl rm rn
ld lz lj lb lv lg lt ls lc lp lf lk lr    lm ln
bd vd gd          pt ft kt
         bz vz gz          ps fs ks`;

/**
 *
 * @param {string} text
 */
function ccFrequency(text) {
  let index = 0;

  do {
    const match = text
      .slice(index)
      .match(/[dzjbvgtscpfkrlmnx][dzjbvgtscpfkrlmnx]/);
    if (!match) {
      break;
    }

    index += match.index | 0;
    const cc = text[index] + text[index + 1];
    const type = CCs.includes(cc) ? "CC" : ccs.includes(cc) ? "cc" : "  ";
    const prefix = text[index - 1];
    const suffix = /\W|\r?\n/.exec(text[index + 2]) ? "-" : text[index + 2];
    data[cc] ||= {
      cc,
      type,
      count: 0,
      prefix: [],
      suffix: [],
    };
    data[cc].count++;
    if (prefix && !data[cc].prefix.includes(prefix)) {
      data[cc].prefix.push(prefix);
    }
    if (!data[cc].suffix.includes(suffix)) {
      data[cc].suffix.push(suffix);
    }

    index++;
  } while (text.length > index && index > 0);
}

fs.readdirSync("./frequency").forEach((text) => {
  ccFrequency(fs.readFileSync(`./frequency/${text}`, "utf-8"));
});

fs.writeFileSync(
  "./data/result/cc_frequency.json",
  JSON.stringify(
    Object.values(data)
      .sort((a, b) => b.count - a.count)
      .map((v) => `${v.cc} ${v.type} ${v.count}`),
    null,
    4
  )
);
