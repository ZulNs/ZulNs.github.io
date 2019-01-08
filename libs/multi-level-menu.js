/*
 * Pure JavaScript for CSS Multi Level Menu
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 3 May 2017
 */

var	_hasEventListeners = !!window.addEventListener,
	
	_addEvent = function(elm, evt, callback) {
		if (elm == null || typeof(elm) == undefined)
			return;
		if (_hasEventListeners)
			elm.addEventListener(evt, callback, false);
		else if (elm.attachEvent)
			elm.attachEvent('on' + evt, callback);
		else
			elm['on' + evt] = callback;
	},
	
	_returnEvent = function(evt) {
		if (evt.stopPropagation)
			evt.stopPropagation();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	},
	
	_onClickMenu = function(evt) {
		evt = evt || window.event;
		var target = evt.target;
		if (target.tagName.toLowerCase() == 'span')
			target = target.parentElement;
		if (target.parentElement.children.length == 1) {
			// removes all 'current' class
			var elm = document.querySelectorAll('.menu-wrap .current');
			for (var i = 0; i < elm.length; i++)
				elm[i].classList.remove('current');
			// adds 'current' class
			elm = target.parentElement;
			while (!elm.parentElement.classList.contains('root')) {
				elm.classList.add('current');
				elm = elm.parentElement.parentElement;
			}
			elm.classList.add('current');
			document.querySelector('.contents .show').classList.remove('show');
			document.getElementById(target.href.replace(/.*(?=#)#/, '')).classList.add('show');
			document.querySelector('.menu-wrap>nav>ul>.current>a').focus();
		}
		return _returnEvent(evt);
	},
	
	addCurrentItemClass = function(elm) {
		var prn = elm.parentElement;
		elm.classList.add('current-item');
		if (prn.className != 'clearfix')
			addCurrentItemClass(prn.parentElement);
	};

_addEvent(document.querySelector('.menu-wrap>nav>ul'), 'click', _onClickMenu);
