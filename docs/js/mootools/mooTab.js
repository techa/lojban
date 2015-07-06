/*!
---
description: TabPane Class

license: MIT-style

authors: akaIDIOT

version: 0.5.2

requires:
  core/1.4:
  - Class
  - Class.Extras
  - Event
  - Element
  - Element.Event
  - Element.Delegation

provides: TabPane
...
*/

(function() {
	"use strict";

// make typeOf usable for MooTools 1.2 through 1.5
// var typeOf = this.typeOf || this.$type;

var TabPane = window.TabPane = new Class({

	Implements: [Events, Options],

	options: {
		tabSelector: '.tab-nav',
		contentSelector: '.tab-content',
		activeClass: 'active',
		show:false, // - (number: defaults to false) The index of the element to be shown initially.
		alwaysHide: false//If set to true, it will be possible to close all displayable elements.//trueにすると全て閉じることが出来る
	},

	container: null,
	nowIndex:null,

	initialize: function(container, options, showNow) {
		this.setOptions(options);

		this.container = document.id(container);
		// hide all the content parts by default
		this.container.getElements(this.options.contentSelector).setStyle('display', 'none');

		// add a relayed click event to handle switching tabs
		this.container.addEvent('click:relay(' + this.options.tabSelector + ')', function(event, nav) {
			this.show(nav);
		}.bind(this));

		if (this.options.show!==false) {
			this.show(this.options.show);
		}
	},

	get: function(index) {
		if (typeOf(index) == 'element') {
			// call get with the index of the supplied element (NB: will break if indexOf returns -1)
			return this.get(this.indexOf(index));
		} else {
			var nav = this.container.getElements(this.options.tabSelector)[index];
			var content = this.container.getElements(this.options.contentSelector)[index];
			return [nav, content];
		}
	},

	indexOf: function(element) {
		if (element.match(this.options.tabSelector)) {
			return this.container.getElements(this.options.tabSelector).indexOf(element);
		} else if (element.match(this.options.contentSelector)) {
			return this.container.getElements(this.options.contentSelector).indexOf(element);
		} else {
			// element is neither nav nor content, return -1 per convention
			return -1;
		}
	},

	show: function(what) {
		if (typeOf(what) != 'number') {
			// turn the argument into its usable form: a number
			what = this.indexOf(what);
		}

		// if only JavaScript had tuple unpacking...
		var items = this.get(what);
		var nav = items[0];
		var content = items[1];

		if (nav) {
			this.container.getElements(this.options.tabSelector).removeClass(this.options.activeClass);
			this.container.getElements(this.options.contentSelector).setStyle('display', 'none');

			if (!(this.options.alwaysHide===true && this.nowIndex==what)) {
				nav.addClass(this.options.activeClass);
				content.setStyle('display', 'block');
				this.fireEvent('change', what);

				this.nowIndex = what;
			}else{
				this.nowIndex = null;
			}
		}
		// no else, not clear what to do
	},

	add: function(nav, content, location, showNow) {
		if (typeOf(location) == 'number') {
			var before = this.get(location);
			nav.inject(before[0], 'before');
			content.inject(before[1], 'before');
		} else {
			nav.inject(this.container.getElements(this.options.tabSelector).getLast(), 'after');
			content.setStyle('display', 'none');
			content.inject(this.container.getElements(this.options.contentSelector).getLast(), 'after');
		}

		this.fireEvent('add', this.indexOf(nav));

		if (showNow) {
			this.show(nav);
		}
	},

	close: function(what) {
		if (typeOf(what) != 'number') {
			what = this.indexOf(what);
		}

		var items = this.get(what);
		var nav = items[0];
		var content = items[1];

		if (nav) {
			var tabs = this.container.getElements(this.options.tabSelector);
			var selected = tabs.indexOf(this.container.getElement('.' + this.options.activeClass)); // will always be equal to index if the closing element matches tabSelector

			nav.destroy();
			content.destroy();
			this.fireEvent('close', what);

			this.show(selected.limit(0, tabs.length - 2)); // a nav was removed, length is 1 less now
		}
	}

});

})();
