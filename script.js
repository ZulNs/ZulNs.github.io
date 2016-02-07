
var lastElmId;

/*for (var i = 1; i <= 4; i++) {
	var elm = document.getElementById('list-node-' + i);
	if (elm.checked) elm.checked = false;
}*/

function parentClick(elm) {
	if (elm.checked) {
		if (lastElmId) document.getElementById(lastElmId).checked = false;
		lastElmId = elm.id;
	}
	else
		lastElmId = null;
}
