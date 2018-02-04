
/************************************************
 * 3D Cylinder Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015   *
 ************************************************/

var DIAMETER = 137.16,
	HEIGHT = 200,
	SIDES = 36,
	TEXTURE_X = 0,
	TEXTURE_Y = 0,
	EXPAND = 100,
	IMG_CIRCUM = '../images/cylinder/circum.png',
	IMG_TOP    = '../images/cylinder/top.png',
	IMG_BOTTOM = '../images/cylinder/bottom.png',
	BACKFACE_C = '../images/cylinder/bfc.png',
	BACKFACE_T = '../images/cylinder/bftb.png',
	BACKFACE_B = '../images/cylinder/bftb.png',
	NAME = 'cylinder',
	WRAP = NAME + '-wrapper',
	_cssRules = '',
	_sideW,
	_coverW,
	_coverH,
	_expandOption = document.getElementById('expand-sides'),
	_unpackOption = document.getElementById('unpack'),
	_resetOption = document.getElementById('reset-position'),
	_animate = document.getElementById('toggle-animation'),
	_model,
	_isPaused = false,
	_isManual = false,
	_dragging = false,
	_isFiredByMouse = false,
	_touchId,
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
	_productToRadians = 2 * Math.PI / Math.max(HEIGHT + HEIGHT + _coverW + _coverW, HEIGHT + HEIGHT + _coverH + _coverH, _sideW * SIDES);
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

function createFace(w, h, r, tts, ttx, tty, bfs, bfx, bfy, cname, isSide) {
	var face = document.createElement("div"),
		css, tx, ty, tz,
		cssText =
			'width: ' + w.toFixed(2) + 'px;' +
			'height: ' + h.toFixed(2) + 'px;' +
			'margin-left: ' + (-w / 2).toFixed(2) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(2) + 'px;',
		front = createSide(w, h, tts, ttx, tty, 'frontface');
	if (isSide) {
		tz = DIAMETER / 2;
		css = 'transform: rotateY(' + r.toFixed(2) + 'rad) translateZ(';
	}
	else {
		ty = Math.sign(r) * DIAMETER / 2;
		tz = (HEIGHT + h) / 2;
		css = 'transform: rotateX(' + r.toFixed(2) + 'rad) translate3d(0px, ' + ty.toFixed(2) + 'px, ';
	}
	cssText += addVendorPrefix(css + tz.toFixed(2) + 'px);');
	css += (tz + EXPAND).toFixed(2) + 'px) !important;';
	_cssRules += '.expand-sides .' + cname + ' {' + addVendorPrefix(css) + '}';
	if (isSide) {
		tx = r / 2 / Math.PI * (w - 1) * SIDES;
		css = 'transform: translate3d(' + tx.toFixed(2) + 'px, 0px, ' + tz.toFixed(2) + 'px) !important;';
	}
	else {
		ty = Math.sign(r) * -(HEIGHT + h) / 2;
		tz = DIAMETER / 2;
		css = 'transform: translate3d(0px, ' + ty.toFixed(2) + 'px, ' + tz.toFixed(2) + 'px) !important;';
	}
	_cssRules += '.unpack .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.reset-position .' + cname + '{' + addVendorPrefix(css) + '}';
	//addCssRule('.expand-sides .' + cname, cssRule);
	face.className = 'face';
	face.classList.add((isSide) ? 'circum' : 'cover');
	face.classList.add(cname);
	face.style.cssText = cssText;
	face.appendChild(createSide(w, h, bfs, bfx, bfy, 'backface'));
	//front.innerHTML = cname;
	face.appendChild(front);
	return face;
}

function createModel() {
	var wrap = document.createElement("div"),
		model = document.createElement("div"),
		baseAngle = Math.PI / SIDES,
		sideAngle = 2 * baseAngle,
		outerDia,
		halfS = (SIDES - SIDES % 2) / 2,
		style = document.createElement('style');
	wrap.className = WRAP;
	model.className = NAME;
	_sideW = DIAMETER * Math.tan(baseAngle);
	_coverW = DIAMETER;
	_coverH = DIAMETER;
	if (SIDES % 4) {
		outerDia = DIAMETER / Math.cos(baseAngle);
		if (SIDES % 2) {
			_coverW = outerDia * Math.sin(Math.PI * (SIDES - 1) / 2 / SIDES);
			_coverH = (outerDia + DIAMETER) / 2;
		}
		else
			_coverW = outerDia;
	}
	model.appendChild(createFace(_coverW, _coverH, -Math.PI / 2, IMG_BOTTOM, 0, 0, BACKFACE_B, 0, 0, 'bottom', false));
	model.appendChild(createFace(_coverW, _coverH, Math.PI / 2, IMG_TOP, 0, 0, BACKFACE_T, 0, 0, 'top', false));
	var ix, iy;
	for (var c = 0; c < SIDES; c++) {
		ix = -TEXTURE_X - c * _sideW;
		var iy = TEXTURE_Y;
		model.appendChild(createFace(_sideW + 1, HEIGHT, sideAngle * (c - halfS), IMG_CIRCUM, ix, iy, BACKFACE_C, ix, iy, 'circum-' + c.toString(), true));
	}
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

function transitionEndHandler() {
	this.classList.remove('intermediate-state');
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
		IMG_CIRCUM + ' : ' + (_sideW * SIDES).toFixed(2) + ' x ' + HEIGHT + '\n' +
		IMG_TOP + ' : ' + _coverW.toFixed(2) + ' x ' + _coverH.toFixed(2) + '\n' +
		IMG_BOTTOM + ' : ' + _coverW.toFixed(2) + ' x ' + _coverH.toFixed(2)
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
