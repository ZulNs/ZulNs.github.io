
/*********************************************************
 * 3D Cylinder To Prism Animation With Virtual Trackball *
 * Design by ZulNs @Yogyakarta, January 2016             *
 *********************************************************/

var _diameter = 100;
var _height = 140;
var _bladesNumber = 12;
var _opacity = 0.75;
var _transitionInterval = 3000;
var _transformInterval = 2000;
var _modelName = 'cylinder';
var _model;
var _cssRules = '';
var _isPaused = false;
var _isManual = false;
var _dragging = false;
var _lastTransform, _matrix, _spx, _spy;
var _productToRadians;
var _isTransitionStopped = true;
var _transitionTimer;
var _currentTransition = 0;
var _isTransformStopped = false;
var _transformTimer;
var _currentBladesNumber = _bladesNumber;
var _bladesAdder = -1;
var _animate = document.getElementById('toggle-animation');
var _transist = document.getElementById('toggle-transition');
var _transform = document.getElementById('toggle-transform');
var _diameterInput = document.getElementById('diameter-length');
var _heightInput = document.getElementById('height-value');
var _bladesNumberInput = document.getElementById('blades-number');
var _opacityInput = document.getElementById('opacity-value');
var _transitionIntervalInput = document.getElementById('transition-interval');
var _transformIntervalInput = document.getElementById('transform-interval');
var _transitionIntervalInput = document.getElementById('transition-interval');

init();

function init() {
	document.getElementById('title').innerHTML = document.title;
	_diameterInput.value = _diameter;
	_heightInput.value = _height;
	_bladesNumberInput.value = _bladesNumber;
	_opacityInput.value = _opacity * 100;
	_transitionIntervalInput.value = _transitionInterval;
	_transformIntervalInput.value = _transformInterval;
	for (var i = 1; i <= 2; i++)
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
				css = 'transform: ' + _lastTransform + ' rotate3d(' + x + ', ' + y + ', ' + z + ', ' + rad + 'rad);';
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
}

function applyEntries() {
	var dl = getIntValue(_diameterInput.value);
	var h = getIntValue(_heightInput.value);
	var bn = getIntValue(_bladesNumberInput.value);
	var ov = getIntValue(_opacityInput.value);
	var tsi = getIntValue(_transitionIntervalInput.value);
	var tfi = getIntValue(_transformIntervalInput.value);
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
	var t = ~~(Math.random() * 3);
	if (t == _currentTransition) t = ++t % 3;
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
	var h = (step % numOfSteps) / numOfSteps;
	var i = ~~(h * 6);
	var a = h * 6 - i;
	var d = 1 - a;
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
	var baseAngle = Math.PI / bladesNumber;
	var bladeAngle = 2 * baseAngle;
	var bladeW = diameter * Math.tan(baseAngle);
	var coverW = diameter;
	var coverH = diameter;
	_productToRadians = 2 * Math.PI / Math.max(height + height + coverW + coverW, height + height + coverH + coverH, bladeW * bladesNumber);
	var outerDia;
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
	var style = document.createElement('style');
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
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var shape, css, tx, ty, tz;
	var cssText =
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
		var px = (w - bw) / 2;
		var py = (r < 0) ? 0 : h;
		var cx = w / 2;
		var cy = (r > 0) ? h - dia /2 : dia / 2;
		var cxy = ' ' + cx.toFixed(0) + ',' + cy.toFixed(0);
		var points;
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
	face.classList.add((isSide) ? 'sides' : 'covers');
	face.classList.add(cname);
	face.style.cssText = cssText;
	return face;
}
