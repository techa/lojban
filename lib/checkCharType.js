/**
 *
 *
 * @param {any} input
 * @param {any} charType
 * @returns
 * @see http://so-zou.jp/software/tech/programming/tech/regular-expression/meta-character/variable-width-encoding.htm
 * @see JavaScriptで漢字を表す正規表現: http://stabucky.com/wp/archives/7594
 * @see WEB国語教室: http://www.taishukan.co.jp/kokugo/webkoku/series003_04.html
 */
function checkCharType (input, charType) {
  switch (charType) {
    // 全角文字（ひらがな・カタカナ・漢字 etc.）/^[ぁ-んァ-ン一-龠]+$/
    case 'zenkaku':
      return /^[^\x01-\x7E\xA1-\xDF]+$/.test(input)
    // 漢字 /[一-龠]/
    case 'kanji':
      return /^[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]+$/.test(input)
    // 全角ひらがな/^[\u3040-\u309F]+$/ /^[ぁ-ん]+$/
    case 'hiragana':
      return /^[\u3041-\u3096]+$/.test(input)
    // 全角カタカナ/^[\u30A0-\u30FF]+$/
    case 'katakana':
      return /^[\u30a1-\u30f6]+$/.test(input)
    // 半角カタカナ
    case 'hankata':
      return /^[\uFF65-\uFF9F]+$/.test(input)
    // 半角英数字（大文字・小文字）
    case 'alphanumeric':
      return /^[0-9a-zA-Z]+$/.test(input)
    // 全て整数かどうか
    case 'numeric':
      return /^[-]?\d+(\.\d+)?$/.test(input)
    // 半角整数
    case 'numeric1':
      return /^[-]?[0-9]+(\.[0-9]+)?$/.test(input)
    // 半角数字/^[-]?\d+(\.\d+)?$/
    case 'numeric2':
      return /^[0-9]+$/.test(input)
    // ASCII
    case 'ascii':
      return /^[\x20-\x7E]+$/.test(input)
    // 半角英字（大文字・小文字）
    case 'alphabetic':
      return /^[a-zA-Z]+$/.test(input)
    // 半角英字（大文字のみ）
    case 'upper-alphabetic':
      return /^[A-Z]+$/.test(input)
    // 半角英字（小文字のみ）
    case 'lower-alphabetic':
      return /^[a-z]+$/.test(input)
    // URL
    case 'url':
      return /^(https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)$/.test(input)
  }
  return false
}
function convert_kigo_han_zen (str, option) {
  // option=0:半角から全角, 1:全角から半角
  let pairs, pairs_length, i, before, after
  if (option !== 0) {
    option = 1
  }
  pairs = [
    ['\u0020', '\u3000'], // 半角スペース⇔全角スペース
    ['\u0021', '\uFF01'], // !⇔！
    ['\u0022', '\u201D'], // "⇔”
    ['\u0023', '\uFF03'], // #⇔＃
    ['\u0024', '\uFF04'], // $⇔＄
    ['\u0025', '\uFF05'], // %⇔％
    ['\u0026', '\uFF06'], // &⇔＆
    ['\u0027', '\u2019'], // '⇔’
    ['\u0028', '\uFF08'], // (⇔（
    ['\u0029', '\uFF09'], // )⇔）
    ['\u002A', '\uFF0A'], // *⇔＊
    ['\u002B', '\uFF0B'], // +⇔＋
    ['\u002C', '\uFF0C'], // ,⇔，
    ['\u002D', '\uFF0D'], // -⇔－
    ['\u002E', '\uFF0E'], // .⇔．
    ['\u002F', '\uFF0F'], // /⇔／
    ['\u003A', '\uFF1A'], // :⇔：
    ['\u003B', '\uFF1B'], // ;⇔；
    ['\u003C', '\uFF1C'], // <⇔＜
    ['\u003D', '\uFF1D'], // =⇔＝
    ['\u003E', '\uFF1E'], // >⇔＞
    ['\u003F', '\uFF1F'], // ?⇔？
    ['\u0040', '\uFF20'], // @⇔＠
    ['\u005B', '\uFF3B'], // [⇔［
    ['\u005C', '\uFFE5'], // \⇔￥
    ['\u005D', '\uFF3D'], // ]⇔］
    ['\u005E', '\uFF3E'], // ^⇔＾
    ['\u005F', '\uFF3F'], // _⇔＿
    ['\u0060', '\uFF40'], // `⇔｀
    ['\u007B', '\uFF5B'], // {⇔｛
    ['\u007C', '\uFF5C'], // |⇔｜
    ['\u007D', '\uFF5D'], // }⇔｝
    ['\u007E', '\uFF5E'], // ~⇔～
    ['\uFF61', '\u3002'], // ｡⇔。
    ['\uFF62', '\u300C'], // ｢⇔「
    ['\uFF63', '\u300D'], // ｣⇔」
    ['\uFF64', '\u3001'], // ､⇔、
    ['\uFF65', '\u30FB'], // ･⇔・
  ]
  pairs_length = pairs.length
  for (i = 0; i < pairs_length; i++) {
    before = pairs[i][option]
    after = pairs[i][1 - option]
    while (str !== str.replace(before, after)) {
      str = str.replace(before, after)
    }
  }
  return str
}
