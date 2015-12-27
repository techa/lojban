module.exports = {
  APOSTROPHE: "h",
  PARSER: {
    ALL: "yiuaeo'dzjbvg.tscpfk,rlmnx",
    VOWEL: "iuaeo",
    VOWELY: "iuaeoy",
    CONSONANT: "dzjbvgtscpfkrlmnx",
    PREFIX_CC: "(d[zjr]|[zj][dbvgm]|[bvgscpfkmx][rl]|t[scr]|[sc][tpfkmn])",
    PERMIT_CC: "(d[zjbvg]|[zj][dbvg]|b[dzjvg]|v[dzjbg]|g[dzjbv]|t[scpfk]|[sc][tpfk]|p[tscfk]|f[tscpk]|k[tscpf]|[dzjbvgtscpfk][rlmn]|[rlmn][dzjbvgtscpfk]|r[lmn]|l[rmn]|m[rln]|n[rlm]|x[tspfrlmn]|[tspfrlmn]x)",
    PROHIBITION_CC: "(dd|[zj][zj]|bb|vv|gg|tt|[sc][sc]|pp|ff|kk|rr|ll|mm|nn|[dzjbvg][tscpfkx]|[tscpfkx][dzjbvg]|[ckx]x|x[ckx])", //禁則二重子音
  },
  KEY_NAMES: {
    WORD: "word",
    TYPE: "type",

    SELMAHO: "selmaho",
    SELMAHO_IMPROVEMENT: "selmaho2", // {string}  - [文法改良案](https://mw.lojban.org/papri/文法改良案)
    SELMAHO_COMPOUND_FLG: "compound", // {boolean} - match("*") で代用出来るので不使用

    RAFSI: "rafsi",     // {array} - 
    HOMONYM: "homonym", // {string}- 同音語 rafsiCVV===cmavo

    DEFINITION: "def",          // {string} - 説明文
    PS_NUMBER: "ps",            // {number} - PSの数
    NOTES: "notes",             // {string} - 補足
    EXAMPLE_SENTENCES: "exams", // {array}  - 例文

    GLOSSWORD: "ja",    // {array}  - 大意(日本語)
    SENSE: "sense",
    GLOSSWORD_EN: "en", // {array}  - 大意(英語)
    RUBY: "ruby",        // {string} - 読み方、ルビ
    PUN: "pun",          // {string} - 語呂合わせ

    CONNECTIONS: "cf", // {array} - 関連語

    FREQUENCY_RANK: "rank",          // {number} - 頻度順位
    FREQUENCY_SCORE: "score",        // {array}  - 頻度スコア(高いほどよく使用される単語ということ)

    THESAURUS_IDS: "id",      // {array} - 分類用ID
    THESAURUS_JA: "thesaurusJA",

    EXPERIMENTAL_FLG: "experimental", // {boolean} - 試験的フラグ
    UNOFFICIAL_FLG: "unofficial",     // {boolean} - 非公式フラグ
  }
};
