
/************************************************
 * 3D Cylinder Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015   *
 ************************************************/

var DIAMETER = 137.16;
var HEIGHT = 200;
var SIDES = 36;
var TEXTURE_X = 0;
var TEXTURE_Y = 0;
var EXPAND = 100;
var IMG_CIRCUM = '../images/cylinder/circum.png';
var IMG_TOP    = '../images/cylinder/top.png';
var IMG_BOTTOM = '../images/cylinder/bottom.png';
var BACKFACE_C = '../images/cylinder/bfc.png';
var BACKFACE_T = '../images/cylinder/bftb.png';
var BACKFACE_B = '../images/cylinder/bftb.png';
var NAME = 'cylinder';
var WRAP = NAME + '-wrapper';
var _cssRules = '';
var _sideW;
var _coverW;
var _coverH;

function createSide(w, h, bg, bx, by, cname) {
	var side = document.createElement("div");
	var cssText =
		'width: ' + w.toFixed(2) + 'px;' +
		'height: ' + h.toFixed(2) + 'px;' +
		'line-height: ' + h.toFixed(2) + 'px;' +
		'background: url("' + bg + '") ' + bx.toFixed(2) + 'px ' + by.toFixed(2) + 'px;';
	side.className = cname;
	side.style.cssText = cssText;
	return side;
}

function createFace(w, h, r, tts, ttx, tty, bfs, bfx, bfy, cname, isSide) {
	var face = document.createElement("div");
	var css, tx, ty, tz;
	var cssText =
		'width: ' + w.toFixed(2) + 'px;' +
		'height: ' + h.toFixed(2) + 'px;' +
		'margin-left: ' + (-w / 2).toFixed(2) + 'px;' +
		'margin-top: ' + (-h / 2).toFixed(2) + 'px;'
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
	var front = createSide(w, h, tts, ttx, tty, 'frontface');
	//front.innerHTML = cname;
	face.appendChild(front);
	return face;
}

function createModel() {
	var wrap = document.createElement("div");
	var model = document.createElement("div");
	wrap.className = WRAP;
	model.className = NAME;
	var baseAngle = Math.PI / SIDES;
	var sideAngle = 2 * baseAngle;
	_sideW = DIAMETER * Math.tan(baseAngle);
	_coverW = DIAMETER;
	_coverH = DIAMETER;
	var outerDia;
	if (SIDES % 4) {
		outerDia = DIAMETER / Math.cos(baseAngle);
		if (SIDES % 2) {
			_coverW = outerDia * Math.sin(Math.PI * (SIDES - 1) / 2 / SIDES);
			_coverH = (outerDia + DIAMETER) / 2;
		}
		else
			_coverW = outerDia;
	}
	var halfS = (SIDES - SIDES % 2) / 2;
	model.appendChild(createFace(_coverW, _coverH, -Math.PI / 2, IMG_BOTTOM, 0, 0, BACKFACE_B, 0, 0, 'bottom', false));
	model.appendChild(createFace(_coverW, _coverH, Math.PI / 2, IMG_TOP, 0, 0, BACKFACE_T, 0, 0, 'top', false));
	var ix, iy;
	for (var c = 0; c < SIDES; c++) {
		ix = -TEXTURE_X - c * _sideW;
		var iy = TEXTURE_Y;
		model.appendChild(createFace(_sideW + 1, HEIGHT, sideAngle * (c - halfS), IMG_CIRCUM, ix, iy, BACKFACE_C, ix, iy, 'circum-' + c.toString(), true));
	}
	wrap.appendChild(model);
	var style = document.createElement('style');
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
		var i = document.styleSheets.length - 1;
		var ss = document.styleSheets[i];
		var l = 0;
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
}

function whichAnimationEvent() {
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
		_model.classList.remove('manual-transform');
		_model.style.cssText = '';
		_model.classList.add('animate');
		_isManual = false;
		_dragging = false;
		_animate.innerHTML = 'Pause Animation';
	}
	else {
		if (_isPaused) {
		_model.classList.remove('manual-transform');
			_model.classList.remove('paused');
			_animate.innerHTML = 'Pause Animation';
		}
		else {
			_model.classList.add('paused');
			_model.classList.add('manual-transform');
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

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html';
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
}

var _expandOption = document.getElementById('expand-sides');
var _unpackOption = document.getElementById('unpack');
var _resetOption = document.getElementById('reset-position');
var _animate = document.getElementById('toggle-animation');
var _model;
var _isPaused = false;
var _isManual = false;
var _dragging = false;
var _lastTransform, _matrix, _spx, _spy;
var _productToRadians;

init();

_model.addEventListener('mousedown', function(e) {
	e.preventDefault();
	e.stopPropagation();
	if (_isPaused) {
		_spx = e.pageX;
		_spy = e.pageY;
		_dragging = true;
		if (! _isManual) {
			_lastTransform = window.getComputedStyle(_model).getPropertyValue('transform');
			_matrix = toArray(_lastTransform);
			_model.classList.remove('animate');
			_model.classList.remove('paused');
			_model.style.cssText = addVendorPrefix('transform: ' + _lastTransform + ';');
			_isManual = true;
			_animate.innerHTML = 'Animate';
		}
	}
});

_model.addEventListener('mousemove', function(e) {
	if (_dragging) {
		var cpx = e.pageX, cpy = e.pageY, sx, sy, x = 0, y = 0, z = 0, cr = 0.5, rad, css;
		if (_spx != cpx || _spy != cpy) {
			sx = (_spy - cpy);
			sy = (cpx - _spx);
			rad = Math.sqrt(sx * sx + sy * sy) * _productToRadians;
			x = sx * _matrix[0] + sy * _matrix[1];
			y = sx * _matrix[4] + sy * _matrix[5];
			z = sx * _matrix[8] + sy * _matrix[9];
			css = 'transform: ' + _lastTransform + ' rotate3d(' + x.toFixed(2) + ', ' + y.toFixed(2) + ', ' + z.toFixed(2) + ', ' + rad.toFixed(2) + 'rad);';
			_model.style.cssText = addVendorPrefix(css);
		}
	}
});

document.addEventListener('mouseup', function(e) {
	if (_dragging) {
		_dragging = false;
		_lastTransform = window.getComputedStyle(_model).getPropertyValue('transform');
		_matrix = toArray(_lastTransform);
	}
});
