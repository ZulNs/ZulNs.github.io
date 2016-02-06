
/****************************************************************
 * 3D Sphere To Cube Animation With Virtual Trackball Transform *
 * Design by ZulNs @Yogyakarta, January 2015                    *
 ****************************************************************/

var _diameter = 160;
var _cellsPerCircum = 22;
var _opacity = 0.75;
var _transitionInterval = 3000;
var _transformInterval = 2000;
var _modelName = 'sphere';
var _model;
var _cssRules = '';
var _isPaused = false;
var _isManual = false;
var _dragging = false;
var _lastTransform, _matrix, _spx, _spy;
var _productToRadians;
var _isTransitionStopped = true;
var _transitionTimer;
var _isTransformStopped = false;
var _transformTimer;
var _currentCellsPerCircum = _cellsPerCircum;
var _cellsAdder = -2;
var _currentTransition = 0;
var _animate = document.getElementById('toggle-animation');
var _transist = document.getElementById('toggle-transition');
var _transform = document.getElementById('toggle-transform');
var _diameterInput = document.getElementById('diameter-length');
var _cellsPerCircumInput = document.getElementById('cells-per-circum');
var _opacityInput = document.getElementById('opacity-value');
var _transitionIntervalInput = document.getElementById('transition-interval');
var _transformIntervalInput = document.getElementById('transform-interval');

init();

function init() {
	document.getElementById('title').innerHTML = document.title;
	_diameterInput.value = _diameter;
	_cellsPerCircumInput.value = _cellsPerCircum;
	_opacityInput.value = _opacity * 100;
	_transitionIntervalInput.value = _transitionInterval;
	_transformIntervalInput.value = _transformInterval;
	for (var i = 1; i <= 2; i++)
		document.getElementById('unpack-' + i).checked = false;
	appendModel();
	_model.classList.add('animate');
	if (_cellsPerCircum > 4)
		_transformTimer = window.setInterval(nextTransform, _transformInterval);
	else {
		toggleTransform();
		_transform.disabled = true;
	}
	var r = 30;
	for (var i = 0; i < r; i++) console.log('Color-' + i + ': ' + getRainbowColor(i, r));
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
	var cpc = getIntValue(_cellsPerCircumInput.value);
	var ov = getIntValue(_opacityInput.value);
	var tsi = getIntValue(_transitionIntervalInput.value);
	var tfi = getIntValue(_transformIntervalInput.value);
	if (dl < 1) dl = 1;
	if (cpc % 2 != 0) cpc++;
	if (cpc < 4) cpc = 4;
	if (ov < 0) ov = 0;
	if (ov > 100) ov = 100;
	if (tsi < 1000) tsi = 1000;
	if (tfi < 1000) tfi = 1000;
	_diameterInput.value = dl;
	_cellsPerCircumInput.value = cpc;
	_opacityInput.value = ov;
	_transitionIntervalInput.value = tsi;
	_transformIntervalInput.value = tfi;
	ov /= 100;
	if (dl != _diameter || cpc != _cellsPerCircum || ov != _opacity) {
		if (!_isTransformStopped) window.clearInterval(_transformTimer);
		_transform.disabled = (cpc == 4);
		_diameter = dl;
		_cellsPerCircum = cpc;
		_opacity = ov;
		_currentCellsPerCircum = cpc;
		_cellsAdder = -2;
		recreateModel(_model, dl, cpc, ov);
		if (!_isTransformStopped && cpc > 4)
			_transformTimer = window.setInterval(nextTransform, _transformInterval);
		if (!_isTransformStopped && cpc == 4)
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
	_currentCellsPerCircum += _cellsAdder;
	if (_currentCellsPerCircum < 4) {
		_currentCellsPerCircum = 6;
		_cellsAdder = 2;
	}
	else if (_currentCellsPerCircum > _cellsPerCircum) {
		_currentCellsPerCircum = _cellsPerCircum - 2;
		_cellsAdder = -2;
	}
	recreateModel(_model, _diameter, _currentCellsPerCircum, _opacity);
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

function recreateModel(model, diameter, cellsPerCircum, opacity) {
	var nodes = document.querySelectorAll('.' + _modelName + ' svg');
	for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
	document.getElementById(_modelName + '-style').remove();
	createModel(model, diameter, cellsPerCircum, opacity);
}

function createModel(model, diameter, cellsPerCircum, opacity) {
	var baseAngle = Math.PI / cellsPerCircum;
	var cellAngle = 2 * baseAngle;
	var cellW = diameter * Math.tan(baseAngle);
	_productToRadians = 2 * Math.PI / cellW / cellsPerCircum;
	var xc = ~~(cellsPerCircum / 4);
	var yc, rx, ry, dlen = 0, cw, cw2, color, name1, name2;
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

function createFace(w, h, w2, rx, ry, tz, dia, cpc, cw, ca, color, opacity, cname) {
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var shape, points = '', css, tx, ty;
	var cssText =
		'margin-left: ' + (-w / 2).toFixed(0) + 'px;' +
		'margin-top: ' + (-h / 2).toFixed(0) + 'px;';
	face.setAttribute('width', w.toFixed(0));
	face.setAttribute('height', h.toFixed(0));
	if (Math.abs(rx) == Math.PI / 2) {
		var px = (w - w2) / 2;
		var py = (rx < 0) ? 0 : h;
		var cxy = ' ' + (w / 2).toFixed(0) + ',' + (h / 2).toFixed(0);
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
		var wf = (w).toFixed(0), hf = (h).toFixed(0), x1f = ((w - w2) / 2).toFixed(0), x2f = ((w + w2) / 2).toFixed(0);
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
	_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css) + '}';
	tx = (ry >= Math.PI) ? (ry - 2 * Math.PI) / ca * cw : ry / ca * cw;
	tx += cw / 2;
	ty = -rx / ca * cw;
	css = 'transform: translate3d(' + tx.toFixed(0) + 'px, ' + ty.toFixed(0) + 'px, 0px) !important;';
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css) + '}';
	face.classList.add(cname);
	face.style.cssText = cssText;
	return face;
}
