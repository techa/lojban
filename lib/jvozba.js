/* global get_CV_info */
/* eslint-disable camelcase  */
/*
jvozba(["lujvo","zbasu"]) ==> [{"lujvo":"jvozba","score":5858},{"lujvo":"luvzba","score":5878},{"lujvo":"jvozbas","score":6888},{"lujvo":"luvzbas","score":6908},{"lujvo":"jvozbasu","score":7897},{"lujvo":"luvzbasu","score":7917},{"lujvo":"lujvyzba","score":8008},{"lujvo":"lujvyzbas","score":9038},{"lujvo":"lujvyzbasu","score":10047}]
*/
function jvozba (arr, forbid_la_lai_doi) {
  var candid_arr = []

  for (var i = 0; i < arr.length; i++) {
    candid_arr.push(get_candid(arr[i], /* isLast: */ i === arr.length - 1))
  }

  var answers = create_every_possibility(candid_arr).map(function (rafsi_list) {
    var result = normalize(rafsi_list)
    return {lujvo: result.join(''), score: get_lujvo_score(result)}
  }).filter(function (d) {
    var l = d.lujvo
    return !(is_cmevla(l) && forbid_la_lai_doi &&
    (l.match(/^(lai|doi)/) ||
    l.match(/[aeiouy](lai|doi)/) ||
    l.match(/^la[^u]/) || // the fact that CLL explicitly forbids two sequences `la` and `lai` signifies that `lau` is not forbidden
    l.match(/[aeiouy]la[^u]/)
    )
    )
  }).sort(function (a, b) {
    return a.score - b.score
  })

  return answers
}

function is_cmevla (valsi) {
  return valsi.length >= 1 && "aeiouy'".indexOf(valsi.charAt(valsi.length - 1)) === -1
}

function normalize (rafsi_list) {
  if (rafsi_list.length === 1) {
    throw new Error('You need at least two valsi to make a lujvo')
  }

  var input = rafsi_list.concat([]) // copy
  var result = [input.pop()] // add the final rafsi

  while (input.length)	{
    var rafsi = input.pop()
    var end = rafsi.charAt(rafsi.length - 1)
    var init = result[0].charAt(0)

    if (is_4letter(rafsi)) {
      result.unshift('y')
    } else if (get_CV_info(end) === 'C' && get_CV_info(init) === 'C' && is_permissible(end, init) === 0) {
      result.unshift('y')
    } else if (end === 'n' && ['ts', 'tc', 'dz', 'dj'].indexOf(result[0].slice(0, 2)) !== -1) {
      result.unshift('y')
    } else if (input.length === 0 && is_CVV(rafsi)) { // adapting first rafsi, which is CVV; gotta think about r-hyphen
      var hyphen = 'r'
      if (result[0].startsWith('r')) {
        hyphen = 'n'
      }

      if (rafsi_list.length > 2 || !is_CCV(result[0])) {
        result.unshift(hyphen)
      }
    } else if (input.length === 0 && is_CVC(rafsi) && is_tosmabru(rafsi, result)) {
      result.unshift('y')
    }

    result.unshift(rafsi)
  }

  return result
}

function is_tosmabru (rafsi, rest) {
  // skip if cmevla
  if (is_cmevla(rest[rest.length - 1])) { // ends with a consonant
    return
  }

  var index
  for (var i = 0; i < rest.length; i++) {
    if (is_CVC(rest[i])) continue

    index = i
    if (rest[i] === 'y' ||
      (get_CV_info(rest[i]) === 'CVCCV' && is_permissible(rest[i].charAt(2), rest[i].charAt(3)) === 2)
    ) {
      break
    // further testing
    } else {
      return false
    }
  }

  // further testing

  var tmp1 = rafsi
  var tmp2 = rest[0]
  var j = 0
  do {
    if (tmp2 === 'y') return true

    if (is_permissible(tmp1.charAt(tmp1.length - 1), tmp2.charAt(0)) !== 2) {
      return false
    }
    tmp1 = tmp2
    tmp2 = rest[++j]
  } while (j <= index)
  return true
}

function is_CVV (rafsi) {
  return (get_CV_info(rafsi) === 'CVV' ||
    get_CV_info(rafsi) === "CV'V")
}

function is_CCV (rafsi) {
  return get_CV_info(rafsi) === 'CCV'
}

function is_CVC (rafsi) {
  return get_CV_info(rafsi) === 'CVC'
}

function is_4letter (rafsi) {
  return (get_CV_info(rafsi) === 'CVCC' ||
    get_CV_info(rafsi) === 'CCVC')
}

function is_permissible (c1, c2) { // 2: initial ok; 1: ok; 0: none ok
  return {
    r: {r: 0, l: 1, n: 1, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1},
    l: {r: 1, l: 0, n: 1, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1},
    n: {r: 1, l: 1, n: 0, m: 1, b: 1, v: 1, d: 1, g: 1, j: 1, z: 1, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1},
    m: {r: 2, l: 2, n: 1, m: 0, b: 1, v: 1, d: 1, g: 1, j: 1, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 1},
    b: {r: 2, l: 2, n: 1, m: 1, b: 0, v: 1, d: 1, g: 1, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    v: {r: 2, l: 2, n: 1, m: 1, b: 1, v: 0, d: 1, g: 1, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    d: {r: 2, l: 1, n: 1, m: 1, b: 1, v: 1, d: 0, g: 1, j: 2, z: 2, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    g: {r: 2, l: 2, n: 1, m: 1, b: 1, v: 1, d: 1, g: 0, j: 1, z: 1, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    j: {r: 1, l: 1, n: 1, m: 2, b: 2, v: 2, d: 2, g: 2, j: 0, z: 0, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    z: {r: 1, l: 1, n: 1, m: 2, b: 2, v: 2, d: 2, g: 2, j: 0, z: 0, s: 0, c: 0, x: 0, k: 0, t: 0, f: 0, p: 0},
    s: {r: 2, l: 2, n: 2, m: 2, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 0, c: 0, x: 1, k: 2, t: 2, f: 2, p: 2},
    c: {r: 2, l: 2, n: 2, m: 2, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 0, c: 0, x: 0, k: 2, t: 2, f: 2, p: 2},
    x: {r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 0, x: 0, k: 0, t: 1, f: 1, p: 1},
    k: {r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 0, k: 0, t: 1, f: 1, p: 1},
    t: {r: 2, l: 1, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 2, c: 2, x: 1, k: 1, t: 0, f: 1, p: 1},
    f: {r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 0, p: 1},
    p: {r: 2, l: 2, n: 1, m: 1, b: 0, v: 0, d: 0, g: 0, j: 0, z: 0, s: 1, c: 1, x: 1, k: 1, t: 1, f: 1, p: 0}
  }[c1][c2]
}
/*
  create_every_possibility([[1,11], [2], [3,33,333]]) ==> [ [1,2,3],[11,2,3],  [1,2,33],[11,2,33],  [1,2,333],[11,2,333] ]
  create_every_possibility([[1,11]]) ==> [ [1],[11] ]
*/
function create_every_possibility (aa) {
  var arr_arr = JSON.parse(JSON.stringify(aa))
  if (arr_arr.length === 0) {
    return [[]]
  }
  var arr = arr_arr.pop()

  var result = []
  for (var i = 0; i < arr.length; i++) {
    var e = arr[i]

    result = result.concat(create_every_possibility(arr_arr).map(function (f) {
      return f.concat([e])
    }))
  }
  return result
}

// get_candid("bloti", false) ==> ["lot", "blo", "lo'i", "blot"]
// get_candid("gismu", true) ==> ["gim", "gi'u", "gismu", "gism"]
function get_candid (selrafsi, isLast) {
  if (cmavo_rafsi_list[selrafsi]) {
    return cmavo_rafsi_list[selrafsi]
  } else if (gismu_rafsi_list[selrafsi]) {
    var gismu = selrafsi
    var candid = gismu_rafsi_list[gismu].concat([])

    if (isLast) {
      candid.push(gismu)
    }

    var chopped = gismu.slice(0, -1)
    if (chopped !== 'brod') { candid.push(chopped) }

    return candid
  } else {
    throw new Error('no rafsi for word ' + selrafsi)
  }
}

function search_selrafsi_from_rafsi2 (rafsi) {
  if (gismu_rafsi_list[rafsi]) return rafsi // 5-letter rafsi

  /*
    I spent 45 minutes trying to find out whether "brod" can be a rafsi for "brodV", but couldn't find that out.
    Thus, for the present I forbid the use of "brod" as a rafsi.
  */
  if (rafsi !== 'brod' && rafsi.length === 4 && rafsi.indexOf("'") === -1) { // 4-letter rafsi
    for (var u = 0; u < 5; u++) {
      var gismu_candid = rafsi + 'aeiou'.charAt(u)
      if (gismu_rafsi_list[gismu_candid]) return gismu_candid
    }
  }
  for (var i in gismu_rafsi_list) {
    if (gismu_rafsi_list[i].indexOf(rafsi) !== -1) return i
  }
  for (var j in cmavo_rafsi_list) {
    if (cmavo_rafsi_list[j].indexOf(rafsi) !== -1) return j
  }

  return null
}

function search_selrafsi_from_rafsi (rafsi) {
  var selrafsi = search_selrafsi_from_rafsi2(rafsi)
  if (selrafsi != null) {
    return selrafsi
  } else {
    throw new Error('no word for rafsi ' + rafsi)
  }
}
