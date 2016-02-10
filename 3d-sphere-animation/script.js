
/**********************************************
 * 3D Sphere Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015 *
 **********************************************/

var _diameter = 160,
	_cellsPerCircum = 22,
	_opacity = 0.75,
	_transitionInterval = 3000,
	_modelName = 'sphere',
	_cellAngle,
	_model,
	_cssRules = '',
	_isPaused = false,
	_isManual = false,
	_dragging = false,
	_isFiredByMouse = false,
	_touchId,
	_lastTransform, _matrix, _spx, _spy,
	_productToRadians,
	_isTransitionStopped = false,
	_transitionTimer,
	_currentTransition = 0,
	_animate = document.getElementById('toggle-animation'),
	_transist = document.getElementById('toggle-transition'),
	_diameterInput = document.getElementById('diameter-length'),
	_cellsPerCircumInput = document.getElementById('cells-per-circum'),
	_opacityInput = document.getElementById('opacity-value'),
	_intervalInput = document.getElementById('transition-interval');

init();

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html';
	_diameterInput.value = _diameter;
	_cellsPerCircumInput.value = _cellsPerCircum;
	_opacityInput.value = _opacity * 100;
	_intervalInput.value = _transitionInterval;
	for (var i = 1; i <= 10; i++)
		document.getElementById('unpack-' + i).checked = false;
	appendModel();
	_model.classList.add('animate');
	_transitionTimer = window.setInterval(nextTransition, _transitionInterval);
}

function appendModel() {
	var wrap = document.createElement("div");
	_model = document.createElement("div");
	wrap.classList.add(_modelName + '-wrapper');
	_model.classList.add(_modelName);
	createModel(_model, _diameter, _cellsPerCircum, _opacity);
	wrap.appendChild(_model);
	document.body.appendChild(wrap);
	_model.setAttribute('draggable', 'false');
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

function applyEntries() {
	var dl = getIntValue(_diameterInput.value),
		cpc = getIntValue(_cellsPerCircumInput.value),
		ov = getIntValue(_opacityInput.value),
		ti = getIntValue(_intervalInput.value);
	if (dl < 1) dl = 1;
	if (cpc % 2 != 0) cpc++;
	if (cpc < 4) cpc = 4;
	if (ov < 0) ov = 0;
	if (ov > 100) ov = 100;
	if (ti < 1000) ti = 1000;
	_diameterInput.value = dl;
	_cellsPerCircumInput.value = cpc;
	_opacityInput.value = ov;
	_intervalInput.value = ti;
	ov /= 100;
	if (dl != _diameter || cpc != _cellsPerCircum || ov != _opacity) {
		var nodes = document.querySelectorAll('.' + _modelName + ' svg');
		for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
		document.getElementById(_modelName + '-style').remove();
		_diameter = dl;
		_cellsPerCircum = cpc;
		_opacity = ov;
		createModel(_model, dl, cpc, ov);
	}
	if (ti != _transitionInterval) {
		_transitionInterval = ti;
		if (!_isTransitionStopped) {
			window.clearInterval(_transitionTimer);
			_transitionTimer = window.setInterval(nextTransition, _transitionInterval);
		}
	}
}

function getIntValue(value) {
	var iv = parseInt(value);
	if (isNaN(iv)) iv = 0;
	return iv;
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

function toggleTransition() {
	if (_isTransitionStopped) {
		_transist.innerHTML = 'Stop All Transitions';
		_transitionTimer = window.setInterval(nextTransition, _transitionInterval);
	}
	else {
		window.clearInterval(_transitionTimer);
		uncheckLastOption();
		_currentTransition = 0;
		_transist.innerHTML = 'Play All Transitions';
	}
	_isTransitionStopped ^= true;
}

function unpack(idNum) {
	if (document.getElementById('unpack-' + idNum).checked) {
		uncheckLastOption();
		_model.classList.add('unpack-' + idNum);
		_currentTransition = idNum;
	}
	else {
		_model.classList.remove('unpack-' + idNum);
		_currentTransition = 0;
	}
}

function uncheckLastOption() {
	if (_currentTransition) {
		document.getElementById('unpack-' + _currentTransition).checked = false;
		_model.classList.remove('unpack-' + _currentTransition);
	}
}

function nextTransition() {
	var t = ~~(Math.random() * 11);
	if (t == _currentTransition) t = ++t % 11;
	if (t) {
		document.getElementById('unpack-' + t).checked = true;
		unpack(t);
	}
	else {
		uncheckLastOption();
		_currentTransition = 0;
	}
}

function toArray(str) {
	var res = [], arr = str.substring(9, str.length -1).split(',');
	for (var i in arr) res.push(parseFloat(arr[i]));
	return res;
}

function addVendorPrefix(property) {
	return	'-webkit-' + property +
			'-moz-' + property +
			'-o-' + property +
			property;
}

function getRainbowColor(step, numOfSteps) {
	var h = (step % numOfSteps) / numOfSteps,
		i = ~~(h * 6),
		a = h * 6 - i,
		d = 1 - a;
	switch (i) {
		case 0: r = 1; g = a; b = 0; break;
		case 1: r = d; g = 1; b = 0; break;
		case 2: r = 0; g = 1; b = a; break;
		case 3: r = 0; g = d; b = 1; break;
		case 4: r = a; g = 0; b = 1; break;
		case 5: r = 1; g = 0; b = d; 
	}
	var c = '#' + ('0' + (~~(r * 255)).toString(16)).slice(-2) + ('0' + (~~(g * 255)).toString(16)).slice(-2) + ('0' + (~~(b * 255)).toString(16)).slice(-2);
	return c;
}

function createModel(model, diameter, cellsPerCircum, opacity) {
	var baseAngle = Math.PI / cellsPerCircum,
		cellAngle = 2 * baseAngle,
		cellW = diameter * Math.tan(baseAngle),
		xc = ~~(cellsPerCircum / 4),
		yc, rx, ry, dlen = 0, cw, cw2, color, name1, name2,
		style = document.createElement('style');
	_productToRadians = 2 * Math.PI / cellW / cellsPerCircum;
	for (var x = 0; x <= xc; x++) {
		rx = x * cellAngle;
		cw = (diameter - dlen - dlen) * Math.tan(baseAngle);
		dlen += cellW * Math.sin(rx);
		cw2 = (diameter - dlen - dlen) * Math.tan(baseAngle);
		if (Math.abs(rx) == Math.PI / 2) {
			yc = 1;
			cw2 = cw;
			cw = cellW;
		}
		else
			yc = cellsPerCircum;
		for (var y = 0; y < yc; y++) {
			ry = y * cellAngle;
			color = getRainbowColor(y, yc);
			name1 = 'cell-' + (x + xc).toString() + '-' + y;
			name2 = 'cell-' + x + '-' + y;
			if (x != 0)
				model.appendChild(createFace(cw, cellW, cw2, -rx, ry, diameter / 2, diameter, cellsPerCircum, cellW, cellAngle, color, opacity, name1));
			model.appendChild(createFace(cw, cellW, cw2, rx, ry, diameter / 2, diameter, cellsPerCircum, cellW, cellAngle, color, opacity, name2));
		}
	}
	style.type = 'text/css';
	style.id = _modelName + '-style';
	if (style.styleSheet)
		style.styleSheet.cssText = _cssRules;
	else
		style.innerHTML = _cssRules;
	_cssRules = '';
	document.head.appendChild(style);
}

function createFace(w, h, w2, rx, ry, tz, dia, cpc, cw, ca, color, opacity, cname) {
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		shape, points = '', css, tx, ty, tz2, css1, css2, rx2,
		cssText =
			'margin-left: ' + (-w / 2).toFixed(0) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(0) + 'px;';
	face.setAttribute('width', w.toFixed(0));
	face.setAttribute('height', h.toFixed(0));
	if (Math.abs(rx) == Math.PI / 2) {
		var px = (w - w2) / 2,
			py = (rx < 0) ? 0 : h,
			cxy = ' ' + (w / 2).toFixed(0) + ',' + (h / 2).toFixed(0);
		for (var i = 0; i < cpc;  i++) {
			points = px.toFixed(0) + ',' + py.toFixed(0);
			px += Math.cos(i * ca) * w2;
			py += Math.sign(-rx) * Math.sin(i * ca) * w2;
			points += ' ' + px.toFixed(0) + ',' + py.toFixed(0) + cxy;
			shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
			shape.setAttribute('points', points);
			shape.style.cssText = 'fill:' + getRainbowColor(i, cpc) + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
			face.appendChild(shape);
		}
	}
	else {
		var wf = w.toFixed(0), hf = h.toFixed(0), x1f = ((w - w2) / 2).toFixed(0), x2f = ((w + w2) / 2).toFixed(0);
		if (rx >= 0)
			points = '0,' + hf + ' ' + wf + ',' + hf + ' ' + x2f + ',0 ' + x1f + ',0';
		else
			points = x1f + ',' + hf + ' ' + x2f + ',' + hf + ' ' + wf + ',0 0,0';
		shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		shape.setAttribute('points', points);
		shape.style.cssText = 'fill:' + color + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
		face.appendChild(shape);
	}
	css = 'transform: rotateY(' + ry + 'rad) rotateX(' + rx + 'rad) translateZ(';
	cssText += addVendorPrefix(css + tz.toFixed(0) + 'px);');
	css += (tz + dia / 2).toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-9 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tx = (ry >= Math.PI) ? (ry - 2 * Math.PI) / ca * cw : ry / ca * cw;
	tx += cw / 2;
	ty = -rx / ca * cw;
	css = 'transform: translate3d(' + tx.toFixed(0) + 'px, ' + ty.toFixed(0) + 'px, 0px) !important;';
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tz2 = Math.cos(rx) * tz;
	css1 = 'transform: rotateY(' + ry + 'rad) translate3d(0px, ';
	css2 = 'px, ' + tz2.toFixed(0) + 'px) !important;';
	ty = -rx * 150;
	css = css1 + ty.toFixed(0) + css2;
	_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * -2 * h;
	css = css1 + ty.toFixed(0) + css2;
	_cssRules += '.unpack-3 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * (Math.PI / 2 - Math.abs(rx)) * -150;
	css = css1 + ty.toFixed(0) + css2;
	_cssRules += '.unpack-4 .' + cname + ' {' + addVendorPrefix(css) + '}';
	ty = Math.sign(rx) * -80;
	css = 'transform: rotateY(' + ry + 'rad) translateY(' + ty.toFixed(0) + 'px) rotateX(' + rx + 'rad) translateZ(' + tz.toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-5 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tx = (ry < Math.PI) ? 80 : -80;
	css = 'transform: translateX(' + tx.toFixed(0) + 'px) rotateY(' + ry + 'rad) rotateX(' + rx + 'rad) translateZ(' + tz.toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-6 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tz2 = (ry < Math.PI / 2 || ry > Math.PI * 1.5) ? 80 : -80;
	css = 'transform: translate3d(' + tx.toFixed(0) + 'px, 0px, ' + tz2.toFixed(0) + 'px) rotateY(' + ry + 'rad) rotateX('
			+ rx + 'rad) translateZ(' + tz.toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-7 .' + cname + ' {' + addVendorPrefix(css) + '}';
	rx2 = Math.sign(rx) * Math.PI / 2 - rx;
	css = 'transform: rotateY(' + ry + 'rad) rotateX(' + rx + 'rad) translateZ(' + tz.toFixed(0) + 'px) rotateX(' + rx2 + 'rad) !important;';
	_cssRules += '.unpack-8 .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.unpack-10 .' + cname + '{' + addVendorPrefix(css) + '}';
	face.classList.add(cname);
	face.style.cssText = cssText;
	return face;
}
