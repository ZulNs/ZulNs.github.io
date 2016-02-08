
/**********************************************
 * JavaScript on the fly                      *
 *                                            *
 * Design by ZulNs @Yogyakartaa, February 2016 *
 **********************************************/

 
var	TAB_INDENT = 4;
	textInput = document.getElementById('script-input'),
	textResult = document.getElementById('result');

document.querySelector('#title span').innerHTML = document.title;
if (document.location.search.toLowerCase() === '?3d')
	document.querySelector('#title a').href = '../cuboid3d.html';
textResult.readOnly = true;
textInput.focus();

textInput.onkeypress = function(e) {
	e = e || window.event;
	if (e.keyCode === 9 || e.which === 9) {
		e.preventDefault();
		var from = this.selectionStart,
			to = this.selectionEnd;
		if (e.shiftKey) {
			if (scanNewLine(from, to)) {
				from = getFirstLineLocation(from);
				to = getEndLineLocation(to - 1);
				var selStr = this.value.substring(from, to);
				selStr = subTabIndent(selStr);
				var selLen = selStr.length;
				this.value = this.value.substring(0, from) + selStr + this.value.substring(to);
				this.selectionStart = from;
				this.selectionEnd = from + selLen + 1;
			}
			else {
				var fl = getFirstLineLocation(from),
					fw = getFirstWordLocation(fl);
				if (from > fw) {
					from = fw;
				}
				else {
					var ic = getIndentCtr(fl, fw) - 4;
					this.value = this.value.substring(0, fl) + indentCtrToString(ic) + this.value.substring(fw);
					from = fl + indentCtrToCharCtr(ic);
				}
				this.selectionStart = from;
				this.selectionEnd = from;
			}
		}
		else {
			if (scanNewLine(from, to)) {
				from = getFirstLineLocation(from);
				to = getEndLineLocation(to - 1);
				var selStr = this.value.substring(from, to);
				selStr = addTabIndent(selStr);
				var selLen = selStr.length;
				this.value = this.value.substring(0, from) + selStr + this.value.substring(to);
				this.selectionStart = from;
				this.selectionEnd = from + selLen + 1;
			}
			else {
				var fl = getFirstLineLocation(from),
					fw = getFirstWordLocation(fl);
				if (to <= fw) {
					var ic = ~~((getIndentCtr(fl, from) + getIndentCtr(to, fw) + TAB_INDENT) / TAB_INDENT) * TAB_INDENT;
					this.value = this.value.substring(0, fl) + indentCtrToString(ic) + this.value.substring(fw);
					from = fl + indentCtrToCharCtr(ic);
				}
				else {
					this.value = this.value.substring(0, from) + '\t' + this.value.substring(to);
					from++;
				}
				this.selectionStart = from;
				this.selectionEnd = from;
			}
		}
	}
	else if (e.keyCode === 13 || e.which === 13) {
		e.preventDefault();
		var from = this.selectionStart,
			ic = getIndentCtr(getFirstLineLocation(from));
		this.value = this.value.substring(0, from) + '\n' + indentCtrToString(ic) + this.value.substring(getFirstWordLocation(this.selectionEnd));
		from += indentCtrToCharCtr(ic) + 1;
		this.selectionStart = from;
		this.selectionEnd = from;
	}
};

function evalScript() {
	try {
		eval(textInput.value);
	}
	catch (e) {
		writeln(e.message);
	}
	textInput.focus();
}

function clearTextInput() {
	textInput.value = '';
	textInput.focus();
}

function clearTextResult() {
	clearResult();
	textInput.focus();
}

function write(args) {
	for (var i = 0; i < arguments.length; i++) {
		textResult.value += arguments[i];
		if (i < arguments.length - 1) textResult.value += ', ';
	}
}

function writeln(args) {
	var len = textResult.value.length;
	if (len > 0 && textResult.value.charCodeAt(len - 1) !== 10) write('\n');
	if (args) write.apply(this, arguments);
	write('\n');
}

function clearResult() {
	textResult.value = '';
}

function getFirstLineLocation(from) {
	if (from === 0) return 0;
	for (var i = from - 1; i > 0; i--) {
		if (textInput.value.charCodeAt(i) === 10) return ++i;
	}
	return 0;
}

function getEndLineLocation(from) {
	var res = textInput.value.substring(from, textInput.value.length).search(/\n/);
	return (res !== -1) ? from + res : textInput.value.length;
	
}

function getFirstWordLocation(from) {
	var res = textInput.value.substring(from, textInput.value.length).search(/[^\t ]/);
	return (res !== -1) ? from + res : textInput.value.length;
}

function scanNewLine(from, to) {
	return textInput.value.substring(from, to).search(/\n/) !== -1
}

function getIndentCtr(from, to) {
	var ctr = 0, c;
	if (to === undefined || to === null) to = textInput.value.length;
	for (var i = from; i < to; i++) {
		c = textInput.value.charCodeAt(i);
		if (c === 32) ctr++;
		else if (c === 9) ctr = ~~((ctr + TAB_INDENT) / TAB_INDENT) * TAB_INDENT;
		else break;
	}
	return ctr;
}

function indentCtrToString(indentCtr) {
	var str = '', tab = ~~(indentCtr / TAB_INDENT), spc = indentCtr % TAB_INDENT;
	for (i = 0; i < tab; i++) str += '\t';
	for (i = 0; i < spc; i++) str += ' ';
	return str;
}

function indentCtrToCharCtr(indentCtr) {
	var ctr = ~~(indentCtr / TAB_INDENT) + indentCtr % TAB_INDENT;
	return (ctr < 0) ? 0 : ctr;
}

function getLinesArrayFromString(string) {
	var arr = string.split('\n');
	if (arr.length)
		if (arr[arr.length - 1] === '') arr.pop();
	return arr;
}

function turnSpaceToTabIndent(linesArray) {
	var re = new RegExp(' {' + TAB_INDENT + '}', 'g');
	var str0 = '', str1 = '';
	for (var i = 0; i < linesArray.length; i++) {
		str0 = linesArray[i].replace(/\S+.*/, '');
		str1 = linesArray[i].replace(/^\s+/, '');
		str0 = str0.replace(re, '\t');
		linesArray[i] = str0 + str1;
	}
	return;
}

function addTabIndent(string) {
	var arr = getLinesArrayFromString(string);
	turnSpaceToTabIndent(arr);
	for (var i = 0; i < arr.length; i++)
		arr[i] = '\t' + arr[i];
	var res = arr.join('\n');
	if (string.substring(-1) === '\n') res += '\n'
	return res;
}

function subTabIndent(string) {
	var arr = getLinesArrayFromString(string);
	turnSpaceToTabIndent(arr);
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].charAt(0) === '\t')
			arr[i] = arr[i].substring(1);
		else
			arr[i] = arr[i].replace(/^\s+/g, '');
	}
	var res = arr.join('\n');
	if (string.substring(-1) === '\n') res += '\n'
	return res;
}
