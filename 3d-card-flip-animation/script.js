
var animName = 'flip';
var animStart = 1;
var animEnd = 18;

function init() {
	document.querySelector('#title span').innerHTML = document.title;
	if (document.location.search.toLowerCase() === '?3d')
		document.querySelector('#title a').href = '../cuboid3d.html';
	var vendorTypeAnim = whichAnimationEvent();
	var card = document.querySelector('.card');
	card.addEventListener(vendorTypeAnim, animationEndHandler);
	card.classList.add(animName + animStart.toString());
}

function animationEndHandler() {
	var currentAnimName = this.classList[1];
	var currentAnimCount = parseInt(currentAnimName.substr(animName.length));
	this.classList.remove(currentAnimName);
	currentAnimCount++;
	if (currentAnimCount > animEnd) currentAnimCount = animStart;
	this.classList.add(animName + currentAnimCount.toString());
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

init();
