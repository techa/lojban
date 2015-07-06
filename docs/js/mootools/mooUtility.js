(function(window, $, undefined){
	"use strict";
	// Math オブジェクトの拡張
	Object.append(Math,{
		// global
		// pow ^
		// sqrt √
		dg2rd:Math.PI/180,
		rd2dg:180/Math.PI,
		sind:function(dg){return Math.sin(dg*Math.dg2rd);},
		cosd:function(dg){return Math.cos(dg*Math.dg2rd);},
		tand:function(dg){return Math.tan(dg*Math.dg2rd);},
		sins:function(rd){return Math.asin(rd)*Math.rd2dg;},// x/r
		coss:function(rd){return Math.acos(rd)*Math.rd2dg;},// y/r
		tans:function(rd){return Math.atan(rd)*Math.rd2dg;},// y/x
		siny:function(r,dg){return r*Math.sind(dg);},
		sinr:function(y,dg){return y/Math.sind(dg);},
		cosx:function(r,dg){return r*Math.cosd(dg);},
		cosr:function(x,dg){return x/Math.cosd(dg);},
		tany:function(r,dg){return r*Math.tand(dg);},
		tanx:function(r,dg){return r/Math.tand(dg);},
		pit :function(a,b){return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));},
		pit2:function(r,AorB){return Math.sqrt(Math.pow(r,2)-Math.pow(AorB,2));},
		cosF:function(b,c,dgA){return Math.sqrt(b*b+c*c-2*b*c*Math.cosd(dgA));},
		//http://www.geocities.co.jp/Playtown-Toys/2593/JavaScript/rational.html
		gcd:function(a,b){var r;while(b>0){r=a%b;a=b;b=r;}return a;},//最大公約数
		lcm:function(a,b){var g=Math.gcd(a,b);return a/g*b;},//最小公倍数
		euler:function(p){var n=0;for(var i=1;i<p;i++){if(Math.gcd(i,p)==1)n++;}return n;},//オイラーのφ関数
		//円のハンドル：http://park12.wakwak.com/~shp/cgi-bin/wiki.cgi/view/bezier_curve
		handle:function(dg){return 4/3*Math.tan(dg/4/180*Math.PI);},
		//星形多角形スポーク比：参考 http://i-njoy.net/inkscape/star_polygon.html
		spoke:function(points,dens){return Math.cos(Math.PI*dens/points)/Math.cos(Math.PI*(dens-1)/points);},
		randomInt: function (min, max) {
			if (arguments.length<2) {max=min||1;min=0;}
			return Math.floor( Math.random()*(max-min+1) ) + min;
		},
		randomFloat: function (min, max) {return Math.random()*(max-min)+min;},
		/**
		 * time, begin, change, duration
		 * t : 時間(進行度) : 0~1
		 * b : 開始の値(開始時の座標やスケールなど) : 0
		 * c : 開始と終了の値の差分 : 100
		 * d : Tween(トゥイーン)の合計時間 : 1
		 */
		easeInCubic: function (t, b, c, d) {
			t /= d;
			return c*t*t*t + b;
		}
	});

	Number.implement({
		// mootools Core
		// random(min,max)  : Number.random(5, 20); // returns a random number between 5 and 20.
		// limit(min,max)   : (12).limit(2, 6.5);   // returns 6.5
		//                  : (-4).limit(2, 6.5);   // returns 2
		//                  : (4.3).limit(2, 6.5);  // returns 4.3
		// round([precisionNumber])
		//                  : (12.45).round()    // returns 12
		//                  : (12.45).round(1)   // returns 12.5
		//                  : (12.45).round(-1)  // returns 10
		// times(fn[, bind]): (4).times(alert);  // alerts "0", then "1", then "2", then "3".
		// toFloat()        : (111).toFloat();   // returns 111
		//                  : (111.1).toFloat(); // returns 111.1
		// toInt([base])    : (111).toInt();     // returns 111
		//                  : (111.1).toInt();   // returns 111
		//                  : (111).toInt(2);    // returns 7
		// Math methods
    	// abs, acos, asin, atan2, ceil, cos, exp, floor, log, max, min, pow(^), sin, sqrt(√), tan
		//                  :(-1).abs(); // returns 1
		//                  :(3).pow(4); // returns 81

		// ============================================================
		//  4.index(4) -> 0
		//  5.index(4) -> 1
		// -1.index(4) -> 3
		index: function (length) {
			var l=length.length||length||1;
			var num = this % l;// 数字がlengthを超えていた場合
			return num<0 ? l+num : num ;
		},
		ordinalize:function(){//1=>"1st",2=>"2nd"...
			var last=parseInt((Math.abs(this)+"").slice(-2),10),
				a=(last/10)|0,//十の位
				b=last-a*10;//一の位
			if(a!==1){//11,12,13以外の1,2,3で終わる数字にそれぞれ処理
				if(b==1)
					return this+"st";
				else if(b==2)
					return this+"nd";
				else if(b==3)
					return this+"rd";
			}//それ以外は
			return this+"th";
		}
	});

	Number.convert=function(obj,num){
		switch (typeOf(obj)) {
			case "string":{
				num = +num||0;
				var match = obj.replace(/\s+/g,"").test(/^([\+\-/*]?)(\d*(?:\d|\.\d)\d*)(%?)$/);
				if (match) {
					var n = match[2].toFloat();

					// %
					if (match[3]) {
						n*=num/100;
						switch (match[1]) {
							case "+":return num + n;
							case "-":return num - n;
							// case "*":return n;
							// case "/":if(n)return num / n;
						}
						return n;
					}

					switch (match[1]) {
						case "+":return num + n;
						case "-":return num - n;
						case "*":return num * n;
						case "/":if(n)return num / n;
					}
				}
			}break;
			case "boolean":{
				num = +num||1;
				return obj ? num :-num;
			}break;
			case "number":{
				return obj;
			}break;
			default:
				return +num||0;
		}
	};

	String.implement({
		// mootools Core
		// test(regexStringOrRegexp[, regexFlgsString])
		//                : 'I like cookies'.test('cookie');      // returns true
		//                : 'I like cookies'.test('COOKIE', 'i'); // returns true (ignore case)
		//                : 'I like cookies'.test('cake');        // returns false
		// contains(searchString[, positionNumber])
		//                : 'a bc'.contains('bc');      // returns true
		//                : 'abc'.contains('b', 1);     // returns true
		//                : 'abc'.contains('b', 2);     // returns false
		// trim()         : '    i like cookies     '.trim();                 // returns 'i like cookies'
		// clean()        : '  i like  cookies   \n\n'.clean();               // returns 'i like cookies'
		// camelCase()    : 'I-like-cookies'.camelCase();                     // returns 'ILikeCookies'
		// hyphenate()    : 'ILikeCookies'.hyphenate();                       // returns '-i-like-cookies'
		// capitalize()   : 'i like cookies'.capitalize();                    // returns 'I Like Cookies'
		// escapeRegExp() : 'animals.sheep[1]'.escapeRegExp();                // returns 'animals\.sheep\[1\]'
		// toInt()        : '4em'.toInt();                                    // returns 4
		// toFloat()      : '95.25%'.toFloat();                               // returns 95.25
		// substitute()   : "{a} is {b}.".substitute({a:"Jack",b:"saviour"})  // returns 'Jack is saviour.'
		// hexToRgb([returnArrayFlg])
		//                : '#123'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		//                : '112233'.hexToRgb(); // returns 'rgb(17, 34, 51)'
		//                : '#112233'.hexToRgb(true); // returns [17, 34, 51]
		// rgbToHex([returnArrayFlg])
		//                : 'rgb(17, 34, 51)'.rgbToHex(); // returns '#112233'
		//                : 'rgb(17, 34, 51)'.rgbToHex(true); // returns ['11', '22', '33']
		//                : 'rgba(17, 34, 51, 0)'.rgbToHex(); // returns 'transparent'

		// ============================================================
		//"abcdefg".at(0,-1,[2,5]) => "a"+"g"+"cde" => returns "agcde"
		at:function() {
			var l=this.length,
                newStr="";
			for (var i = 0; i < arguments.length; i++) {
				var index = arguments[i];
				if (typeOf(+index)=="number") {// 数値化できるなら数値化する
					index = +index;
				}

				switch (typeOf(index)) {
					case "number":
						newStr+= this[ index.index(l) ];
						break;

					case "array":
						newStr+= String.prototype.slice.apply(this,index);
						break;

					default:
						console.error("TypeError: String.at arguments must number or numberArray");
				}
			}
			return newStr;
		},
		convert:function(options){
			var str=this.replace(/\s+/g,"");
			if(str.test(/^true$/i))
				return true;
			else if(str.test(/^false$/i))
				return false;
			else if(str.test(/^[\+\-]*[\.0-9]+$/))
				return str.toFloat();
			else if(str.test(/^(\{[\s\S]*\}|\[[\s\S]*\]|\{(\"\w+\"\:\S)+\})$/))
				return JSON.decode(str);
			else if(str.test(/^(\S+\,)+\S+$/))
				return str.split(",").map(function(v){return v.convert();});
			return this;
		},
		toRegExp:function(flg){
			return new RegExp(this,flg);
		},

		// queryToObject()
	});

	Array.implement({
		// mootools Core
		// contains(item[, from])
		//      : ['a', 'b', 'c'].contains('a');   // returns true
		//      : ['a', 'b', 'c'].contains('d');   // returns false
		//      : ['a', 'b', 'c'].contains('a',1); // returns false
		//
		//  - get-------
		// getLast() :['Cow', 'Pig', 'Dog', 'Cat'].getLast(); // returns 'Cat'
		// getRandom()
		// picked() 配列のnull or undefined でない最初の値を返す
		//
		//  - set-------
		// include(item)
		//      : ['Cow', 'Pig', 'Dog'].include('Cat'); // returns ['Cow', 'Pig', 'Dog', 'Cat']
		//      : ['Cow', 'Pig', 'Dog'].include('Dog'); // returns ['Cow', 'Pig', 'Dog']
		// append(arry)
		//      : var animals = ['Cow', 'Pig', 'Dog'];
		//      : animals.append(['Cat', 'Dog']);                //animals = ['Cow', 'Pig', 'Dog', 'Cat', 'Dog'];
		// combine(array)
		//      : var animals = ['Cow', 'Pig', 'Dog'];
		//      : animals.combine(['Cat', 'Dog']);               //animals = ['Cow', 'Pig', 'Dog', 'Cat'];
		// erase(item)
		//      : ['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].erase('Dog') // returns ['Cow', 'Pig', 'Cat']
		//      : ['Cow', 'Pig', 'Dog'].erase('Cat')               // returns ['Cow', 'Pig', 'Dog']
		// empty()
		//      : var myArray = ['old', 'data'];
		//      : myArray.empty(); //myArray is now []
		//
		//  - Creates a new array-----------
		// from(arguments)
		// clone()
		// invoke(method[,arg, arg, arg,,,,,])
		//      : [4, 8, 15, 16, 23, 42].invoke('limit', 10, 30)            // returns [10, 10, 15, 16, 23, 30]
		// clean() - not null or undefined
		//      :[null, 1, 0, true, false, 'foo', undefined, ''].clean()    // returns [1, 0, true, false, 'foo', '']
		// flatten()
		//      : [1,2,3,[4,5, [6,7]], [[[8]]]].flatten();                  // returns [1,2,3,4,5,6,7,8]
		//
		//  - Creates a new object-----------
		// associate(keyNamesArray)　値配列をオブジェクトに
		//      : ['Moo', 'Oink', 'Woof', 'Miao'].associate(['Cow', 'Pig', 'Dog', 'Cat']);
		//      // returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}
		// link(object)
		//       var el = document.createElement('div');
		//       var arr2 = [100, 'Hello', {foo: 'bar'}, el, false];
		//       arr2.link({
		//           myNumber: Type.isNumber,
		//           myElement: Type.isElement,
		//           myObject: Type.isObject,
		//           myString: Type.isString,
		//           myBoolean: function(obj){ return obj != null; }
		//       });
		//       // returns {myNumber: 100, myElement: el, myObject: {foo: 'bar'}, myString: 'Hello', myBoolean: false}
		//
		// indexOf(item[, from])
		//
		// MDN: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array#Iteration_methods
		// each(fn[, bind]) = forEach(fn[, bind])
		// map(fn[, bind])
		// every(fn[, bind])
		//      : [10, 4, 25, 100].every(function(item, index){
		//      :     return item > 20;
		//      : });                            // returns false
		// some(fn[, bind])
		//      : [10, 4, 25, 100].some(function(item, index){
		//      :     return item > 20;
		//      : });                            // returns true
		// filter(fn[, bind])
		//      : [10, 4, 25, 100].every(function(item, index){
		//      :     return item > 20;
		//      : });                           // returns [25,100]
		//
		//  - color------------------
		// hexToRgb([returnArrayFlg]) 'FF' -> 255
		//      : ['11', '22', '33'].hexToRgb();     // returns 'rgb(17, 34, 51)'
		//      : ['11', '22', '33'].hexToRgb(true); // returns [17, 34, 51]
		// rgbToHex([returnArrayFlg]) 255 -> 'FF'
		//      : [17, 34, 51].rgbToHex(); // returns '#112233'
		//      : [17, 34, 51].rgbToHex(true); // returns ['11', '22', '33']
		//      : [17, 34, 51, 0].rgbToHex(); // returns 'transparent'

		// ============================================================
		at: function () {
			var l=this.length,
				newAry=[];
			for (var i = 0; i < arguments.length; i++) {
				var index = arguments[i];
				if (typeOf(+index)=="number") {// 数値化できるなら数値化する
					index = +index;
				}

				switch (typeOf(index)) {
					case "number":
						if (arguments.length==1) {
							//引数が１個で数字の場合のみ配列の中身を返す
							return this[ index.index(l) ];
						}
						newAry.push( this[ index.index(l) ] );
						break;

					// case "string":// key=search:returnKey
					//
					// 	break;

					case "array":
						newAry.append( Array.prototype.slice.apply(this,index) );//下と同じ意味
						// newAry=newAry.concat( Array.prototype.slice.apply(this,index) );
						break;

					default:
						console.error("TypeError: Array.at arguments must number or numberArray");
				}
			}
			return newAry;
		},
		convert:function(){
			return this.map(function(v){return v.convert();});
		},

		// 以下はMoreにはある
		max: function () {
			return Math.max.apply(null,this);
		},
		min: function () {
			return Math.min.apply(null,this);
		},
		unique:function(flg){
			var o=[],
				l=this.length;
			for(var i=0;i<l;i++)
				if(o.indexOf(this[i])<0)
					o.push(this[i]);
			return o;
		},
		shuffle:function(){
			var l=this.length,i,t;
			while(l){
				i = Math.floor(Math.random()*l--);
				t = this[l];
				this[l] = this[i];
				this[i] = t;
			}
			return this;
		},
	});

	/*!<array-sortby.js 1.3.0>
	* Copyright (c) 2010 Eneko Alonso & Fabio M. Costa
	* Released under the MIT license (http://opensource.org/licenses/mit-license.php)
	* source: http://github.com/eneko/Array.sortBy
	*/
	var keyPaths = [];
	function saveKeyPath(path) {
		keyPaths.push({
			sign: (path[0] === '+' || path[0] === '-')? parseInt(path.shift()+1) : 1,
			path: path
		});
	}
	function valueOf(object, path) {
		var ptr = object;
		path.each(function(key) { ptr = ptr[key]; });
		return ptr;
	}
	function comparer(a, b) {
		for (var i = 0, l = keyPaths.length; i < l; i++) {
			aVal = valueOf(a, keyPaths[i].path);
			bVal = valueOf(b, keyPaths[i].path);
			if (aVal > bVal) return keyPaths[i].sign;
			if (aVal < bVal) return -keyPaths[i].sign;
		}
		return 0;
	}
	Array.implement('sortBy', function(){
		keyPaths.empty();
		Array.each(arguments, function(argument) {
			switch (typeOf(argument)) {
				case "array": saveKeyPath(argument); break;
				case "string": saveKeyPath(argument.match(/[+-]|[^.]+/g)); break;
			}
		});
		return this.sort(comparer);
	});
	/*!</array-sortby.js 1.3.0>*/

	Object.extend({
		// mootools Core
		// clone()
		// contains(object, value)
		//       : Object.contains({a: 'one', b: 'two', c: 'three'}, 'one');  // returns true
		//       : Object.contains({a: 'one', b: 'two', c: 'three'}, 'four'); // returns false
		// - get -------
		// keys(object)       returns keysArray
		// values(object)     returns valuesArray
		// getLength(object)  returns objectSizeNumber
		// subset(object, keysArray) - object は変化しない
		//       : Object.subset({ a: 'one', b: 'two', c: 'three' }, ['a', 'c']);// returns {a: 'one', c: 'three'}
		//
		// - set -------
		// append(original, extension)
		//       : Object.append({a: {b: 1, c: 1}}, {a: {b: 2}, d: 5}) // returns: {a: {b: 2}, d: 5}
		// merge(original, obj1[, obj2[, ...]])
		//       : Object.merge({a: {b: 1, c: 1}}, {a: {b: 2}, d: 5}) // returns: {a: {b: 2, c: 1}, d: 5}
		//
		// Array's Methods
		// keyOf(object,value)  = Array.indexOf()
		// each(object, fn[, bind])
		// map((object, fn[, bind]))
		// every((object, fn[, bind]))
		// some((object, fn[, bind]))
		// filter((object, fn[, bind]))
		//
		// toQueryString(object[, base])
		//       :Object.toQueryString({apple: 'aka', lemon: 'ki'});
		//       // returns 'apple=aka&lemon=ki'
		//       :
		//       :Object.toQueryString({apple: 'aka', lemon: 'ki'}, 'fruits');
		//       // returns 'fruits[apple]=aka&fruits[lemon]=ki'

		// ============================================================
		// objからeracekeyを削除する
		erace: function (obj /*,eraceKey1 ,eraceKey2 .....*/) {
			var args =Array.slice(arguments, 1).flatten();

			args.each(function (val) {
				if (obj.hasOwnProperty(val) ) {
					delete obj[val];
				}
			});
			return obj;
		},
		// objからeracekeyを削除した新しいオブジェクトを返す
		// reject(object, keysArray) - object は変化しない
		//       : Object.reject({ a: 'one', b: 'two', c: 'three' }, ['a', 'c']);// returns {b: 'two'}
		reject: function (obj /*,eraceKey1 ,eraceKey2 .....*/) {
			var newObj = {},
				args =Array.slice(arguments, 1).flatten();

			Object.each(obj,function (val,key) {
				if (!args.contains(key)) {
					newObj[key] = val;
				}
			});

			return newObj;
		},

		at: function (obj) {
			var args = Array.slice(arguments, 1).flatten(),
				newObj={};

			switch (typeOf(obj)) {
				case "string":
					return String.prototype.at.apply(obj, args);

				case "array":
					return Array.prototype.at.apply(obj, args);

				case "object":{
					var keys=Object.keys( obj );
					for (var i = 0; i < args.length; i++) {
						var key = args[i];

						switch (typeOf(args[i])) {
							case "string":break;
							case "number":
								key = keys.at(key);
								break;
							case "regexp":{
								// 正規表現でマッチするキーを持つオブジェクト
								for (var j = 0; j < keys.length; j++) {
									if (keys[j].test(key)) {
										newObj[ keys[j] ] = obj[ keys[j] ];
									}
								}
								if (args.length==1) {
									return newObj;
								}
							}break;
							default:
								console.error("TypeError: Object.at arguments.");
						}
						if (args.length==1) {
							return obj[ key ];
						}
						else {
							newObj[key] = obj[ key ];
						}
					}
					return newObj;
				}break;
				// objが文字デモ配列でもオブジェクトでもなかったらエラーだじょ
				default:
					console.error("TypeError: Object.at obj");
			}
		},
		// $.accessor(アクセスしたいオブジェクト,アクセスしたいキー)return Value
		/*
		$.accessor({
			a:{
				b:{
					c:[0,2,4,6,8,10],
					d:[1,3,5,7,9,11]
				},
				e:{
					f:{
						g:8,
						h:"i",
						j:{
							k:45
						}
					},
					l:"LLLL"
				}
			},
			m:[
				{
					key:"n",
					value:"o"
				},
				{
					key:"p",
					value:["q","r",67,78]
				},
				{
					key:"p",
					value:{
						s:10000
					}
				},
				{
					key:"t",
					value:5
				}
			]
		},"1.p/key:value.-2");//"1.p:.-2"

		==>return 67
		*/

		accessor: function (obj,key,options) {
			// keyを配列に直す
			var keyAry;
			switch (typeOf(key)) {
				case "string":
					keyAry = key.replace(/\s+/g,"").split(/[\.]/);
					break;
				case "number":
					keyAry = [key|0];
					break;
				case "array":
					keyAry = key;
					break;
				default:
					keyAry = [];
					// console.error("TypeError: Object.accessor key ");
			}


			var opt={
				auto:true,//keyの深さに限らずArrayか、Objectでないものが出た時点でその値を返す
				deep:false,//keyの深さに限らずArrayかObjectでないものが出るまで繰り返す
				// unshift:[],push:[],どちらか
				// insert:{}//数字は若い順に入れないと混乱すると思う。
			};

			if (options) {
				Object.append(opt,options);
			}

			// keyAryをデフォルトとすり合わせ
			for (var variable in opt) {
				var optAry=opt[ variable ];

				switch (variable) {
					case "unshift":
						// keyAry[5,6] + unshift[0,1,2,3,4] = [0,1,2,5,6]
						if (optAry.length>keyAry.length) {
							optAry.length -= keyAry.length;
							keyAry=optAry.concat(keyAry);
						}
						break;

					case "push":
						// keyAry[5,6] + push[0,1,2,3,4] = [5,6,2,3,4]
						if (optAry.length>keyAry.length) {
							keyAry.append( optAry.slice(keyAry.length) );
						}
						break;

					case "insert":
						// keyAry[0,1,2,3,4] + insert{3:5,0:[6,7]} = [6,7,0,1,2,5,3,4]
						for (var numKey in optAry) {
							if (typeOf(+numKey)=="number") {
								keyAry.splice(+numKey, 0, optAry[ numKey ]);
							}
						}
						keyAry = keyAry.flatten();
						break;
				}
			}

			// console.log("accessor--",keyAry);

			// access
			// opt.deep  keyの深さに限らずArrayかObjectでないものが出るまで繰り返す
			for (var i = 0; (i < keyAry.length) || opt.deep ; i++) {
				// keyの深さに限らずArrayかObjectでないものが出た時点でその値を返す
				if (!typeOf( obj ).test(/array|object/)) {
					return (opt.auto||opt.deep)? obj : undefined;
				}

				var k = keyAry[i];
				// if (typeOf(+k)=="number") {
				// 	k = +k;
				// }
				// else
				if (opt.deep) {//deep==trueのとき
					if (typeOf(k)!="string") {
						k=(k|0)||0;//無理矢理数字にする
					}
				}

				if(typeOf(+k)=="number") {// 数値化できるなら数値化する
					k=+k;
				}

				obj = Object.at( obj, k);
			}
			return obj;
		},

		// Object.supplement( {a:"a"}, {a:"A",b:"b"}) =>{a:"a",b:"b"}
		// あるものは変更せず、ないものだけ補完する
		supplement: function (obj,overObjct) {
			Object.each(overObjct,function (val,key) {
				if( ! obj.hasOwnProperty( key )){
					obj[ key ] = val;
				}
			});
			return obj;
		},

		convert: function (obj) {
			switch (typeOf( obj )) {
				case "string":
					var o=obj.clean();
					if(o.test(/^true$/i))
						return true;
					if(o.test(/^false$/i))
						return false;
					if (typeOf(+o)=="number")
						return +o;

					if(o.test(/^(\{[\s\S]*\}|\[[\s\S]*\]|\{(\"\w+\"\:\S)+\})$/))
						return JSON.decode(o);
					if ( o.test(/,/) )
						return Object.convert(o.split(/,/));
					return o;
				case "object":
				case "array":
					Object.map(obj,function(v){return Object.convert(v);});
					break;
				default:
					return obj;
			}
		},
		html: function (obj,tag) {
			var html = "<"+tag;
			Object.each(obj,function (val,key) {
				html += " "+ key + "=" +'"' +val+ '"';
			});
			return html;
		},


		//Object をインデントされた文字列に変換
		stringify:function (obj,options){
			options=Object.append({
				tabLength:0,//(number/string)数字を入れるとsoftTabにする
				aryIndent:Infinity,//(number/function)// 配列が全て数字の場合かaryIndent以下の文字列の場合インデントしない
				indent:0,//(number)
			},options);

			switch (typeOf(options.aryIndent)) {
				case "function":break;
				default:
					options.aryIndent=function (val) {
						var type=typeOf(val);
						return type=="number"||(type=="string"&&val.length<options.aryIndent);
					};
			}

			function obj2str(obj,tabs){
				var str;
				switch(typeOf(obj)){
					case "string":{
						return tabs+'\"'+obj+'\"';
					}break;

					case"array":{
						if (obj.every(options.aryIndent)) {
							// 配列が全て数字の場合かaryIndent以下の文字列の場合インデントしない
							str=tabs+"[";
							obj.forEach(function(v,i){
								str += obj2str(v,tabs+"\t");
								if(i<obj.length-1)
									str+=",";
							});
							return str+"]";
						}else{
							// それ以外の場合インデントする
							str=tabs+"[\n";
							obj.forEach(function(v,i){
								str +=obj2str(v,tabs+"\t");
								if(i<obj.length-1)
									str+=",";
								str+="\n";
							});
							return str+tabs+"]";
						}
					}break;

					case"object":{
						str=tabs+"{\n";
						Object.keys(obj).forEach(function(v,i,k){
							str+=tabs+"\t"+v+" : "+obj2str(obj[v],tabs+"\t");
							if(i<k.length-1)
								str+=",";
							str+="\n";
						});
						return str+tabs+"}";
					}break;

					default:{
						return tabs+obj.toString();
					}
				}
				return false;
			}
			var string = obj2str(obj,"");

			// Soft Tab
			if (options.tabLength) {
				switch (typeOf(options.tabLength)) {
					case "string":break;
					case "number":
						var n=options.tabLength;
						options.tabLength="";
						n.min(1).times(function () {
							options.tabLength+=" ";
						});
						break;
					default:
						console.error();
				}
				string=string.replace(/\t/g,options.tabLength);
			}

			// Indent
			if (options.indent) {
				var regexp="\n";
				options.indent.times(function () {
					regexp+="\t";
				});
				string= string.replace(new RegExp(regexp,"g"),"");
			}

			return string.replace(/([^\n\t]+)\t+/g,"$1");
		}
	});

	[Element, Document, Window].invoke('implement',{
		clicker: function () {
			// .click()はIE,firefoxでは動作しないらしいので以下の処理が必要
			// http://d.hatena.ne.jp/language_and_engineering/20090907/p1
			switch (Browser.name) {
				case"ie":this.fireEvent("onclick");break;

				case"firefox":{
					var event = document.createEvent( "MouseEvents" ); // マウスイベントを作成
					event.initEvent( "click", false, true ); // イベントの詳細を設定
					this.dispatchEvent( event ); // イベントを強制的に発生させる
				}break;
				
				default:
					this.click();
			}
			return this;
		}
	});
})(window, document.id);
