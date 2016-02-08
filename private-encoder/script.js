
var MULTIPLE_ENCODED_CHARS = 5;
var LIMIT_ENCODED_AMOUNT = 25;
var _wordInput = document.getElementById('word-input');
var _charAmountInput = document.getElementById('chars-amount-input');
var _wordResult = document.getElementById('word-result');
var _twoChars = document.getElementById('two-chars');
var _completedChars = document.getElementById('completed-chars');
var _currentTime = document.getElementById('current-time');
var _adjustedTime = document.getElementById('adjusted-time');
var _encodedTime = document.getElementById('encoded-time');
var _decodedTime = document.getElementById('decoded-time');

document.querySelector('#title span').innerHTML = document.title;
if (document.location.search.toLowerCase() === '?3d')
	document.querySelector('#title a').href = '../cuboid3d.html';

function encode() {
	var word = _wordInput.value;
	word = word.replace(/\s/g, '');
	if (word.length == 0) word = 'zulns';
	_wordInput.value = word;
	var charAmount = getIntValue(_charAmountInput.value);
	if (charAmount <= 0) charAmount = 1;
	if (charAmount > LIMIT_ENCODED_AMOUNT) charAmount = LIMIT_ENCODED_AMOUNT;
	_charAmountInput.value = charAmount;
	var emc = encodeMultiChrs(word, charAmount);
	var result = emc.substring(0, MULTIPLE_ENCODED_CHARS);
	if (charAmount > MULTIPLE_ENCODED_CHARS) {
		for (var i = 1; i < charAmount / MULTIPLE_ENCODED_CHARS; i++)
			result += "-" + emc.substring(i * MULTIPLE_ENCODED_CHARS, (i + 1) * MULTIPLE_ENCODED_CHARS);
	}
	_wordResult.value = word;
	_twoChars.value = encodeTwoChars(word);
	_completedChars.value = result;
	var time = new Date().getTime();
	_currentTime.value = time;
	time = ~~(time / 86400000) * 86400000;
	_adjustedTime.value = time;
	var et = encodeLong(time);
	_encodedTime.value = et;
	_decodedTime.value = decodeString(et);
	_wordInput.focus();
}

function getIntValue(value) {
	var iv = parseInt(value);
	if (isNaN(iv)) iv = 0;
	return iv;
}

function encodeMultiChrs(word, amount) {
	word = word.toUpperCase();
	var result = '', chr, xor = 0;
	for (var i = 0; i < word.length; i++) {
		xor ^= word.charCodeAt(i);
	}
	while (word.length % amount != 0) {
		word += ' ';
	}
	var multiple = word.length / amount;
	for (var i = 0; i < amount; i++) {
		chr = word.charCodeAt(i);
		for (var j = 2; j <= multiple; j++)
			chr ^= word.charCodeAt(j * amount - amount + i);
		chr = (chr ^ (i + 1) * (i + 1) ^ xor) % 36;
		if (chr < 10)
			chr += 48;
		else
			chr += 55;
		result += String.fromCharCode(chr);
	}
	return result;
}

function encodeTwoChars(word) {
	word = word.toLowerCase();
	var chr, sum = 0, result;
	for (var i = 0; i < word.length; i++) {
		chr = word.charCodeAt(i);
		if (chr == 32) chr = 0;
		sum += chr;
	}
	result = ('0' + (sum % 256).toString(16)).slice(-2);
	return result.toUpperCase();
}

function encodeLong(longNumber) {
	var strNum = longNumber.toString(), result = '', chr;
	for (var i = 0; i < strNum.length; i++) {
		chr = strNum.charCodeAt(i);
		if (48 <= chr && chr <= 57) {
			chr += (chr % 2 == 0) ? 32 : 16;
		}
		result += String.fromCharCode(chr);
	}
	var halfLen = ~~(result.length / 2);
	return result.substring(halfLen) + result.substring(0, halfLen);
}

function decodeString(decodedNumber) {
	var halfLen = ~~(decodedNumber.length / 2);
	var tmp = decodedNumber.substring(decodedNumber.length - halfLen) +	decodedNumber.substring(0, decodedNumber.length - halfLen);
	var result = '', chr;
	for (var i = 0; i < tmp.length; i++) {
		chr = tmp.charCodeAt(i);
		if (65 <= chr && chr <= 90) {
			chr -= (chr % 2 == 0) ? 32 : 16;
		}
		result += String.fromCharCode(chr);
	}
	return parseInt(result);
}
