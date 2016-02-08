
var lastTransform,
	transformMatrix,
	startPointX,
	startPointY,
	isDragging = false,
	isBlocked = false,
	productToRadians = 2 * Math.PI / 1120,
	cuboid = document.getElementsByClassName('cuboid')[0];

init();

function init() {
	var contents = document.querySelectorAll('.cuboid .content');
	for (var i = 0; i < contents.length; i++) addEvent(contents[i], 'mousedown', blockEvent);
	addEvent(cuboid, 'mousedown', onMouseDown);
	addEvent(cuboid, 'mousemove', onMouseMove);
	addEvent(document, 'mouseup', onMouseUp);
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

function addEvent(elm, evt, callback) {
	if (!!window.addEventListener)
		elm.addEventListener(evt, callback);
	else
		elm.attachEvent('on' + evt, callback);
}

function onMouseDown(evt) {
	if (!isBlocked) {
		var e = evt || window.event;
		e.preventDefault();
		e.stopPropagation();
		startPointX = e.pageX;
		startPointY = e.pageY;
		isDragging = true;
		lastTransform = window.getComputedStyle(cuboid).getPropertyValue('transform');
		if (lastTransform === 'none')
			lastTransform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
		transformMatrix = toArray(lastTransform);
		cuboid.style.cssText = addVendorPrefix('transform: ' + lastTransform + ';');
	}
}

function onMouseMove(evt) {
	if (isDragging) {
		var e = evt || window.event;
		var cpx = e.pageX, cpy = e.pageY, sx, sy, x = 0, y = 0, z = 0, cr = 0.5, rad, css;
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
}

function onMouseUp(evt) {
	if (isDragging) {
		isDragging = false;
		lastTransform = window.getComputedStyle(cuboid).getPropertyValue('transform');
		transformMatrix = toArray(lastTransform);
	}
	if (isBlocked) isBlocked = false;
}

function blockEvent(evt) {
	isBlocked = true;
}
