
var listNumber = 4;
var elementId = 'list-node-';

function parentClick(elm) {
	if (elm.checked)
		for (var i = 1; i < listNumber + 1; i++)
			if (elm.id !== elementId + i)
				document.getElementById(elementId + i).checked = false;
}
