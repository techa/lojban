# Zercii
## 順
* 母音と子音を分ける
* 

## コンセプト
* 世界で最も普及した文字は何かといえばアラビア数字こそがその答えである
    * Zerciiはアラビア数字を絶対不可侵のものとし
    * 次に普及した文字であるラテン文字を「デジタル数字のように７本の線で表現できる」ように改変する
* デジタル数字のように７本の線で表現できる
    * 母音はよりシンプルに、４本の線で表現できる
    * アラビア数字と被らないようにする
* `dt`, `zs`, `jc`, `bp`, `vf`, `gk`, `rl`, `mn`のセットを対応する形にする
    * 対応するとは線対称か点対称であること
* `h`は`n`や`k`との混同を防ぐため使用しない
* `v`は`u`との混同を防ぐため使用しない
    * というかむしろ`u`を`v`に入れ替えてもよい
* ASCII - aghmrvw ij + IPA表記 ʌɪɔǝɴ ħɘɛ ʎ

    yiuaeo dzjbvg tscpfk rlmn x hqw
    ʌɪvɔco dzəbty qsepfk jlɴn x ħɘɛ
    ʌɪvɔco dzəbty qsepfk ɹlɴn ʎ xɘɛ
## Step
     y  i  u  a  e  o
     d  z  j  b  v  g
     t  s  c  p  f  k
        r  l  m  n  x

### 1: y → ʌ,  i → ɪ,  a → ɔ,  e → c
母音をシンプルに。

     ʌ  ɪ  u  ɔ  c  o
     d  z  j  b  v  g
     t  s  c  p  f  k
        r  l  m  n  x
### 2: c → e,  j → ə
被った`c`を`e`に入れ替える。
対応するように`j`を`ə`に変更。

     ʌ  ɪ  u  ɔ  c  o
     d  z  ə  b  v  g
     t  s  e  p  f  k
        r  l  m  n  x
### 3: t → q,  v → t
`t`を`d`対応するように`q`に変更する。
余った`t`を`f`に対応する`v`へ入れ替える。

     ʌ  ɪ  u  ɔ  c  o
     d  z  ə  b  t  g
     q  s  e  p  f  k
        r  l  m  n  x
### 4: g → y,  r → j,  m → ɴ
`g`はデジタル９と被るため`y`に変更。
`r`は`l`に対応するように`j`に（本来は点なし）。
`m`を`ɴ`に変更。

     ʌ  ɪ  u  ɔ  c  o
     d  z  ə  b  t  y
     q  s  e  p  f  k
        j  l  ɴ  n  x
