/*
 * Pure JavaScript for 3D Menu
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 11 May 2017
 */

var	_hasEventListeners = !!window.addEventListener,
	_cubeClass,
	_buttonClass,
	_animType = {
		expand: 0,
		collapse: 1,
		spinOut: 2,
		spinBack: 3
	},
	_animState,
	_animPaused = true,
	_animTo,
	
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
	
	_whichAnimationEvent = function() {
		var a;
		var el = document.createElement('div');
		var animations = {
			'animation': 'animationend',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd'
		}
		for (a in animations) {
			if (el.style[a] !== undefined) return animations[a];
		}
		return null;
	},
	
	_whichTransitionEvent = function() {
		var a;
		var el = document.createElement('div');
		var transitions = {
			'transition': 'transitionend',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd'
		}
		for (a in transitions) {
			if (el.style[a] !== undefined) return transitions[a];
		}
		return null;
	},
	
	_onAnimationEnd = function(evt) {
		evt = evt || window.event;
		switch (_animState) {
		case _animType.expand:
			_cubeClass.remove('anim-expand');
			_cubeClass.remove('collapse');
			_unshade('front');
			break;
		case _animType.collapse:
			_cubeClass.remove('anim-collapse');
			_cubeClass.add('collapse');
			_cubeClass.add('hide');
			_buttonClass.remove('hide');
			break;
		case _animType.spinBack:
			_cubeClass.remove(_cubeClass[2]);
			_cubeClass.remove(_cubeClass[1]);
			_unshade('front');
			break;
		case _animType.spinOut:
			var cls = _cubeClass[1];
			_cubeClass.remove(cls);
			_cubeClass.add(cls.substr(5));
			_unshade(_animTo);
		}
		_animPaused = true;
		return _returnEvent(evt);
	},
	
	_onClickMenu = function(evt) {
		evt = evt || window.event;
		if (evt.target.tagName.toLowerCase() == 'a' && _animPaused) {
			var target = evt.target.href.replace(/.*(?=#)#/, '');
			if (target == 'expand') {
				_buttonClass.add('hide');
				_cubeClass.remove('hide');
				_animState = _animType.expand;
				_animPaused = false;
				_cubeClass.add('anim-expand');
			}
			else if (target == 'close') {
				_animState = _animType.collapse;
				_animPaused = false;
				_shade();
				_cubeClass.add('anim-collapse');
			}
			else if (target == 'back') {
				_animState = _animType.spinBack;
				_animPaused = false;
				_shade();
				_cubeClass.add('anim-to-front');
			}
			else if (target.substr(0, 3) == 'to-') {
				_animState = _animType.spinOut;
				_animPaused = false;
				_animTo = target.substr(3);
				_shade();
				_cubeClass.add('anim-' + target);
			}
			else {
				document.querySelector('.contents .show').classList.remove('show');
				document.getElementById(target).classList.add('show');
			}
		}
		return _returnEvent(evt);
	},
	
	_shade = function() {
		document.querySelector('.menu-wrap .current').classList.remove('current');
	},
	
	_unshade = function(side) {
		document.querySelector('.menu-wrap .' + side).classList.add('current');
	},
	
	_init = function() {
		var menu = document.querySelector('.menu-wrap'),
			cube = menu.querySelector('.cube');
		_cubeClass = cube.classList;
		_buttonClass = menu.querySelector('.button').classList;
		_addEvent(menu, 'click', _onClickMenu);
		_addEvent(cube, _whichAnimationEvent(), _onAnimationEnd);
		_cubeClass.add('collapse');
		_cubeClass.add('hide');
	};

_init();
