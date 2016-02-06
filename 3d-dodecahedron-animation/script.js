
/******************************************************************
 * Pure CSS3 Dynamic Dodecahedron Animation With Background Image *
 * Design by ZulNs @Yogyakarta, December 2015                     *
 ******************************************************************/

var _edgeLen = 60;
var _opacity = 0.75;
var _transitionInterval = 3000;
var _modelName = 'dodecahedron';
var _model;
var _cssRules = '';
var _isPaused = false;
var _isManual = false;
var _dragging = false;
var _lastTransform, _matrix, _spx, _spy;
var _productToRadians;
var _isTransitionStopped = false;
var _transitionTimer;
var _currentTransition = 0;
var _animate = document.getElementById('toggle-animation');
var _transist = document.getElementById('toggle-transition');
var _edgeInput = document.getElementById('edge-length');
var _opacityInput = document.getElementById('opacity-value');
var _intervalInput = document.getElementById('transition-interval');

init();

function init() {
	document.getElementById('title').innerHTML = document.title;
	_edgeInput.value = _edgeLen;
	_opacityInput.value = _opacity * 100;
	_intervalInput.value = _transitionInterval;
	for (var i = 1; i <= 4; i++)
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
	createModel(_model, _edgeLen, _opacity);
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
	var el = getIntValue(_edgeInput.value);
	var ov = getIntValue(_opacityInput.value);
	var ti = getIntValue(_intervalInput.value);
	if (el < 1) el = 1;
	if (ov < 0) ov = 0;
	if (ov > 100) ov = 100;
	if (ti < 1000) ti = 1000;
	_edgeInput.value = el;
	_opacityInput.value = ov;
	_intervalInput.value = ti;
	ov = ov / 100;
	if (el != _edgeLen || ov != _opacity) {
		var nodes = document.querySelectorAll('.' + _modelName + ' svg');
		for (var i = 0; i < nodes.length; i++) nodes[i].parentNode.removeChild(nodes[i]);
		document.getElementById(_modelName + '-style').remove();
		_edgeLen = el;
		_opacity = ov;
		createModel(_model, el, ov);
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
	var t = ~~(Math.random() * 5);
	if (t == _currentTransition) t = ++t % 5;
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

function createModel(model, edgeLen, opacity) {
	var w = 2 * edgeLen * Math.cos(Math.PI / 5);
	var h = edgeLen * (Math.cos(Math.PI / 10) + Math.sin(Math.PI / 5));
	_productToRadians = Math.PI / (h + h + edgeLen);
	var ta = Math.atan(2) / 2;
	var ty = -edgeLen / 2;
	var tz = h * Math.cos(ta);
	model.appendChild(createFace(w, h, ty, 0, 0, 0, tz, ta, edgeLen, getRainbowColor(0, 12), opacity, 'face-0'));
	model.appendChild(createFace(w, h, ty, 0, 0, 179.999, tz, ta, edgeLen, getRainbowColor(1, 12), opacity, 'face-1'));
	model.appendChild(createFace(w, h, ty, 0, 90, -90, tz, ta, edgeLen, getRainbowColor(2, 12), opacity, 'face-2'));
	model.appendChild(createFace(w, h, ty, 0, -90, 90, tz, ta, edgeLen, getRainbowColor(3, 12), opacity, 'face-3'));
	model.appendChild(createFace(w, h, ty, 90, 0, 90, tz, ta, edgeLen, getRainbowColor(4, 12), opacity, 'face-4'));
	model.appendChild(createFace(w, h, ty, 90, 0, -90, tz, ta, edgeLen, getRainbowColor(5, 12), opacity, 'face-5'));
	model.appendChild(createFace(w, h, ty, -90, 0, 90, tz, ta, edgeLen, getRainbowColor(6, 12), opacity, 'face-6'));
	model.appendChild(createFace(w, h, ty, -90, 0, -90, tz, ta, edgeLen, getRainbowColor(7, 12), opacity, 'face-7'));
	model.appendChild(createFace(w, h, ty, 0, 0, 0, -tz, -ta, edgeLen, getRainbowColor(8, 12), opacity, 'face-8'));
	model.appendChild(createFace(w, h, ty, 0, 0, 179.999, -tz, -ta, edgeLen, getRainbowColor(9, 12), opacity, 'face-9'));
	model.appendChild(createFace(w, h, ty, 0, 90, 90, tz, ta, edgeLen, getRainbowColor(10, 12), opacity, 'face-10'));
	model.appendChild(createFace(w, h, ty, 0, -90, -90, tz, ta, edgeLen, getRainbowColor(11, 12), opacity, 'face-11'));
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

function createFace(w, h, ty, rx, ry, rz, tz, trx, edgeLen, color, opacity, cname) {
	var face = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	var css;
	var cssText =
		'margin-left: ' + (-w / 2).toFixed(0) + 'px;' +
		'margin-top: ' + (-h / 2).toFixed(0) + 'px;';
	face.setAttribute('width', w.toFixed(0));
	face.setAttribute('height', h.toFixed(0));
	var px = (w - edgeLen) / 2, py = h, angle = Math.PI / 2.5;
	points = px.toFixed(0) + ',' + py.toFixed(0);
	for (var i = 0; i < 5 - 1;  i++) {
		px += Math.cos(i * angle) * edgeLen;
		py -= Math.sin(i * angle) * edgeLen;
		points += ' ' + px.toFixed(0) + ',' + py.toFixed(0);
	}
	shape.setAttribute('points', points);
	shape.style.cssText = 'fill:' + color + '; opacity:' + opacity + '; stroke:white; stroke-width:1;';
	css = 'transform: translateY(' + ty.toFixed(0) + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) translateZ(' + tz.toFixed(0) + 'px) ';
	_cssRules += '.unpack-1 .' + cname + ' {' + addVendorPrefix(css + '!important;') + '}';
	css += 'rotateX(';
	_cssRules += '.unpack-2 .' + cname + ' {' + addVendorPrefix(css + (-trx) + 'rad) !important;') + '}';
	css += trx + 'rad)';
	cssText += addVendorPrefix(css + ';');
	css += ' translateZ(' + (edgeLen * Math.sign(tz)) + 'px) !important;';
	_cssRules += '.unpack-3 .' + cname + ' {' + addVendorPrefix(css) + '}';
	css = 'transform: translateZ(0px) !important;';
	_cssRules += '.unpack-4 .' + cname + '{' + addVendorPrefix(css) + '}';
	face.classList.add(cname);
	face.style.cssText = cssText;
	face.appendChild(shape);
	return face;
}
