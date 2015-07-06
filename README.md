Lojban Words Analysis
======================
ロジバンの語根は話者数の多い言語から作られているが、ここでは意味や機能による規則で語の生成を行う。

1) origin -> neatly -> thesaurus ->result
   オリジナル、整頓、シソーラス


gismu patterns
-------------

全てのgismuはrafsiとして５文字目を抜いた４文字のものを持つため、実質４文字で意味を表す必要がある。
gismuは４つのパーツを組み合わせた２つのパターンで構成する。  
※ｘはなるべく使いたくないので別計算。

	cVccv   <= c  + V + cc + v
	CCVcv   <= CC + V + c  + v

#### c) 子音 16 + 1 = (dzjbvg tscpfk rlmn) + (x)
 大まかなカテゴリ。
 * 時間
 * 空間
 * 構造
 * 物理

#### CC) 語頭で許される二重子音 44+2
#### cc) 二重子音 163+16
語頭でない場合でもなるべくCCの組み合わせを採用したい。  
イタリア語、スペイン語、ドイツ語あたりから、よく使われる二重子音を出現頻度でリストアップして参考にしたい。

     2  1  1  2  2  2  2  1  1  2  2  2 11 10  4  2  0  
    -- dz dj -- -- -- -- -- -- -- -- -- dr -- -- -- --  3
    zd -- -- zb zv zg -- -- -- -- -- -- -- -- zm -- --  5
    jd -- -- jb jv jg -- -- -- -- -- -- -- -- jm -- --  5
    -- -- -- -- -- -- -- -- -- -- -- -- br bl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- vr vl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- gr gl -- -- --  2
    -- -- -- -- -- -- -- ts tc -- -- -- tr -- -- -- --  3
    -- -- -- -- -- -- st -- -- sp sf sk sr sl sm sn --  8
    -- -- -- -- -- -- ct -- -- cp cf ck cr cl cm cn --  8
    -- -- -- -- -- -- -- -- -- -- -- -- pr pl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- fr fl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- kr kl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    -- -- -- -- -- -- -- -- -- -- -- -- mr ml -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    -- -- -- -- -- -- -- -- -- -- -- -- xr xl -- -- --  0+2
                                         1  1           =44+2

     9  7  8  9  9  9  9  8  8  9  9  9 15 15 15 15  0
    -- dz dj db dv dg -- -- -- -- -- -- dr dl dm dn --  9
    zd -- -- zb zv zg -- -- -- -- -- -- zr zl zm zn --  8
    jd -- -- jb jv jg -- -- -- -- -- -- jr jl jm jn --  8
    bd bz bj -- bv bg -- -- -- -- -- -- br bl bm bn --  9
    vd vz vj vb -- vg -- -- -- -- -- -- vr vl vm vn --  9
    gd gz gj gb gv -- -- -- -- -- -- -- gr gl gm gn --  9
    -- -- -- -- -- -- -- ts tc tp tf tk tr tl tm tn tx  9 +1
    -- -- -- -- -- -- st -- -- sp sf sk sr sl sm sn sx  8 +1
    -- -- -- -- -- -- ct -- -- cp cf ck cr cl cm cn --  8
    -- -- -- -- -- -- pt ps pc -- pf pk pr pl pm pn px  9 +1
    -- -- -- -- -- -- ft fs fc fp -- fk fr fl fm fn fx  9 +1
    -- -- -- -- -- -- kt ks kc kp kf -- kr kl km kn --  9
    rd rz rj rb rv rg rt rs rc rp rf rk -- rl rm rn rx  15+1
    ld lz lj lb lv lg lt ls lc lp lf lk lr -- lm ln lx  15+1
    md -- mj mb mv mg mt ms mc mp mf mk mr ml -- mn mx  14+1
    nd nz nj nb nv ng nt ns nc np nf nk nr nl nm -- nx  15+1
    -- -- -- -- -- -- xt xs -- xp xf -- xr xl xm xn --  0 +8
                       1  1     1  1     1  1  1  1  8  =163+16


#### V) 最初の母音 5



#### v) 末尾母音 5
 * i - ps2 or ps3 !未定部分。ps2か3か多いほうをiに振り分け
 * u - ps1 & ps5
 * a - ps2
 * e - ps3
 * o - ps4


# 使用する子音の厳選


     d  z  j  b  v  g  t  s  c  p  f  k  r  l  m  n
    ------------------------------------------------ c =16
    dr zd jd br vr gr tr st ct pr fr kr
       zm jm bl vl gl          pl fl kl  
             zb zv zg          sp sf sk sr sl sm sn
             jb jv jg          cp cf ck cr cl cm cn
    ------------------------------------------------ CC= 40

Sources
-------

### jbovlaste xml-export in japanese
http://jbovlaste.lojban.org/export/xml-export.html?lang=ja

### Lojban thesaurus
http://mw.lojban.org/papri/Lojban_thesaurus

### 単語頻度リスト
http://mw.lojban.org/papri/File:MyFreq-COMB_without_dots.txt

### gismu & cmovo .txt
https://github.com/lojban/jbovlaste/blob/master/bin/gismu.txt
https://github.com/lojban/jbovlaste/blob/master/bin/cmavo.txt
