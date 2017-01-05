'use strict'
const ALL = "yiuaeo'dzjbvg.tscpfk,rlmnx"
const VOWEL = 'iuaeo'
const VOWELY = 'iuaeoy'
const CONSONANT = 'dzjbvgtscpfkrlmnx'
const V = `[${VOWEL}]`
const C = `[${CONSONANT}]`
const VC = `[${VOWEL + CONSONANT}]`
const PREFIX_CC = '(d[zjr]|[zj][dbvgm]|[bvgscpfkmx][rl]|t[scr]|[sc][tpfkmn])'
const PERMIT_CC = '(d[zjbvg]|[zj][dbvg]|b[dzjvg]|v[dzjbg]|g[dzjbv]|t[scpfk]|[sc][tpfk]|p[tscfk]|f[tscpk]|k[tscpf]|[dzjbvgtscpfk][rlmn]|[rlmn][dzjbvgtscpfk]|r[lmn]|l[rmn]|m[rln]|n[rlm]|x[tspfrlmn]|[tspfrlmn]x)'
const NUMBERS = '(pa|re|ci|vo|mu|xa|ze|bi|so|no)'
const GISMU = `(?:(?:${PREFIX_CC}${V}${C}|${C}${V}${PERMIT_CC})|${V})`
// const PERMIT_CC =  "(d[zjbvg]|[zj][dbvg]|b[dzjvg]|v[dzjbg]|g[dzjbv]|t[scpfk]|[sc][tpfk]|p[tscfk]|f[tscpk]|k[tscpf]|[dzjbvgtscpfk][rlmn]|[rlmn][dzjbvgtscpfk]|r[lmn]|l[rmn]|m[rln]|n[rlm]|x[tspfrlmn]|[tspfrlmn]x)"
const PARSER = {
  // 末尾が母音でなければならない
  lastVowel: [true, `${V}$`],
  // 語頭２文字が許される二重子音PREFIX_CCかVVかCVであること
  prefixCC: [true, `^(${VC}[${VOWELY}\\']|${PREFIX_CC}|${V}\\b)`],
  // lojbanで使われない文字が含まれる場合
  unusedLetter: [false, `[^${ALL}]`],
  // 禁則二重子音が含まれる場合
  prohibitionCC: [false, '(dd|[zj][zj]|bb|vv|gg|tt|[sc][sc]|pp|ff|kk|rr|ll|mm|nn|[dzjbvg][tscpfkx]|[tscpfkx][dzjbvg]|[ckx]x|x[ckx])'],
  // 母音が３文字以上続く場合
  vowel3: [false, `[${VOWELY}][${VOWELY}][${VOWELY}]`]
}

module.exports =
  class LojbanUtil {
    /**
     * [constructor description]
     * @param  {Object} options  - parser options例：{unusedLetter:true}
     * @return {this}
     */
    constructor (options) {
      // PARSERのコピーを作成
      let parsers = Object.assign({}, PARSER)
      // parsersにオプションを反映
      if (options) {
        Object.keys(options).forEach(key => {
          if (parsers[key]) {
            parsers[key][0] = !!options[key]
          }
        })
      }
      this.parsers = parsers
    }
    formCV (word) {
      return word.replace(/'?[iuaeo]/g, 'V').replace(/[^iuaeoV]/g, 'C')
    }
    /**
     * parsersの判定を全て通過できれば、とりあえずお前をLojbanの単語だと認めよう！
     * @param  {string} word
     * @return {boolean}
     */
    valsiChecker (word) {
      return Object.keys(this.parsers).every(parser => {
        // if (new RegExp(this.parsers[parser][1]).test(word) !== this.parsers[parser][0]) {
        //   console.error("valsiChecker", parser, word)
        // }
        return new RegExp(this.parsers[parser][1]).test(word) === this.parsers[parser][0]
      })
    }
    /**
     * lujvo分解器?=====================================================================================
     * @param  {string} word
     * @return {false / array}
     */
    spliter (word, map) {
      let rafsis = []
      if (this.valsiChecker(word)) {
        if (new RegExp(`^${NUMBERS}+$`).test(word)) {
          return word.match(new RegExp(`${NUMBERS}`, 'g'))
        }
        split(word)
        if (!rafsis.length) {
          console.log("Can't split " + word)
        }
      }
      return rafsis

      //
      function split (w) {
        // 辞書に存在するrafsiである場合rafsisに追加して終了
        if (map.has(w)) {
          rafsis.push(w)
          return
        }
        if (w.match(/y/)) {
          w.split('y').forEach(v => split(v))
          return
        }
        // 語形を検討する際には、yや'を数えない
        // let gokey = w.replace(/[\'yh]/g, "")
        if ([
          // ---CV/CCV/CVV-------------------+----CV/CCV/CVV
          `^(${C}(?:${V}|${C}${V}|${V}'?${V}))(${C}(?:${V}|${C}${V}|${V}'?${V}))$`,
          // -----CVC/CCV------------- + ----CCV/CVV------------
          `(${C}(?:${C}${V}|${V}${C}))+(${C}(?:${C}|${V}'?)${V})`,
          // ---CV/CCV/CVV------------------- + ---CCV/CVV-?---------------+--gismu
          `^(${C}(?:${V}|${C}${V}|${V}'?${V}))(${C}(?:${C}${V}|${V}'?${V}))?(${GISMU})$`,
          `^(${GISMU})(${C}(?:${V}|${C}${V}|${V}'?${V}))$`
        ].some(v => check(w, new RegExp(v)))) {
          return
        }
      }
      //
      function check (w, reg) {
        let matchs = w.match(reg)
        // parserで分解したパーツvが辞書に存在するrafsiであるか、まだ分解しきれていない(5文字以上)場合
        if (matchs && matchs.slice(1).every(v => v && (map.has(v) || (+v.length > 5)))) {
          matchs.slice(1).forEach(v => split(v))
          return true
        }
        return false
      }
    }
}
