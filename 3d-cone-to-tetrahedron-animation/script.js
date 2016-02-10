
/*************************888888888888888*******************
 * 3D Cone To Tetrahedron Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015              *
 ***********************************************************/

var _diameter = 100,
	_height = 140,
	_bladesNumber = 12,
	_opacity = 0.75,
	_transitionInterval = 3000,
	_transformInterval = 2000,
	_modelName = 'cone',
	_model,
	_cssRules = '',
	_isPaused = false,
	_isManual = false,
	_dragging = false,
	_isFiredByMouse = false,
	_touchId,
	_lastTransform, _matrix, _spx, _spy,
	_productToRadians,
	_isTransitionStopped = true,
	_transitionTimer,
	_currentTransition = 0,
	_isTransformStopped = false,
	_transformTimer,
	_currentBladesNumber = _bladesNumber,
	_bladesAdder = -1,
	_animate = document.getElementById('toggle-animation'),
	_transist = document.getElementById('toggle-transition'),
	_transform = document.getElementById('toggle-transform'),
	_diameterInput = document.getElementById('diameter-length'),
	_heightInput = document.getElementById('height-value'),
	_bladesNumberInput = document.getElementById('blades-number'),
	_opacityInput = document.getElementById('opacity-value'),
	_intervalInput = document.getElementById('transition-interval'),
	_transformIntervalInput = document.getElementById('transform-interval'),
	_transitionIntervalInput = document.getElementById('transition-interval');

init();

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html';
	_diameterInput.value = _diameter;
	_heightInput.value = _height;
	_bladesNumberInput.value = _bladesNumber;
	_opacityInput.value = _opacity * 100;
	_transitionIntervalInput.value = _transitionInterval;
	_transformIntervalInput.value = _transformInterval;
	for (var i = 1; i <= 6; i++)
		document.getElementById('unpack-' + i).checked = false;
	appendModel();
	_model.classList.add('animate');
	if (_bladesNumber > 3)
		_transformTimer = window.setInterval(nextTransform, _transformInterval);
	else {
		toggleTransform();
		_transform.disabled = true;
	}
}

function appendModel() {
	var wrap = document.createElement("div");
	_model = document.createElement("div");
	wrap.classList.add(_modelName + '-wrapper');
	_model.classList.add(_modelName);
	createModel(_model, _diameter, _height, _bladesNumber, _opacity);
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
		h = getIntValue(_heightInput.value),
		bn = getIntValue(_bladesNumberInput.value),
		ov = getIntValue(_opacityInput.value),
		tsi = getIntValue(_transitionIntervalInput.value),
		tfi = getIntValue(_transformIntervalInput.value);
	if (dl < 1) dl = 1;
	if (h < 1) h = 1;
	if (bn < 3) bn = 3;
	if (ov < 0) ov = 0;
	if (ov > 100) ov = 100;
	if (tsi < 1000) tsi = 1000;
	if (tfi < 1000) tfi = 1000;
	_diameterInput.value = dl;
	_heightInput.value = h;
	_bladesNumberInput.value = bn;
	_opacityInput.value = ov;
	_transitionIntervalInput.value = tsi;
	_transformIntervalInput.value = tfi;
	ov /= 100;
	if (dl != _diameter || h != _height || bn != _bladesNumber || ov != _opacity) {
		if (!_isTransformStopped) window.clearInterval(_transformTimer);
		_transform.disabled = (bn == 3);
		_diameter = dl;
		_height = h;
		_bladesNumber = bn;
		_opacity = ov;
		_currentBladesNumber = bn;
		_bladesAdder = -1;
		recreateModel(_model, dl, h, bn, ov);
		if (!_isTransformStopped && bn > 3)
			_transformTimer = window.setInterval(nextTransform, _transformInterval);
		if (!_isTransformStopped && bn == 3)
			toggleTransform();
	}
	if (tsi != _transitionInterval) {
		_transitionInterval = tsi;
		if (!_isTransitionStopped) {
			window.clearInterval(_transitionTimer);
			_transitionTimer = window.setInterval(nextTransition, _transitionInterval);
		}
	}
	if (tfi != _transformInterval) {
		_transformInterval = tfi;
		if (!_isTransformStopped) {
			window.clearInterval(_transformTimer);
			_transformTimer = window.setInterval(nextTransform, _transformInterval);
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

function toggleTransform() {
	if (_isTransformStopped) {
		_transform.innerHTML = 'Stop Transform';
		_transformTimer = window.setInterval(nextTransform, _transformInterval);
	}
	else {
		window.clearInterval(_transformTimer);
		_transform.innerHTML = 'Start Transform';
	}
	_isTransformStopped ^= true;
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
	var t = ~~(Math.random() * 7);
	if (t == _currentTransition) t = ++t % 7;
	if (t) {
		document.getElementById('unpack-' + t).checked = true;
		unpack(t);
	}
	else {
		uncheckLastOption();
		_currentTransition = 0;
	}
}

function nextTransform() {
	_currentBladesNumber += _bladesAdder;
	if (_currentBladesNumber < 3) {
		_currentBladesNumber = 4;
		_bladesAdder = 1;
	}
	else if (_currentBladesNumber > _bladesNumber) {
		_currentBladesNumber = _bladesNumber - 1;
		_bladesAdder = -1;
	}
	recreateModel(_model, _diameter, _height, _currentBladesNumber, _opacity);
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

function recreateModel(model, diameter, height, bladesNumber, opacity) {
	var nodes = document.querySelectorAll('.' + _modelName + ' svg');
	for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
	document.getElementById(_modelName + '-style').remove();
	createModel(model, diameter, height, bladesNumber, opacity);
}

function createModel(model, diameter, height, bladesNumber, opacity) {
	var baseAngle = Math.PI / bladesNumber,
		bladeAngle = 2 * baseAngle,
		tiltAngle = Math.atan2(diameter / 2, height),
		bladeW = diameter * Math.tan(baseAngle),
		bladeH = height / Math.cos(tiltAngle),
		coverW = diameter,
		coverH = diameter,
		outerDia,
		halfS = (bladesNumber - bladesNumber % 2) / 2,
		style = document.createElement('style');
	_productToRadians = 2 * Math.PI / (bladeH + bladeH + diameter);
	if (bladesNumber % 4) {
		outerDia = diameter / Math.cos(baseAngle);
		if (bladesNumber % 2) {
			coverW = outerDia * Math.sin(Math.PI * (bladesNumber - 1) / 2 / bladesNumber);
			coverH = (outerDia + diameter) / 2;
		}
		else
			coverW = outerDia;
	}
	model.appendChild(createFace(coverW, coverH, Math.PI / 2, diameter, height, bladesNumber, bladeW, bladeH, bladeAngle, tiltAngle, 'rainbow-gradient', opacity, 'cover', false));
	for (var c = 0; c < bladesNumber; c++)
		model.appendChild(createFace(bladeW, bladeH, bladeAngle * (c - halfS), diameter, height, bladesNumber, bladeW, bladeH,
				bladeAngle, tiltAngle, getRainbowColor(c, bladesNumber), opacity, 'side-' + c.toString(), true));
	style.type = 'text/css';
	style.id = _modelName + '-style';
	if (style.styleSheet)
		style.styleSheet.cssText = _cssRules;
	else
		style.innerHTML = _cssRules;
	_cssRules = '';
	document.head.appendChild(style);
}

function createFace(w, h, r, dia, ch, bn, bw, bh, ba, ta, color, opacity, cname, isSide) {
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		shape, points = '', css, tx, ty, tz,
		cssText =
			'margin-left: ' + (-w / 2).toFixed(0) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(0) + 'px;';
	face.setAttribute('width', w.toFixed(0));
	face.setAttribute('height', h.toFixed(0));
	if (isSide) {
		var p0 = '0,0',
			p1 = (w / 2).toFixed(0) + ',' + (h).toFixed(0),
			p2 = w.toFixed(0) + ',0';
		points = p0 + ' ' + p1 + ' ' + p2;
		shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		shape.setAttribute('points', points);
		shape.style.cssText = 'fill:' + color + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
		face.appendChild(shape);
		cssText += addVendorPrefix('transform-origin: top;');
		ty = (h - ch) / 2;
		tz = dia / 2;
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) rotateX(' + -ta + 'rad);';
	}
	else {
		var px = (w - bw) / 2, py = h,
			cx = w / 2, cy = h - dia /2,
			cxy = ' ' + cx.toFixed(0) + ',' + cy.toFixed(0),
			halfS = (bn - bn % 2) / 2;
		for (var i = 0; i < bn;  i++) {
			points = px.toFixed(0) + ',' + py.toFixed(0);
			px += Math.cos(i * ba) * bw;
			py -= Math.sin(i * ba) * bw;
			points += ' ' + px.toFixed(0) + ',' + py.toFixed(0) + cxy;
			shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
			shape.setAttribute('points', points);
			shape.style.cssText = 'fill:' + getRainbowColor((i + halfS) % bn, bn) + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
			face.appendChild(shape);
		}
		cssText += addVendorPrefix('transform-origin: bottom;');
		ty = dia / 2;
		tz = (ch + h) / 2;
		css = 'transform: rotateX(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px);';
	}
	cssText += addVendorPrefix(css);
	if (isSide)
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + (tz + dia / 2).toFixed(0) + 'px) rotateX(' + -ta + 'rad) !important;';
	else
		css = 'transform: rotateX(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + (tz + dia / 2).toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-6 .' + cname + ' {' + addVendorPrefix(css) + '}';
	if (isSide) {
		tx = r / 2 / Math.PI * (w - 1) * bn;
		css = 'transform: translate3d(' + tx.toFixed(0) + 'px, 0px, ' + tz.toFixed(0) + 'px) !important;';
	}
	else {
		ty = (-bh - h) / 2;
		tz = dia / 2;
		css = 'transform: translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) !important;';
	}
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css) + '}';
	if (isSide) {
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) rotateX(90deg) !important;';
		_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css) + '}';
		ty += ch;
		tz = h;
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) rotateX(-90deg) !important;';
		_cssRules += '.unpack-3 .' + cname + ' {' + addVendorPrefix(css) + '}';
		tz += dia / 2;
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) rotateX(-90deg) !important;';
		_cssRules += '.unpack-4 .' + cname + ' {' + addVendorPrefix(css) + '}';
		ty = (h - ch) / 2;
		tz = dia;
		css = 'transform: rotateY(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) rotateX(' + -ta + 'rad) !important;';
		_cssRules += '.unpack-5 .' + cname + ' {' + addVendorPrefix(css) + '}';
	}
	else {
		ty = dia / 2;
		tz = (h - ch) / 2;
		css = 'transform: rotateX(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ' + tz.toFixed(0) + 'px) !important;';
		_cssRules += '.unpack-4 .' + cname + ' {' + addVendorPrefix(css) + '}';
		_cssRules += '.unpack-5 .' + cname + ' {' + addVendorPrefix(css) + '}';
	}
	face.className = (isSide) ? 'sides' : 'covers';
	face.classList.add(cname);
	face.style.cssText = cssText;
	return face;
}
