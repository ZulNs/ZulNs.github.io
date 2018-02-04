
/************************************************************
 * Pure CSS3 Dynamic Cuboid Animation With Background Image *
 * Design by ZulNs @Yogyakarta, December 2015               *
 ************************************************************/

var WIDTH = 120,
	HEIGHT = 160,
	LENGTH = 120,
	EXPAND = 100,
	IMG_FRONT = '../images/cuboid/front.jpg',
	IMG_BACK = '../images/cuboid/back.jpg',
	IMG_LEFT = '../images/cuboid/left.jpg',
	IMG_RIGHT = '../images/cuboid/right.jpg',
	IMG_TOP = '../images/cuboid/top.jpg',
	IMG_BOTTOM = '../images/cuboid/bottom.jpg',
	BACKFACE_FB = '../images/cuboid/bffblr.jpg',
	BACKFACE_LR = '../images/cuboid/bffblr.jpg',
	BACKFACE_TB = '../images/cuboid/bftb.jpg',
	NAME = 'cuboid',
	WRAP = NAME + '-wrapper',
	_cssRules = '',
	_expandOption = document.getElementById('expand-sides'),
	_unpackOption = document.getElementById('unpack'),
	_resetOption = document.getElementById('reset-position'),
	_animate = document.getElementById('toggle-animation'),
	_model,
	_isPaused = false,
	_isManual = false,
	_dragging = false,
	_lastTransform, _matrix, _spx, _spy,
	_productToRadians;

init();

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html?3';
	document.body.appendChild(createModel());
	_model = document.querySelector('.' + NAME);
	document.getElementById('show-geometry').checked = false;
	_expandOption.checked = false;
	_unpackOption.checked = false;
	_resetOption.checked = false;
	_model.setAttribute('draggable', 'false');
	//_model.addEventListener(whichTransitionEvent(), transitionEndHandler);
	_model.classList.add('animate');
	var wh = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT),
		lh = Math.sqrt(LENGTH * LENGTH + HEIGHT * HEIGHT),
		wl = Math.sqrt(WIDTH * WIDTH + LENGTH * LENGTH);
	_productToRadians = 2 * Math.PI / Math.max(wh + wh + LENGTH + LENGTH, lh + lh + WIDTH + WIDTH, wl + wl + HEIGHT + HEIGHT);
	addEvent(_model, 'mousedown', handleMouseDown);
	addEvent(_model, 'mousemove', handleMouseMove);
	addEvent(document, 'mouseup', handleMouseUp);
	if ('touchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
		addEvent(_model, 'touchstart', handleTouchStart);
		addEvent(_model, 'touchmove', handleTouchMove);
		addEvent(document, 'touchcancel', handleTouchEnd);
		addEvent(document, 'touchend', handleTouchEnd);
	}
}

function addEvent(elm, evt, callback) {
	if (!!window.addEventListener)
		elm.addEventListener(evt, callback);
	else
		elm.attachEvent('on' + evt, callback);
}

function handleMouseDown(evt) {
	if (!_dragging) {
		var e = evt || window.event;
		e.preventDefault();
		e.stopPropagation();
		_isFiredByMouse = true;
		startDragging(e.pageX, e.pageY);
	}
}

function handleMouseMove(evt) {
	if (_dragging && _isFiredByMouse) {
		var e = evt || window.event;
		e.preventDefault();
		whileDragging(e.pageX, e.pageY);
	}
}

function handleMouseUp(evt) {
	if (_dragging && _isFiredByMouse) {
		var e = evt || window.event;
		e.preventDefault();
		endDragging();
	}
}

function handleTouchStart(evt) {
	var e = evt || window.event;
	if (_dragging && !_isFiredByMouse && e.touches.length == 1) endDragging();
	if (!_dragging) {
		var touch = e.changedTouches[0];
		e.preventDefault();
		//e.stopPropagation();
		_isFiredByMouse = false;
		_touchId = touch.identifier;
		startDragging(touch.pageX, touch.pageY);
	}
}

function handleTouchMove(evt) {
	if (_dragging && !_isFiredByMouse) {
		var e = evt || window.event,
			touches = e.changedTouches,
			touch;
		for (var i = 0; i < touches.length; i++) {
			touch = touches[i];
			if (touch.identifier === _touchId) {
				e.preventDefault();
				whileDragging(touch.pageX, touch.pageY);
				break;
			}
		}
	}
}

function handleTouchEnd(evt) {
	if (_dragging && !_isFiredByMouse) {
		var e = evt || window.event,
			touches = e.changedTouches,
			touch;
		for (var i = 0; i < touches.length; i++) {
			touch = touches[i];
			if (touch.identifier === _touchId) {
				e.preventDefault();
				endDragging();
				return;
			}
		}
	}
}

function startDragging(spx, spy) {
	_spx = spx;
	_spy = spy;
	_dragging = true;
	if (!_isPaused) toggleAnimation();
	if (!_isManual) {
		_lastTransform = window.getComputedStyle(_model).getPropertyValue('transform');
		_matrix = toArray(_lastTransform);
		_model.classList.remove('animate');
		_model.classList.remove('paused');
		_model.style.cssText = addVendorPrefix('transform: ' + _lastTransform + ';');
		_isManual = true;
		_animate.innerHTML = 'Animate';
	}
}

function whileDragging(cpx, cpy) {
	var sx, sy, x = 0, y = 0, z = 0, cr = 0.5, rad, css;
	if (_spx != cpx || _spy != cpy) {
		sx = (_spy - cpy);
		sy = (cpx - _spx);
		rad = Math.sqrt(sx * sx + sy * sy) * _productToRadians;
		x = sx * _matrix[0] + sy * _matrix[1];
		y = sx * _matrix[4] + sy * _matrix[5];
		z = sx * _matrix[8] + sy * _matrix[9];
		css = 'transform: ' + _lastTransform + ' rotate3d(' + x + ', ' + y + ', ' + z + ', ' + rad + 'rad);';
		_model.style.cssText = addVendorPrefix(css);
	}
}

function endDragging() {
	_dragging = false;
	_lastTransform = window.getComputedStyle(_model).getPropertyValue('transform');
	_matrix = toArray(_lastTransform);
}

function createSide(w, h, bg, bx, by, cname) {
	var side = document.createElement("div"),
		cssText =
			'width: ' + w.toFixed(2) + 'px;' +
			'height: ' + h.toFixed(2) + 'px;' +
			'line-height: ' + h.toFixed(2) + 'px;' +
			'background: url("' + bg + '") ' + bx.toFixed(2) + 'px ' + by.toFixed(2) + 'px;';
	side.className = cname;
	side.style.cssText = cssText;
	return side;
}

function createFace(w, h, tx, ty, tz, rx, ry, ux, uy, img, ix, iy, bf, bfx, bfy, cname, origin) {
	var face = document.createElement("div"),
		css,
		cssText =
			'width: ' + w + 'px;' +
			'height: ' + h + 'px;' +
			'margin-left: ' + (-w / 2).toFixed(2) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(2) + 'px;' +
			addVendorPrefix('transform-origin: ' + origin + ';'),
		front = createSide(w, h, img, ix, iy, 'frontface');
	css = 'transform: translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
	cssText += addVendorPrefix(css + ';');
	css += ' translateZ(' + EXPAND + 'px) !important;'
	_cssRules += '.expand-sides .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translate3d(' + ux + 'px, ' + uy + 'px, ' + (LENGTH / 2) + 'px) !important;';
	_cssRules += '.unpack .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.reset-position .' + cname + ' {' + addVendorPrefix(css) + '}';
	//addCssRule('.expand-sides .' + cname, cssRule);
	face.className = 'face';
	face.classList.add(cname);
	face.style.cssText = cssText;
	face.appendChild(createSide(w, h, bf, bfx, bfy, 'backface'));
	front.innerHTML = cname;
	face.appendChild(front);
	return face;
}

function createModel() {
	var wrap = document.createElement("div"),
		model = document.createElement("div"),
		style = document.createElement('style');
	wrap.className = WRAP;
	model.className = NAME;
	model.appendChild(createFace(WIDTH, HEIGHT, -WIDTH, 0, -LENGTH / 2, 0, -179.99, -WIDTH - LENGTH, 0, IMG_BACK, 0, 0, BACKFACE_FB, 0, 0, 'back', 'right'));
	model.appendChild(createFace(WIDTH, LENGTH, 0, (HEIGHT + LENGTH) / 2, LENGTH / 2, -90, 0, 0, (HEIGHT + LENGTH) / 2, IMG_BOTTOM, 0, 0, BACKFACE_TB, 0, 0, 'bottom', 'top'));
	model.appendChild(createFace(WIDTH, LENGTH, 0, (-HEIGHT - LENGTH) / 2, LENGTH / 2, 90, 0, 0, -(HEIGHT + LENGTH) / 2, IMG_TOP, 0, 0, BACKFACE_TB, 0, 0, 'top', 'bottom'));
	model.appendChild(createFace(LENGTH, HEIGHT, -(WIDTH + LENGTH) / 2, 0, LENGTH / 2, 0, -90, -(WIDTH + LENGTH) / 2, 0, IMG_LEFT, 0, 0, BACKFACE_LR, 0, 0, 'left', 'right'));
	model.appendChild(createFace(LENGTH, HEIGHT, (WIDTH + LENGTH) / 2, 0, LENGTH / 2, 0, 90, (WIDTH + LENGTH) / 2, 0, IMG_RIGHT, 0, 0, BACKFACE_LR, 0, 0, 'right', 'left'));
	model.appendChild(createFace(WIDTH, HEIGHT, 0, 0, LENGTH / 2, 0, 0, 0, 0, IMG_FRONT, 0, 0, BACKFACE_FB, 0, 0, 'front', 'center'));
	wrap.appendChild(model);
	style.type = 'text/css';
	if (style.styleSheet)
		style.styleSheet.cssText = _cssRules;
	else
		style.innerHTML = _cssRules;
	document.head.appendChild(style);
	return wrap;
}

function addVendorPrefix(property) {
	return	'-webkit-' + property +
			'-moz-' + property +
			'-o-' + property +
			property;
}

function addCssRule(/* string */ selector, /* string */ rule) {
	if (document.styleSheets) {
		if (! document.styleSheets.length) {
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(document.createElement('style'));
		}
		var i = document.styleSheets.length - 1,
			ss = document.styleSheets[i],
			l = 0;
		if (ss.cssRules)
			l = ss.cssRules.length;
		else if (ss.rules) // IE
			l = ss.rules.length;
		if (ss.insertRule)
			ss.insertRule(selector + ' {' + rule + '}', l);
		else if (ss.addRule) // IE
			ss.addRule(selector, rule, l);
	}
}

function whichTransitionEvent() {
	var a,
		el = document.createElement('div'),
		transitions = {
			'transition': 'transitionend',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd'
		};
	for (a in transitions) {
		if (el.style[a] !== undefined) return transitions[a];
	}
	return null;
}

function whichAnimationEvent() {
	var a,
		el = document.createElement('div'),
		animations = {
			'animation': 'animationend',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd'
		};
	for (a in animations) {
		if (el.style[a] !== undefined) return animations[a];
	}
	return null;
}

function showGeometry(elm) {
	if (elm.checked)
		_model.classList.add('show-geometry');
	else
		_model.classList.remove('show-geometry');
}

function expandSides(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('expand-sides');
	}
	else {
		//_model.classList.add('intermediate-state');
		_model.classList.remove('expand-sides');
	}
}

function unpack(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack');
	}
	else {
		//_model.classList.add('intermediate-state');
		_model.classList.remove('unpack');
	}
}

function resetPosition(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('reset-position');
	}
	else {
		//_model.classList.add('intermediate-state');
		_model.classList.remove('reset-position');
	}
}

function removeOptions(elm) {
	if (elm != _expandOption) {
		_expandOption.checked = false;
		_model.classList.remove('expand-sides');
	}
	if (elm != _unpackOption) {
		_unpackOption.checked = false;
		_model.classList.remove('unpack');
	}
	if (elm != _resetOption) {
		_resetOption.checked = false;
		_model.classList.remove('reset-position');
	}
}

function showImageInfo() {
	alert(
		'IMAGES : WIDTH x HEIGHT px\n\n' +
		IMG_FRONT + ' : ' + WIDTH + ' x ' + HEIGHT + '\n' +
		IMG_BACK + ' : ' + WIDTH + ' x ' + HEIGHT + '\n' +
		IMG_LEFT + ' : ' + LENGTH + ' x ' + HEIGHT + '\n' +
		IMG_RIGHT + ' : ' + LENGTH + ' x ' + HEIGHT + '\n' +
		IMG_BOTTOM + ' : ' + WIDTH + ' x ' + LENGTH + '\n' +
		IMG_BOTTOM + ' : ' + WIDTH + ' x ' + LENGTH
	);
}

function toggleAnimation() {
	if (_isManual) {
		_model.style.cssText = '';
		_model.classList.add('animate');
		_isManual = false;
		_dragging = false;
		_animate.innerHTML = 'Pause Animation';
	}
	else {
		if (_isPaused) {
			_model.classList.remove('paused');
			_animate.innerHTML = 'Pause Animation';
		}
		else {
			_model.classList.add('paused');
			_animate.innerHTML = 'Continue Animation';
		}
	}
	_isPaused ^= true;
}

function toArray(str) {
	var res = [], arr = str.substring(9, str.length -1).split(',');
	for (var i in arr) res.push(parseFloat(arr[i]));
	return res;
}
