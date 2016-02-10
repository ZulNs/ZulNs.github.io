
/************************************************
 * 3D Cylinder Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, December 2015   *
 ************************************************/

var _diameter = 100,
	_bladesNumber = 32,
	_height = 140,
	_opacity = 0.75,
	_transitionInterval = 3000,
	_modelName = 'cylinder',
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
	_bladesNumberInput = document.getElementById('blades-number'),
	_heightInput = document.getElementById('height-value'),
	_expandInput = document.getElementById('expand-length'),
	_opacityInput = document.getElementById('opacity-value'),
	_intervalInput = document.getElementById('transition-interval');

init();

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html?3';
	_diameterInput.value = _diameter;
	_bladesNumberInput.value = _bladesNumber;
	_heightInput.value = _height;
	_opacityInput.value = _opacity * 100;
	_intervalInput.value = _transitionInterval;
	for (var i = 1; i <= 3; i++)
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
		ti = getIntValue(_intervalInput.value);
	if (dl < 1) dl = 1;
	if (h < 1) h = 1;
	if (bn < 3) bn = 3;
	if (ov < 0) ov = 0;
	if (ov > 100) ov = 100;
	if (ti < 1000) ti = 1000;
	_diameterInput.value = dl;
	_heightInput.value = h;
	_bladesNumberInput.value = bn;
	_opacityInput.value = ov;
	_intervalInput.value = ti;
	ov /= 100;
	if (dl != _diameter || h != _height || bn != _bladesNumber || ov != _opacity) {
		var nodes = document.querySelectorAll('.' + _modelName + ' svg');
		for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
		document.getElementById(_modelName + '-style').remove();
		_diameter = dl;
		_height = h;
		_bladesNumber = bn;
		_opacity = ov;
		createModel(_model, dl, h, bn, ov);
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
	var t = ~~(Math.random() * 4);
	if (t == _currentTransition) t = ++t % 4;
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

function createModel(model, diameter, height, bladesNumber, opacity) {
	var baseAngle = Math.PI / bladesNumber,
		bladeAngle = 2 * baseAngle,
		bladeW = diameter * Math.tan(baseAngle),
		coverW = diameter,
		coverH = diameter,
		outerDia,
		style = document.createElement('style');
	_productToRadians = 2 * Math.PI / Math.max(height + height + coverW + coverW, height + height + coverH + coverH, bladeW * bladesNumber);
	if (bladesNumber % 4) {
		outerDia = diameter / Math.cos(baseAngle);
		if (bladesNumber % 2) {
			coverW = outerDia * Math.sin(Math.PI * (bladesNumber - 1) / 2 / bladesNumber);
			coverH = (outerDia + diameter) / 2;
		}
		else
			coverW = outerDia;
	}
	model.appendChild(createFace(coverW, coverH, -Math.PI / 2, diameter, height, bladeW, bladesNumber, bladeAngle, '', opacity, 'bottom', false));
	model.appendChild(createFace(coverW, coverH, Math.PI / 2, diameter, height, bladeW, bladesNumber, bladeAngle, '', opacity, 'top', false));
	for (var c = 0; c < bladesNumber; c++)
		model.appendChild(createFace(bladeW, height, c * bladeAngle, diameter, height, bladeW, bladesNumber,
				bladeAngle, getRainbowColor(c, bladesNumber), opacity, 'side-' + c.toString(), true));
	style.type = 'text/css';
	style.id = _modelName + '-style';
	if (style.styleSheet)
		style.styleSheet.cssText = _cssRules;
	else
		style.innerHTML = _cssRules;
	_cssRules = '';
	document.head.appendChild(style);
}

function createFace(w, h, r, dia, ch, bw, bn, ba, color, opacity, cname, isSide) {
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		shape, css, tx, ty, tz,
		cssText =
			'margin-left: ' + (-w / 2).toFixed(0) + 'px;' +
			'margin-top: ' + (-h / 2).toFixed(0) + 'px;';
	face.setAttribute('width', w.toFixed(0));
	face.setAttribute('height', h.toFixed(0));
	if (isSide) {
		shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		shape.setAttribute('width', w.toFixed(0));
		shape.setAttribute('height', h.toFixed(0));
		shape.style.cssText = 'fill:' + color + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
		face.appendChild(shape);
		tz = dia / 2;
		css = 'transform: rotateY(' + r + 'rad) translateZ(';
	}
	else {
		var px = (w - bw) / 2,
			py = (r < 0) ? 0 : h,
			cx = w / 2,
			cy = (r > 0) ? h - dia /2 : dia / 2,
			cxy = ' ' + cx.toFixed(0) + ',' + cy.toFixed(0),
			points;
		for (var i = 0; i < bn;  i++) {
			points = px.toFixed(0) + ',' + py.toFixed(0);
			px += Math.cos(i * ba) * bw;
			py += Math.sign(-r) * Math.sin(i * ba) * bw;
			points += ' ' + px.toFixed(0) + ',' + py.toFixed(0) + cxy;
			shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
			shape.setAttribute('points', points);
			shape.style.cssText = 'fill:' + getRainbowColor(i, bn) + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
			face.appendChild(shape);
		}
		ty = Math.sign(-r) * (h - dia) / 2;
		tz = ch / 2;
		css = 'transform: rotateX(' + r + 'rad) translate3d(0px, ' + ty.toFixed(0) + 'px, ';
	}
	cssText += addVendorPrefix(css + tz.toFixed(0) + 'px);');
	css += (tz + dia / 2).toFixed(0) + 'px) !important;';
	_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css) + '}';
	if (isSide) {
		tx = (r >= Math.PI) ? (r - 2 * Math.PI) / ba * w : r / ba * w;
		tx += w / 2;
		css = 'transform: translateX(' + tx.toFixed(0) + 'px) !important;';
	}
	else {
		tx = bw / 2;
		ty = Math.sign(-r) * (h + (ch - h) / 2);
		css = 'transform: translate3d(' + tx.toFixed(0) + 'px, ' + ty.toFixed(0) + 'px, 0px) !important;';
	}
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.unpack-3 .' + cname + '{' + addVendorPrefix(css) + '}';
	face.classList.add((isSide) ? 'sides' : 'covers');
	face.classList.add(cname);
	face.style.cssText = cssText;
	return face;
}
