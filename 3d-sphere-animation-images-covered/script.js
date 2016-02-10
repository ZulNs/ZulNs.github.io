
/**********************************************
 * 3D Sphere Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015 *
 **********************************************/

var DIAMETER = 200,
	CELLS_PER_CIRCLE = 26,
	EXPAND = 150,
	IMG_CELL = '../images/sphere/merlin.png',
	NAME = 'sphere',
	WRAP = NAME + '-wrapper',
	_cssRules = '',
	_cellW,
	_cellAmount = 0,
	_imgW,
	_imgH,
	_expandOption = document.getElementById('expand-sides'),
	_unpack1Option = document.getElementById('unpack-1'),
	_unpack2Option = document.getElementById('unpack-2'),
	_unpack3Option = document.getElementById('unpack-3'),
	_unpack4Option = document.getElementById('unpack-4'),
	_unpack5Option = document.getElementById('unpack-5'),
	_unpack6Option = document.getElementById('unpack-6'),
	_unpack7Option = document.getElementById('unpack-7'),
	_unpack8Option = document.getElementById('unpack-8'),
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
	_unpack1Option.checked = false;
	_unpack2Option.checked = false;
	_unpack3Option.checked = false;
	_unpack4Option.checked = false;
	_unpack5Option.checked = false;
	_unpack6Option.checked = false;
	_unpack7Option.checked = false;
	_unpack8Option.checked = false;
	_resetOption.checked = false;
	_model.setAttribute('draggable', 'false');
	_model.addEventListener(whichTransitionEvent(), transitionEndHandler);
	_model.classList.add('animate');
	_productToRadians = 2 * Math.PI / _imgW;
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

function createFace(w, h, rx, ry, tz, ts, tsx, tsy, cname) {
	var face = document.createElement("div"),
		css, tl, tx, ty, tz2, css1, css2, rx2,
		cssText =
			'width: ' + w.toFixed(2) + 'px;' +
			'height: ' + h.toFixed(2) + 'px;' +
			'line-height: ' + h.toFixed(2) + 'px;' +
			'margin-left: ' + (-w / 2).toFixed(2) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(2) + 'px;' +
			'background: url("' + ts + '") ' + tsx.toFixed(2) + 'px ' + tsy.toFixed(2) + 'px;';
	css = 'transform: rotateY(' + ry.toFixed(2) + 'rad) rotateX(' + rx.toFixed(2) + 'rad) translateZ(';
	cssText += addVendorPrefix(css + tz.toFixed(2) + 'px);');
	css += (tz + EXPAND).toFixed(2) + 'px) !important;';
	_cssRules += '.expand-sides .' + cname + ' {' + addVendorPrefix(css) + '}';
	tl = w * CELLS_PER_CIRCLE;
	if (Math.abs(rx) == Math.PI / 2) tl = w;
	tx = ry / 2 / Math.PI * tl - tl / 2;
	tl = h * CELLS_PER_CIRCLE;
	ty = -rx / 2 / Math.PI * tl;
	css = 'transform: translate3d(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px, 0px) !important;';
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tz2 = Math.cos(rx) * tz;
	css1 = 'transform: rotateY(' + ry.toFixed(2) + 'rad) translate3d(0px, ';
	css2 = 'px, ' + tz2.toFixed(2) + 'px) !important;';
	ty = -rx * 150;
	css = css1 + ty.toFixed(2) + css2;
	_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * -2 * h;
	css = css1 + ty.toFixed(2) + css2;
	_cssRules += '.unpack-3 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * (Math.PI / 2 - Math.abs(rx)) * -150;
	css = css1 + ty.toFixed(2) + css2;
	_cssRules += '.unpack-4 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * -80;
	css = 'transform: rotateY(' + ry.toFixed(2) + 'rad) translateY(' + ty.toFixed(2) + 'px) rotateX(' + rx.toFixed(2) + 'rad) translateZ(' + tz.toFixed(2) + 'px) !important;';
	_cssRules += '.unpack-5 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tx = (ry < Math.PI) ? 80 : -80;
	css = 'transform: translateX(' + tx.toFixed(2) + 'px) rotateY(' + ry.toFixed(2) + 'rad) rotateX(' + rx.toFixed(2) + 'rad) translateZ(' + tz.toFixed(2) + 'px) !important;';
	_cssRules += '.unpack-6 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tz2 = (ry < Math.PI / 2 || ry > Math.PI * 1.5) ? 80 : -80;
	css = 'transform: translate3d(' + tx.toFixed(2) + 'px, 0px, ' + tz2.toFixed(2) + 'px) rotateY(' + ry.toFixed(2) + 'rad) rotateX('
			+ rx.toFixed(2) + 'rad) translateZ(' + tz.toFixed(2) + 'px) !important;';
	_cssRules += '.unpack-7 .' + cname + ' {' + addVendorPrefix(css) + '}';
	rx2 = Math.sign(rx) * Math.PI / 2 - rx;
	css = 'transform: rotateY(' + ry.toFixed(2) + 'rad) rotateX(' + rx.toFixed(2) + 'rad) translateZ(' + tz.toFixed(2) + 'px) rotateX(' + rx2.toFixed(2) + 'rad) !important;';
	_cssRules += '.unpack-8 .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.reset-position .' + cname + '{' + addVendorPrefix(css) + '}';
	//addCssRule('.expand-sides .' + cname, cssRule);
	face.className = cname;
	face.style.cssText = cssText;
	//face.innerHTML = cname;
	return face;
}

function createModel() {
	var wrap = document.createElement("div"),
		model = document.createElement("div"),
		baseAngle = Math.PI / CELLS_PER_CIRCLE,
		cellAngle = 2 * baseAngle,
		xc = Math.ceil(CELLS_PER_CIRCLE / -4),
		yc, rx, ry, tx, tw, cang, cdia, cw,
		style = document.createElement('style');
	wrap.className = WRAP;
	model.className = NAME;
	if (CELLS_PER_CIRCLE % 2 != 0) CELLS_PER_CIRCLE++;
	if (CELLS_PER_CIRCLE < 4) CELLS_PER_CIRCLE = 4;
	_cellW = DIAMETER * Math.tan(baseAngle);
	_imgW = _cellW * CELLS_PER_CIRCLE;
	_imgH = CELLS_PER_CIRCLE / 2;
	if (CELLS_PER_CIRCLE % 4 == 0) _imgH++;
	_imgH *= _cellW;
	var ty = -_imgH;
	for (var x = xc; x <= -xc; x++) {
		rx = x * cellAngle;
		cw = _cellW;
		yc = CELLS_PER_CIRCLE;
		if (Math.abs(rx) == Math.PI / 2)
			yc = 1;
		else if (Math.abs(x) != 1) {
			cang = rx - Math.sign(x) * baseAngle;
			cdia = DIAMETER * Math.cos(cang);
			cw = cdia * Math.tan(baseAngle);
		}
		_cellAmount += yc;
		tw = cw * yc;
		tx = (tw - _imgW) / 2;
		ty += _cellW;
		for (var y = 0; y < yc; y++) {
			ry = y * cellAngle;
			model.appendChild(createFace(cw + 1, _cellW + 1, rx, ry, DIAMETER / 2, IMG_CELL, tx, ty, 'cell' + x.toString() + y.toString()));
			tx -= cw;
		}
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
		_model.classList.add('intermediate-state');
		_model.classList.remove('expand-sides');
	}
}

function unpack1(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-1');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-1');
	}
}

function unpack2(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-2');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-2');
	}
}

function unpack3(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-3');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-3');
	}
}

function unpack4(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-4');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-4');
	}
}

function unpack5(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-5');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-5');
	}
}

function unpack6(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-6');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-6');
	}
}

function unpack7(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-7');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-7');
	}
}

function unpack8(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('unpack-8');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('unpack-8');
	}
}

function resetPosition(elm) {
	if (elm.checked) {
		removeOptions(elm);
		_model.classList.add('reset-position');
	}
	else {
		_model.classList.add('intermediate-state');
		_model.classList.remove('reset-position');
	}
}

function removeOptions(elm) {
	if (elm != _expandOption) {
		_expandOption.checked = false;
		_model.classList.remove('expand-sides');
	}
	if (elm != _unpack1Option) {
		_unpack1Option.checked = false;
		_model.classList.remove('unpack-1');
	}
	if (elm != _unpack2Option) {
		_unpack2Option.checked = false;
		_model.classList.remove('unpack-2');
	}
	if (elm != _unpack3Option) {
		_unpack3Option.checked = false;
		_model.classList.remove('unpack-3');
	}
	if (elm != _unpack4Option) {
		_unpack4Option.checked = false;
		_model.classList.remove('unpack-4');
	}
	if (elm != _unpack5Option) {
		_unpack5Option.checked = false;
		_model.classList.remove('unpack-5');
	}
	if (elm != _unpack6Option) {
		_unpack6Option.checked = false;
		_model.classList.remove('unpack-6');
	}
	if (elm != _unpack7Option) {
		_unpack7Option.checked = false;
		_model.classList.remove('unpack-7');
	}
	if (elm != _unpack8Option) {
		_unpack8Option.checked = false;
		_model.classList.remove('unpack-8');
	}
	if (elm != _resetOption) {
		_resetOption.checked = false;
		_model.classList.remove('reset-position');
	}
}

function showImageInfo() {
	alert(
		'Source image: ' + IMG_CELL + '\n' +
		'Image size: ' + _imgW.toFixed(2) + ' x ' + _imgH.toFixed(2) + '\n' +
		'Biggest cell size: ' + _cellW.toFixed(2) + ' x ' + _cellW.toFixed(2) + '\n' +
		'Number of cell image: ' + _cellAmount
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
