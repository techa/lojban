(function() {
	'use strict';

	var List =new Class({
		Implements:[Events,Options],

		options:{
			keyName:"key",
			valueName:"value",
			number:false
		},

		list:null,

		initialize: function (listObject,options) {

			this.setOptions( options );

			this.list =[];// main List

			this.add( listObject );
		},

		findIndex: function (indexOrKey) {
			var index = -1,
				list=this.list;
			switch (typeOf(indexOrKey)) {
				case "string":
					index = list.map(function (val) {
						return val[ this.options.keyName ];
					},this).indexOf(indexOrKey);
					break;

				case "number":
				case "boolean":
					index = (+indexOrKey).index(list.length);
					break;

				case "object":
					var i = 0,
						everyFun=function (val,key) {
							return list[i][key] === val;
						};

					for (; i < list.length; i++) {
						var check= Object.every(indexOrKey, everyFun);

						if (check) {
							index = i;
							break;
						}
					}
					break;

				default:
					console.error("TypeError: List.get indexOrKey");
			}

			return index;
		},

		get: function (indexOrKey,valueKey) {
			var item = this.list[ this.findIndex(indexOrKey) ];
			return typeof valueKey=="string"&&item ? item[ valueKey ] : item;
		},
		at: function (indexOrKey,valueKey) {
			var item = this.list[ this.findIndex(indexOrKey) ];
			return item[ valueKey||this.options.valueName ] ;
		},

		valueInit: function (key, value) {
			if (typeOf(value)!=="object") {
				var val=value;
				value = {};
				value[ this.options.valueName ] = val;
			}

			// optionsに番号初期値が入力されていたら番号を振る
			if (this.options.number!==false && typeOf(this.options.number)=="number" ) {
				value.number = this.options.number;
				this.options.number++;
			}

			// key:{value...} を　{keyName:key, value...}に
			value[ this.options.keyName ] = key;

			return value;
		},
		// 完全に上書き
		add: function (key,value) {
			var index = this.findIndex(key);
			this.list.splice(  (index<0 ? this.list.length : index)   ,1,this.valueInit(key, value));
			return this;
		}.overloadSetter(),
		// オーバーライド
		append: function (key, value) {
			var index=this.findIndex(key),
				val = this.valueInit(key, value);

			if (index<0) {
				this.list.push(val);
			}else {
				Object.append(this.list[ index ], val);
			}

			return this;
		}.overloadSetter(),

		sort: function (keyName) {
			if (typeOf(keyName)=="function") {
				this.list.sort( keyName.bind(this) );
			}else {
				this.list.sortBy( keyName||this.options.keyName );
			}
			return this;
		},
	});

	["push","shift","pop","unshift","splice","slice","forEach","map","every","some","filter"].each(function (key) {
		List.implement(key,function () {
			return Array.prototype[key].apply(this.list,arguments);
		});
	});

	var list = new List({
		a:"one",
		b:"two",
		c:"three",
		d:"four",
		e:"five"
	});


	console.log("list",list.get({value:"four"}));


	var RotateElement = new Class({
		Extends:List,
		options:{
			keyName:"addClass",
			valueName:"text",
			number:false,
			attach:true,// initializeで新しくインスタンス化するときlist[state]を反映させるか
			state:0,//現在の状態を保存
			morph:false,
			event:"click",
			events:false,//{eventName:function}:mouseover,mouseoutなどの挙動を設定
			eventName:false//String:これを設定すると$$("#").fireEvent(eventName)でeventを発火できる
		},

		initialize: function (elements,stateList,options) {
			this.elements=$$(elements);

			// List initialize
			this.parent(stateList,options);

			if (this.options.attach) {
				this.changeState(this.options.state);
			}

			// Events
			if(this.options.events)//this.elements.addEvents(this.options.events);
				Object.each(this.options.events,function(val,key){
					this.elements.addEvent(key,val.bind(this));
				}.bind(this));

			if(this.options.event)
				this.elements.addEvent(this.options.event,function(){this.setState();}.bind(this));

			if(this.options.eventName)
				this.elements.addEvent(this.options.eventName,function(n){this.setState(n);}.bind(this));
		},

		getState: function (attribute) {
			//
		},
		setState: function (indexOrKey) {
			var index = this.findIndex( (typeOf(indexOrKey)=="null") ? (this.options.state+1) : indexOrKey);

			if (index!=this.options.state) {
				this.changeState(index);
			}
			return this;
		},

		changeState: function (index) {
			var nowState = this.list[ index ],
				name=nowState[ this.options.keyName ],
				eventArguments=[name, index ];

			this.fireEvent("action",eventArguments);
			this.fireEvent(name,eventArguments);

			this.elements.each(function(el){
				if(this.options.morph){
					el.set("morph",this.options.morph);

					if(nowState.styles)
						el.morph(nowState.styles);
					else if(nowState.addClass)
						el.morph(nowState.addClass);
				}

				el.removeClass(this.list[ this.options.state ].addClass)
				  .addClass(nowState.addClass)
				  .set(nowState);
			},this);
			this.options.state= index ;
			return this;
		},
	});

	var ToggleElement = new Class({
		Extends:RotateElement,
		initialize: function (element, options) {
			var active = {addClass:"active"};

			if(options.active){
				Object.append( active, options.active );
			}

			this.parent(element,{
				active:active,
				passive:options.passive||{},
			},Object.append({
				keyName:"name"
			},options));
		}
	});

	var SelectableElements = new Class({
		Extends:List,

		options:{
			keyName:"key",
			valueName:"value",
			number:false,
			multiple:false,
			state:0,
		},
		initialize: function (element, list) {

		},
	});

}());
