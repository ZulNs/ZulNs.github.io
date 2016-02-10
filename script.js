
var lastElmId;
var option = document.location.search;

option = (!!option) ? option.substring(1) : 0;

if (1 <= option && option <= 4) {
	var elm = document.getElementById('list-node-' + option);
	elm.checked = true;
	parentClick(elm);
}

function parentClick(elm) {
	if (elm.checked) {
		if (lastElmId) {
			var lastElm = document.getElementById(lastElmId);
			lastElm.checked = false;
			lastElm.parentNode.classList.remove('expand');
		}
		elm.parentNode.classList.add('expand');
		lastElmId = elm.id;
	}
	else {
		elm.parentNode.classList.remove('expand');
		lastElmId = null;
	}
}
