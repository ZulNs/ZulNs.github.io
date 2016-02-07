
var lastElmId;

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
