/*
 * Pure JavaScript for Keyboard Navigable Multi Level Menu
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 9 May 2017
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
	
	_returnTrueEvent = function(evt) {
		evt.returnValue = true;
		return true;
	},
	
	_onMouseEnterMenu = function(evt) {
		evt = evt || window.event;
		var elms = evt.target.parentElement.children;
		for (var i = 0; i < elms.length; i++)
			if (elms[i] !== evt.target && elms[i].children.length > 1)
				_hideDescentMenus(elms[i], true);
		elms = evt.target.children;
		if (elms.length > 1)
			elms[1].classList.add('show');
		return _returnEvent(evt);
	},
	
	_onMouseLeaveMenu = function(evt) {
		evt = evt || window.event;
		_hideDescentMenus(evt.target, true);
		return _returnEvent(evt);
	},
	
	_onFocusMenu = function(evt) {
		evt = evt || window.event;
		var elm = evt.target.parentElement,
			elms = elm.parentElement.children;
		for (var i = 0; i < elms.length; i++)
			if (elms[i] !== elm && elms[i].children.length > 1)
				_hideDescentMenus(elms[i]);
		elm = elm.parentElement.parentElement;
		if (elm.tagName.toLowerCase() == 'li')
			elm.classList.add('hover');
		return _returnEvent(evt);
	},
	
	_onClickMenu = function(evt) {
		evt = evt || window.event;
		var target = evt.target,
			elm;
		if (target.tagName.toLowerCase() == 'span')
			target = target.parentElement;
		var id = target.href.replace(/.*(?=#)#/, '');
		if (target.parentElement.children.length == 1) {
			// removes all 'current' class
			elm = document.querySelectorAll('.menu-wrap .current');
			for (var i = 0; i < elm.length; i++)
				elm[i].classList.remove('current');
			// adds 'current' class
			elm = target.parentElement;
			while (!elm.parentElement.classList.contains('root')) {
				elm.classList.add('current');
				elm = elm.parentElement.parentElement;
			}
			elm.classList.add('current');
			// hides all sub menu
			_hideDescentMenus(elm, true);
			// shows selected content
			document.querySelector('.contents .show').classList.remove('show');
			document.getElementById(id).classList.add('show');
			// set focus to root menu
			document.querySelector('.menu-wrap>nav>ul>.current>a').focus();
		}
		else {
			var elm = target.parentElement.children[1].classList;
			if (elm.contains('show'))
				elm.remove('show');
			else
				elm.add('show');
		}
		return _returnEvent(evt);
	},
	
	_hideDescentMenus = function(menu, setFocus) {
		setFocus = !!setFocus;
		var menus = menu.querySelectorAll('.show'),
			i;
		for (i = 0; i < menus.length; i++)
			menus[i].classList.remove('show');
		menus = menu.querySelectorAll('.hover');
		for (i = 0; i < menus.length; i++)
			menus[i].classList.remove('hover');
		menu.classList.remove('hover');
		if (setFocus && _isChild(document.activeElement, menu))
			menu.children[0].focus();
	},
	
	_nextMenu = function(menu) {
		var menus = menu.parentElement.children,
			idx = _indexOf(menu, menus);
		if (idx < menus.length - 1)
			menus[idx + 1].children[0].focus();
	},
	
	_previousMenu = function(menu) {
		var menus = menu.parentElement.children,
			idx = _indexOf(menu, menus);
		if (idx > 0)
			menus[idx - 1].children[0].focus();
	},
	
	_expandMenu = function(menu) {
		var menus = menu.children;
		if (menus.length > 1) {
			if (menus[1].classList.contains('show'))
				menus[1].children[0].children[0].focus();
			else
				menus[1].classList.add('show');
		}
	},
	
	_collapseMenu = function(menu) {
		var menus = menu.children;
		if (menus.length > 1 && menus[1].classList.contains('show')) {
			_hideDescentMenus(menu, true);
			return;
		}
		menu = menu.parentElement.parentElement;
		if (menu.tagName.toLowerCase() == 'li')
			menu.children[0].focus();
	},
	
	_indexOf = function(elm, elms) {
		for (var i = 0; i < elms.length; i++) {
			if (elm === elms[i])
				return i;
		}
		return undefined;
	},
	
	_isChild = function(chld, prnt) {
		if (chld) {
			while (chld.tagName.toLowerCase() != 'body') {
				chld = chld.parentElement;
				if (chld === prnt)
					return true;
			}
		}
		return false;
	},
	
	_init = function() {
		_addEvent(document.querySelector('.menu-wrap>nav>ul'), 'click', _onClickMenu);
		var elms = document.querySelectorAll('.menu-wrap>nav>ul li'),
			i;
		for (i = 0; i < elms.length; i++)
			_addEvent(elms[i], 'mouseenter', _onMouseEnterMenu);
		elms = document.querySelectorAll('.menu-wrap>nav>ul ul');
		for (i = 0; i < elms.length; i++)
			_addEvent(elms[i].parentElement, 'mouseleave', _onMouseLeaveMenu);
		elms = document.querySelectorAll('.menu-wrap a');
		for (i = 0; i < elms.length; i++)
			_addEvent(elms[i], 'focus', _onFocusMenu);
		document.querySelector('.menu-wrap>nav>ul>.current').children[0].focus();
	};

window.document.onkeydown = function(evt) {
	evt = evt || window.event;
	var key = evt.which || evt.keyCode,
		menu = document.activeElement,
		isMenu = _isChild(menu, document.querySelector('.menu-wrap .root'));
	if (!isMenu)
		return _returnTrueEvent(evt);
	menu = menu.parentElement;
	switch (key) {
	case 27: // Esc key
		_collapseMenu(menu);
		break;
	// keyboard navigation keys
	case 37:
	case 38:
	case 39:
	case 40:
		var elm = menu.parentElement;
		var isRoot = elm.classList.contains('root'),
			isLevel1 = elm.classList.contains('level-1'), 
			isFirst = _indexOf(menu, elm.children) == 0,
			isLast = _indexOf(menu, elm.children) == elm.children.length - 1,
			isParent = menu.children.length > 1,
			isExpanded = isParent && menu.children[1].classList.contains('show');
		switch (key) {
		case 37: // Left key
			if (isRoot && !isFirst)
				_previousMenu(menu);
			else
				_collapseMenu(menu);
			break;
		case 38: // Up key
			if (isRoot && isExpanded || isFirst)
				_collapseMenu(menu);
			else
				_previousMenu(menu);
			break;
		case 39: // Right key
			if (!isLast && (isRoot || !isRoot && !isParent))
				_nextMenu(menu);
			else
				_expandMenu(menu);
			break;
		case 40: // Down key
			if (isLast || isRoot && isParent)
				_expandMenu(menu);
			else
				_nextMenu(menu);
		}
		break;
	default:
		return _returnTrueEvent(evt);
	}
	return _returnEvent(evt);
}

_init();
