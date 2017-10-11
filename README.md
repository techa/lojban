Lojban Words Analysis
======================
ロジバンの語根は話者数の多い言語から作られているが、ここでは意味や機能による規則的な語の生成を行う。  

1) origin -> neatly -> result  
   オリジナル、整頓、

## ゼルシー順
ロジバンの話を始める前に、もっと基礎的な部分について地盤固めをしたいと思う。その基礎的な部分とはズバリ、アルファベット順のことである。アルファベット順は流用と改造を繰り返した末にできた「成れの果て」であり、母音と子音すら分けられていないような、全く整理されていない非論理的な順である。

いろは歌から五十音順に並べ直した日本語のように整理した順を使用したい。ということで作成したのが以下の順である。６文字ごとに区切って表にすると画像のようになる。

    012345 678901 234567 8901 2 345
    yiuaeo dzjbvg tscpfk rlmn x hqw

![ゼルシー順](images/poizercii.png)

※[ゼルシー](images/zercii.png)はこの順を利用して作った文字。

## Terminal commands
node lib/step1-xml-parser.js  
node lib/step2-xml2js.js  
node lib/step3-make-dictionary.js  
node lib/step4-integrate-frequency.js  
node lib/step5-integrate-thesaurus.js  
node lib/yaml.js

## gismu patterns
全てのgismuはrafsiとして５文字目を抜いた４文字のものを持つため、実質４文字で意味を表す必要がある。  
gismuは４つのパーツを組み合わせた２つのパターンで構成する。 

	CCVcv  =  CC + V + c  + v
	cVccv  =  c  + V + cc + v

* c) 子音
* cc) 二重子音
* CC) 語頭で許される二重子音
* V) 最初の母音
* v) 末尾母音


### パーツ 
gismuを漢字に例えるならパーツは部首に相当する。
まずはそれぞれのパーツにどのような意味を持たせるかを考えるためにc、cc、CC、V、vを分析する。  
17文字の子音があるがxは特殊な文字として残しておきたいので別計算とする。特殊な文字というのは、標準の単語ではないことを示したりするのに使うことなどを想定している。  
ただし意味の分類などでｘを使用したほうが分かりやすいと思えば、標準の文字として使用していく方針。

#### c) 子音 16 + 1 = (dzjbvg tscpfk rlmn) + (x)

#### CC) 語頭で許される二重子音 40+4+2
dz dj ts tcの４つの二重子音はgismuでは使用しない。個人的見解だがdz djは発音が難しいので特に使用したくない。

     2  1  1  2  2  2  2  1  1  2  2  2 11 10  4  2  0  
    -- dz dj -- -- -- -- -- -- -- -- -- dr -- -- -- --  1+2
    zd -- -- zb zv zg -- -- -- -- -- -- -- -- zm -- --  5
    jd -- -- jb jv jg -- -- -- -- -- -- -- -- jm -- --  5
    -- -- -- -- -- -- -- -- -- -- -- -- br bl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- vr vl -- -- --  2
    -- -- -- -- -- -- -- -- -- -- -- -- gr gl -- -- --  2
    -- -- -- -- -- -- -- ts tc -- -- -- tr -- -- -- --  1+2
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
                                         1  1           =40+4+2

#### cc) 二重子音 159+4+16
語頭でない場合でもなるべくCCの組み合わせを採用したい。  
多言語でよく使われる二重子音を出現頻度でリストアップして参考にしたい。 
lib/cc_frequency.js

     9  7  8  9  9  9  9  8  8  9  9  9 15 15 15 15  0
    -- dz dj db dv dg -- -- -- -- -- -- dr dl dm dn --  7 +2
    zd -- -- zb zv zg -- -- -- -- -- -- zr zl zm zn --  8
    jd -- -- jb jv jg -- -- -- -- -- -- jr jl jm jn --  8
    bd bz bj -- bv bg -- -- -- -- -- -- br bl bm bn --  9
    vd vz vj vb -- vg -- -- -- -- -- -- vr vl vm vn --  9
    gd gz gj gb gv -- -- -- -- -- -- -- gr gl gm gn --  9
    -- -- -- -- -- -- -- ts tc tp tf tk tr tl tm tn tx  7 +2 +1
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
                       1  1     1  1     1  1  1  1  8  =159+4+16

#### V) 最初の母音 5　iuaeo
* a  大、上
* e  中、並
* o  小、下

良悪、男女


#### v) 末尾母音 5　iuaeo
末尾母音は意味分類として使用しない。３文字rafsiのバリエーション。

### パターン
	CCVcv  = 40 * 5 * 16 = 3200
	cVccv  = 16 * 5 * 159 = 12720

パターンをどう使い分けるかアイディア
* 意味の大小：CCVcvは意味の大きい言葉、生物や時間など。cVccvは意味の小さい言葉、牛、秒など
* 母音を大きさの指標とする。小さいものから順にiuaeoと大きくなる。


# 使用する子音の厳選

 d | z | j | b | v | g | t | s | c | p | f | k | r | l | m | n
:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
   |**zd**|**jd**| bd| vd| gd|   |   |   |   |   |   | rd| ld| md| nd 
~~**dz**~~|  |   | bz| vz| gz|   |   |   |   |   |   | rz| lz|   | nz 
~~**dj**~~|   |   | bj| vj| gj|   |   |   |   |   |   | rj| lj| mj| nj 
 db|**zb**|**jb**|   | vb| gb|   |   |   |   |   |   | rb| lb| mb| nb 
 dv|**zv**|**jv**| bv|   | gv|   |   |   |   |   |   | rv| lv| mv| nv 
 dg|**zg**|**jg**| bg| vg|   |   |   |   |   |   |   | rg| lg| mg| ng 
| | | | | | | | st| ct| pt| ft| kt| rt| lt| mt| nt  
| | | | | | | ~~**ts**~~| | cs| ps| fs| ks| rs| ls| ms| ns 
| | | | | | | ~~**tc**~~| sc| | pc| fc| kc| rc| lc| mc| nc 
| | | | | | | tp| **sp**| **cp**| | fp| kp| rp| lp| mp| np 
| | | | | | | tf| **sf**| **cf**| pf| | kf| rf| lf| mf| nf 
| | | | | | | tk| **sk**| **ck**| pk| fk| | rk| lk| mk| nk 
 **dr**| zr| jr| **br**| **vr**| **gr**| **tr**| **sr**| **cr**| **pr**| **fr**| **kr**| | lr| **mr**| nr 
     dl| zl| jl| **bl**| **vl**| **gl**| **tl**| **sl**| **cl**| **pl**| **fl**| **kl**| rl| | **ml**| nl 
 dm| **zm**| **jm**| bm| vm| gm| tm| **sm**| **cm**| pm| fm| km| rm| lm| | nm 
 dn| zn| jn| bn| vn| gn| tn| **sn**| **cn**| pn| fn| kn| rn| ln| mn|  


     d  z  j  b  v  g
     t  s  c  p  f  k
     r  l  m  n
    ------------------------------------------------ c =16
    dr zd jd br vr gr
       zm jm bl vl gl
             zb zv zg
             jb jv jg
    tr st ct pr fr kr
             pl fl kl
             sp sf sk
             cp cf ck
    sr sl sm sn
    cr cl cm cn
    ------------------------------------------------ CC= 40
    nd nz nj mb nv ng nt ns nc mp nf nk nr nl nm --  15

     d  z  j  b  v  g  t  s  c  p  f  k  r  l  m  n
    ------------------------------------------------ c =16
    dr zd jd br vr gr tr st ct pr fr kr
       zm jm bl vl gl          pl fl kl  
             zb zv zg          sp sf sk sr sl sm sn
             jb jv jg          cp cf ck cr cl cm cn
    ------------------------------------------------ CC= 40
             bd vd gd                   rd ld md nd 
             bz vz gz                   rz lz    nz 
             bj vj gj                   rj lj mj nj 
    db          vb gb                   rb lb mb nb 
    dv       bv    gv                   rv lv mv nv 
    dg       bg vg                      rg lg mg ng 
                               pt ft kt rt lt mt nt
                               ps fs ks rs ls ms ns
                               pc fc kc rc lc mc nc
                            cp    fp kp rp lp mp np
                            cf pf    kf rf lf mf nf
                            ck pk fk    rk lk mk nk
       zr jr                cr             lr mr nr
    dl zl jl          tl    cl          rl    ml nl
    dm       bm vm gm tm    cm pm fm km rm lm    nm
    dn zn jn bn vn gn tn    cn pn fn kn rn ln mn 
    ------------------------------------------------ cc-CC=
    rd rz rj rb rv rg rt rs rc rp rf rk    rl rm rn
    ld lz lj lb lv lg lt ls lc lp lf lk lr    lm ln
    nd nz nj mb nv ng nt ns nc mp nf nk nr nl nm mn
    dn zn jn bn vn gn tn    cn pn fn kn
    ------------------------------------------------ 厳選cc

    dz                ts
    dj                tc
    ------------------------------------------------ Cc= 4

Sources
-------
### lo gimste jo'u lo ma'oste
jpn-gimste.tsv & jpn-mahoste.tsv
http://guskant.github.io/lojbo/gismu-cmavo.html

### jbovlaste xml-export in japanese
http://jbovlaste.lojban.org/export/xml-export.html?lang=ja

### Lojban thesaurus
http://mw.lojban.org/papri/Lojban_thesaurus

### 単語頻度リスト
http://mw.lojban.org/papri/File:MyFreq-COMB_without_dots.txt

### gismu & cmovo .txt
https://github.com/lojban/jbovlaste/blob/master/bin/gismu.txt
https://github.com/lojban/jbovlaste/blob/master/bin/cmavo.txt


Frequency Sources
-----------
https://mw.lojban.org/papri/te_gerna_la_lojban

### 藪の中  - by 芥川龍之介 (AKUTAGAWA Ryunosuke)
guskant
http://guskant.github.com/yabu/html5/jbojpn.html

### NIWA Yoshinori
作品の解説を23種類の言語に翻訳する 丹羽良徳の2004年から2012年の介入プロジェクト
http://ponjbogri.github.io/cemfanva/niwa/niwa2013.html
