
/*********************************************
 * Hijri - Gregorian Date Picker             *
 *                                           *
 * Design by ZulNs @Yogyakarta, January 2016 *
 *********************************************/

function Calendar(isHijri, firstDay, year, month, date) {
	isHijri = !!isHijri;
	firstDay = Math.abs(~~firstDay);
	if (firstDay > 1) firstDay = 1;
	var currentDate;
	if (typeof year === 'undefined')
		currentDate = isHijri ? new HijriDate() : new Date();
	else {
		year = ~~year;
		month = ~~month;
		date = ~~date;
		currentDate = isHijri ? new HijriDate(year, month, date) : new Date(year, month, date);
	}
	year = currentDate.getFullYear();
	month = currentDate.getMonth();
	date = currentDate.getDate();
	var self = this,
		isHidden = false,
		hasEventListeners = !!window.addEventListener,
		calendarElement = document.createElement('div'),
		prevYearElement = document.createElement('div'),
		prevMonthElement = document.createElement('div'),
		monthElement = document.createElement('select'),
		yearElement = document.createElement('input'),
		nextMonthElement = document.createElement('div'),
		nextYearElement = document.createElement('div'),
		weekdayRowElement = document.createElement('div'),
		dateGridElement = document.createElement('div');
	
	this.setTime = function(time) {
		currentDate.setTime(parseInt(time));
		var y = currentDate.getFullYear(),
			m = currentDate.getMonth(),
			d = currentDate.getDate();
		if (!!(y ^ year || m ^ month)) {
			year = y;
			month = m;
			date = d;
			recreateDateGrid();			
		}
		else
			changeDate(d);
	};
	
	this.setFirstDayOfWeek = function(fdw) {
		fdw = Math.abs(~~fdw);
		if (fdw > 1) fdw = 1;
		if (fdw !== firstDay) {
			firstDay = fdw;
			recreateWeekdayRow();
		}
	};
	
	this.getFirstDayOfWeek = function() {
		return firstDay;
	};
	
	this.getTime = function() {
		return currentDate.getTime();
	};
	
	this.getDate = function() {
		return currentDate;
	};
	
	this.callback;
	
	this.calendarElement = function() {
		return calendarElement;
	};
	
	this.show = function() {
		if (isHidden) {
			calendarElement.classList.remove('hidden');
			isHidden = false;
		}
	};
	
	this.hide = function() {
		if (!isHidden) {
			calendarElement.classList.add('hidden');
			isHidden = true;
		}
	};
	
	this.destroy = function() {
		currentCalendar = null;
		calendarElement.remove();
		self = null;
	}
	
	var createCalendar =  function() {
		var header = document.createElement('div');
		header.classList.add('header-row');
		prevYearElement.classList.add('header-button');
		prevMonthElement.classList.add('header-button');
		nextMonthElement.classList.add('header-button');
		nextYearElement.classList.add('header-button');
		monthElement.classList.add('header-month');
		yearElement.classList.add('header-year');
		yearElement.setAttribute('type', 'text');
		dateGridElement.classList.add('date-grid');
		calendarElement.classList.add('calendar');
		prevYearElement.innerHTML = '«';
		prevMonthElement.innerHTML = '‹';
		nextMonthElement.innerHTML = '›';
		nextYearElement.innerHTML = '»';
		addEvent(prevYearElement, 'click', onDecrementYear);
		addEvent(prevMonthElement, 'click', onDecrementMonth);
		addEvent(monthElement, 'change', onChangeMonth);
		addEvent(yearElement, 'change', onChangeYear);
		addEvent(nextMonthElement, 'click', onIncrementMonth);
		addEvent(nextYearElement, 'click', onIncrementYear);
		for (var i = 0; i < 12; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.text = currentDate.getMonthName(i);
			monthElement.appendChild(opt);
		}
		header.appendChild(prevYearElement);
		header.appendChild(prevMonthElement);
		header.appendChild(monthElement);
		header.appendChild(yearElement);
		header.appendChild(nextMonthElement);
		header.appendChild(nextYearElement);
		weekdayRowElement.classList.add('weekday-row');
		createWeekdayRow();
		calendarElement.appendChild(header);
		calendarElement.appendChild(weekdayRowElement);
		calendarElement.appendChild(dateGridElement);
		createDateGrid();
	};
	
	var recreateWeekdayRow = function() {
		while (weekdayRowElement.firstChild)
			weekdayRowElement.removeChild(weekdayRowElement.firstChild);
		createWeekdayRow();
		recreateDateGrid();
	};
	
	var createWeekdayRow = function() {
		for (var i = 0; i < 7; i++) {
			var day = document.createElement('div');
			var wd = (i + firstDay) % 7;
			var cl = (wd === 5) ? 'friday-date' : (wd === 0) ? 'sunday-date' : 'normal-date';
			day.innerHTML = currentDate.getDayShortName(wd);
			day.classList.add(cl);
			weekdayRowElement.appendChild(day);
		}
	};
	
	var recreateDateGrid = function() {
		while (dateGridElement.firstChild)
			dateGridElement.removeChild(dateGridElement.firstChild);
		createDateGrid();
	};
	
	var createDateGrid = function() {
		monthElement.selectedIndex = month;
		yearElement.value = year;
		var cdim = currentDate.getDaysInMonth();
		currentDate.setDate(1);
		currentDate.setMonth(month - 1);
		var pdim = currentDate.getDaysInMonth();
		currentDate.setFullYear(year);
		currentDate.setMonth(month);
		currentDate.setDate(date);
		var cwd = currentDate.getDay();
		var swd = (cwd + 8 - date % 7) % 7;
		var fdim = (firstDay && !swd) ? 7 : swd;
		var prd = fdim - firstDay;
		var td = prd + cdim;
		var tw = parseInt(td / 7) + ((td % 7) ? 1 : 0);
		var nrd = tw * 7 - cdim - prd;
		for (var i = pdim - prd + 1; i <= pdim; i++) {
			var de = document.createElement('div');
			de.classList.add('excluded-date');
			de.innerHTML = i;
			dateGridElement.appendChild(de);
		}
		for (var i = 1; i <= cdim; i++) {
			var de = document.createElement('div');
			de.innerHTML = i;
			var wd = (swd + i - 1) % 7;
			de.classList.add('normal-date')
			if (wd === 5) de.classList.add('friday-date');
			if (wd === 0) de.classList.add('sunday-date');
			if (i === date) de.classList.add('selected-date');
			addEvent(de, 'click', onChangeDate);
			dateGridElement.appendChild(de);
		}
		for (var i = 1; i <= nrd; i++) {
			var de = document.createElement('div');
			de.classList.add('excluded-date');
			de.innerHTML = i;
			dateGridElement.appendChild(de);
		}
	};
	
	var changeSelectedDate = function(target) {
		var prevElm = dateGridElement.getElementsByClassName('selected-date')[0];
		if (target === prevElm) return false;
		prevElm.classList.remove('selected-date');
		target.classList.add('selected-date');
		return true;
	};
	
	var changeDate = function(dt) {
		var nodes = dateGridElement.getElementsByClassName('normal-date');
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].innerHTML == dt) {
				if (changeSelectedDate(nodes[i])) date = dt;
			}
		}
	};
	
	var addEvent = function(elm, evt, callback) {
		if (hasEventListeners)
			elm.addEventListener(evt, callback);
		else
			elm.attachEvent('on' + evt, callback);
	};
	
	var onChangeDate = function(evt) {
		evt = evt || window.event;
		var target = evt.target || evt.srcElement;
		if (!target) return;
		if (changeSelectedDate(target)) {
			date = parseInt(target.innerHTML);
			currentDate.setDate(date);
			if (typeof self.callback === 'function') self.callback();
		}
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	var updateCalendar = function() {
		var dim = currentDate.getDaysInMonth();
		if (date > dim) date = dim;
		currentDate.setDate(date);
		month = currentDate.getMonth();
		year = currentDate.getFullYear();
		recreateDateGrid();
		if (typeof self.callback === 'function') self.callback();
	};
	
	var onIncrementMonth = function(evt) {
		evt = evt || window.event;
		currentDate.setDate(1);
		currentDate.setMonth(month + 1);
		updateCalendar();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	var onDecrementMonth = function(evt) {
		evt = evt || window.event;
		currentDate.setDate(1);
		currentDate.setMonth(month - 1);
		updateCalendar();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	var onIncrementYear = function(evt) {
		evt = evt || window.event;
		currentDate.setDate(1);
		currentDate.setFullYear(year + 1);
		updateCalendar();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	var onDecrementYear = function(evt) {
		evt = evt || window.event;
		currentDate.setDate(1);
		currentDate.setFullYear(year - 1);
		updateCalendar();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	var onChangeMonth = function() {
		currentDate.setDate(1);
		month = parseInt(monthElement.value);
		currentDate.setMonth(month);
		var dim = currentDate.getDaysInMonth();
		if (date > dim) date = dim;
		currentDate.setDate(date);
		recreateDateGrid();
		if (typeof self.callback === 'function') self.callback();
	};
	
	var onChangeYear = function() {
		var y = yearElement.value;
		if (isNaN(y)) {
			yearElement.value = year;
			return;
		}
		if (y != year) {
			year = y;
			currentDate.setFullYear(y);
			recreateDateGrid();
			if (typeof self.callback === 'function') self.callback();
		}
	};
	
	createCalendar();
}
