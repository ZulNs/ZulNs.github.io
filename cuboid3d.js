
var lastTransform,
	transformMatrix,
	startPointX,
	startPointY,
	isDragging = false,
	isBlocked = false,
	isFiredByMouse = false,
	touchId,
	productToRadians = Math.PI / 560,
	cuboid = document.getElementsByClassName('cuboid')[0];

init();

function init() {
	var contents = document.querySelectorAll('.cuboid .content'),
		option = document.location.search,
		rotate;
	for (var i = 0; i < contents.length; i++)
		addEvent(contents[i], 'mousedown', handleBlockEvent);
	addEvent(cuboid, 'mousedown', handleMouseDown);
	addEvent(cuboid, 'mousemove', handleMouseMove);
	addEvent(document, 'mouseup', handleMouseUp);
	if ('touchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
		for (var i = 0; i < contents.length; i++)
			addEvent(contents[i], 'touchstart', handleBlockEvent);
		addEvent(cuboid, 'touchstart', handleTouchStart);
		addEvent(cuboid, 'touchmove', handleTouchMove);
		addEvent(cuboid, 'touchcancel', handleTouchEnd);
		addEvent(document, 'touchend', handleTouchEnd);
	}
	option = (!!option) ? option.substring(1) : 0;
	rotate = (option == 2) ? 245 : (option == 3) ? 205 : -45;
	cuboid.style.cssText = addVendorPrefix('transform: rotateY(' + rotate + 'deg);');
}

function addEvent(elm, evt, callback) {
	if (!!window.addEventListener)
		elm.addEventListener(evt, callback);
	else
		elm.attachEvent('on' + evt, callback);
}

function addVendorPrefix(property) {
	return	'-webkit-' + property +
			'-moz-' + property +
			'-o-' + property +
			property;
}

function toArray(str) {
	var res = [], arr = str.substring(9, str.length -1).split(',');
	for (var i in arr) res.push(parseFloat(arr[i]));
	return res;
}

function handleMouseDown(evt) {
	if (!isBlocked && !isDragging) {
		var e = evt || window.event;
		e.preventDefault();
		e.stopPropagation();
		isFiredByMouse = true;
		startDragging(e.pageX, e.pageY);
	}
}

function handleMouseMove(evt) {
	if (isDragging && isFiredByMouse) {
		var e = evt || window.event;
		e.preventDefault();
		whileDragging(e.pageX, e.pageY);
	}
}

function handleMouseUp(evt) {
	if (isDragging && isFiredByMouse) {
		var e = evt || window.event;
		e.preventDefault();
		endDragging();
	}
	isBlocked = false;
}

function handleTouchStart(evt) {
	var e = evt || window.event;
	if (isDragging && !isBlocked && !isFiredByMouse && e.touches.length == 1) endDragging();
	if (!isBlocked && !isDragging) {
		var touch = e.changedTouches[0];
		e.preventDefault();
		//e.stopPropagation();
		isFiredByMouse = false;
		touchId = touch.identifier;
		startDragging(touch.pageX, touch.pageY);
	}
}

function handleTouchMove(evt) {
	if (isDragging && !isFiredByMouse) {
		var e = evt || window.event;
		var touches = e.changedTouches;
		var touch;
		for (var i = 0; i < touches.length; i++) {
			touch = touches[i];
			if (touch.identifier === touchId) {
				e.preventDefault();
				whileDragging(touch.pageX, touch.pageY);
				break;
			}
		}
	}
}

function handleTouchEnd(evt) {
	if (isDragging && !isFiredByMouse) {
		var e = evt || window.event;
		var touches = e.changedTouches;
		var touch;
		for (var i = 0; i < touches.length; i++) {
			touch = touches[i];
			if (touch.identifier === touchId) {
				e.preventDefault();
				endDragging();
				break;
			}
		}
	}
	isBlocked = false;
}

function handleBlockEvent(evt) {
	if (!isDragging) isBlocked = true;
}

function startDragging(spx, spy) {
	startPointX = spx;
	startPointY = spy;
	isDragging = true;
	lastTransform = window.getComputedStyle(cuboid).getPropertyValue('transform');
	if (lastTransform === 'none')
		lastTransform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
	transformMatrix = toArray(lastTransform);
	cuboid.style.cssText = addVendorPrefix('transform: ' + lastTransform + ';');
}

function whileDragging(cpx, cpy) {
	var sx, sy, x = 0, y = 0, z = 0, cr = 0.5, rad, css;
	if (startPointX != cpx || startPointY != cpy) {
		sx = (startPointY - cpy);
		sy = (cpx - startPointX);
		rad = Math.sqrt(sx * sx + sy * sy) * productToRadians;
		x = sx * transformMatrix[0] + sy * transformMatrix[1];
		y = sx * transformMatrix[4] + sy * transformMatrix[5];
		z = sx * transformMatrix[8] + sy * transformMatrix[9];
		css = 'transform: ' + lastTransform + ' rotate3d(' + x + ', ' + y + ', ' + z + ', ' + rad + 'rad);';
		cuboid.style.cssText = addVendorPrefix(css);
	}
}

function endDragging() {
	isDragging = false;
	lastTransform = window.getComputedStyle(cuboid).getPropertyValue('transform');
	transformMatrix = toArray(lastTransform);
}
