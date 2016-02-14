
/*********************************************
 * Hijri - Gregorian Date Picker             *
 *                                           *
 * Design by ZulNs @Yogyakarta, January 2016 *
 *********************************************/

function Calendar(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate,year, month, date) {
	isHijriMode = !!isHijriMode;
	if (firstDayOfWeek === undefined) firstDayOfWeek = 1;
	else firstDayOfWeek = ~~firstDayOfWeek;
	isAutoHide = !!isAutoHide;
	isAutoSelectedDate = !!isAutoSelectedDate;
	
	var self = this,
		thisDate = isHijriMode ? new HijriDate() : new Date(),
		selectedDate = isHijriMode ? new HijriDate() : new Date(),
		currentYear = thisDate.getFullYear(),
		currentMonth = thisDate.getMonth(),
		currentDate = thisDate.getDate(),
		isHidden = false,
		isSettingsHidden = true,
		hasEventListeners = !!window.addEventListener,
		calendarElement = document.createElement('div'),
		prevMonthElement = document.createElement('div'),
		monthElement = document.createElement('select'),
		nextMonthElement = document.createElement('div'),
		dec100YearElement = document.createElement('div'),
		dec10YearElement = document.createElement('div'),
		prevYearElement = document.createElement('div'),
		yearElement = document.createElement('input'),
		nextYearElement = document.createElement('div'),
		inc10YearElement = document.createElement('div'),
		inc100YearElement = document.createElement('div'),
		showSettingsElement = document.createElement('div'),
		settingsRowElement = document.createElement('div'),
		changeDateModeElement = document.createElement('div'),
		changeFirstDayOfWeekElement = document.createElement('div'),
		changeAutoHideElement = document.createElement('div'),
		changeAutoSelectedDateElement = document.createElement('div'),
		hideSettingsElement = document.createElement('div'),
		hideCalendarElement = document.createElement('div'),
		weekdayRowElement = document.createElement('div'),
		dateGridElement = document.createElement('div');
	
	this.setDate = function(setYear, setMonth, setDate) {
		setDateParams(setYear, setMonth, setDate);
		recreateDateGrid();
	};
	
	this.setTime = function(time) {
		selectedDate.setTime(time);
		thisDate.setTime(time);
		thisDate.setDate(1);
		recreateDateGrid();
	};
	
	this.changeDateMode = function() {
		isHijriMode ^= true;
		thisDate = isHijriMode ? new HijriDate() : new Date();
		currentYear = thisDate.getFullYear();
		currentMonth = thisDate.getMonth();
		currentDate = thisDate.getDate();
		thisDate.setTime(selectedDate.getTime());
		selectedDate = isHijriMode ? new HijriDate(thisDate.getTime()) : new Date(thisDate.getTime());
		thisDate.setDate(1);
		changeCalendarMode();
		setDateModeAppearance();
		setFirstDayOfWeekAppearance();
		if (typeof this.callback === 'function') this.callback();
	};
	
	this.changeFirstDayOfWeek = function() {
		firstDayOfWeek ^= 1;
		recreateWeekdayRow();
		setFirstDayOfWeekAppearance();
	};
	
	this.changeAutoHide = function() {
		isAutoHide ^= true;
		setAutoHideAppearance();
	};
	
	this.changeAutoSelectedDate = function() {
		if (isAutoHide) return;
		isAutoSelectedDate ^= true;
		setAutoSelectedDateAppearance();
	};
	
	this.getDate = function() {
		return selectedDate;
	};
	
	this.getTime = function() {
		return selectedDate.getTime();
	};
	
	this.getDateMode = function() {
		return isHijriMode;
	};
	
	this.getFirstDayOfWeek = function() {
		return firstDayOfWeek;
	};
	
	this.getAutoHide = function() {
		return isAutoHide;
	};
	
	this.getAutoSelectedDate = function() {
		return isAutoSelectedDate;
	};
	
	this.callback;
	
	this.calendarElement = function() {
		return calendarElement;
	};
	
	this.show = function() {
		if (isHidden) {
			isHidden = false;
			hideElement(calendarElement, isHidden);
		}
	};
	
	this.hide = function() {
		if (!isHidden) {
			isHidden = true;
			hideElement(calendarElement, isHidden);
		}
	};
	
	this.destroy = function() {
		selectedDate = null;
		thisDate = null;
		calendarElement.remove();
		self = null;
	};
	
	var setShowSettingsAppearance = function() {
		hideElement(settingsRowElement, isSettingsHidden);
		showSettingsElement.title = (isSettingsHidden ? 'Show' : 'Hide') + ' menu settings bar';
		markElement(showSettingsElement, !isSettingsHidden);
	};
	
	var setDateModeAppearance = function() {
		changeDateModeElement.title = 'Change to ' + (isHijriMode ? 'Gregorian' : 'Hijri') + ' Calendar';
		markElement(changeDateModeElement, isHijriMode);
	};
	
	var setFirstDayOfWeekAppearance = function() {
		changeFirstDayOfWeekElement.title = 'Set ' + thisDate.getDayName(firstDayOfWeek ^ 1) + ' as first day of week';
		markElement(changeFirstDayOfWeekElement, !!firstDayOfWeek);
	};
	
	var setAutoHideAppearance = function() {
		changeAutoHideElement.title = (isAutoHide ? 'Disable' : 'Enable') + ' auto hide calendar on select date';
		markElement(changeAutoHideElement, isAutoHide);
		if (isAutoHide && isAutoSelectedDate) {
			isAutoSelectedDate = false;
			setAutoSelectedDateAppearance();
		}
		disableElement(changeAutoSelectedDateElement, isAutoHide);
	};
	
	var setAutoSelectedDateAppearance = function() {
		changeAutoSelectedDateElement.title = (isAutoSelectedDate ? 'Disable' : 'Enable') + ' auto selected date on change at year or month values';
		markElement(changeAutoSelectedDateElement, isAutoSelectedDate);
	};
	
	var hideElement = function(target, mode) {
		if (mode) target.classList.add('hidden');
		else target.classList.remove('hidden')
	};
	
	var markElement = function(target, mode) {
		if (mode) target.classList.add('active');
		else target.classList.remove('active');
	};
	
	var disableElement = function(target, mode) {
		if (mode) target.classList.add('disabled');
		else target.classList.remove('disabled');
	};
	
	var setDateParams = function(setYear, setMonth, setDate) {
		setYear = Calendar.parseInt(setYear, 1);
		setMonth = Calendar.parseInt(setMonth, 0);
		setDate = Calendar.parseInt(setDate, 1);
		selectedDate.setFullYear(setYear);
		selectedDate.setMonth(setMonth);
		selectedDate.setDate(setDate);
		thisDate.setTime(selectedDate.getTime());
		thisDate.setDate(1);
	};
	
	var createCalendar =  function() {
		var header = document.createElement('div');
		header.classList.add('header-row');
		prevMonthElement.classList.add('header-button');
		monthElement.classList.add('month-field');
		nextMonthElement.classList.add('header-button');
		dec100YearElement.classList.add('header-button');
		dec10YearElement.classList.add('header-button');
		prevYearElement.classList.add('header-button');
		yearElement.classList.add('year-field');
		yearElement.setAttribute('type', 'text');
		nextYearElement.classList.add('header-button');
		inc10YearElement.classList.add('header-button');
		inc100YearElement.classList.add('header-button');
		showSettingsElement.classList.add('header-button');
		settingsRowElement.classList.add('settings-row');
		changeDateModeElement.classList.add('settings-button');
		changeFirstDayOfWeekElement.classList.add('settings-button');
		changeAutoHideElement.classList.add('settings-button');
		changeAutoSelectedDateElement.classList.add('settings-button');
		hideSettingsElement.classList.add('settings-button');
		hideCalendarElement.classList.add('settings-button');
		weekdayRowElement.classList.add('weekday-row');
		dateGridElement.classList.add('date-grid');
		calendarElement.classList.add('calendar');
		prevMonthElement.innerHTML = '-';
		prevMonthElement.title = 'Decrement month value by 1';
		nextMonthElement.innerHTML = '+';
		nextMonthElement.title = 'Increment month value by 1';
		dec100YearElement.innerHTML = '«';
		dec100YearElement.title = 'Decrement year value by 100';
		dec10YearElement.innerHTML = '‹';
		dec10YearElement.title = 'Decrement year value by 10';
		prevYearElement.innerHTML = '-';
		prevYearElement.title = 'Decrement year value by 1';
		nextYearElement.innerHTML = '+';
		nextYearElement.title = 'Increment year value by 1';
		inc10YearElement.innerHTML = '›';
		inc10YearElement.title = 'Increment year value by 10';
		inc100YearElement.innerHTML = '»';
		inc100YearElement.title = 'Increment year value by 100';
		showSettingsElement.innerHTML = '\u2699';
		changeDateModeElement.innerHTML = '\u262a';
		changeFirstDayOfWeekElement.innerHTML = '\u2693';
		changeAutoHideElement.innerHTML = '\u2690';
		changeAutoSelectedDateElement.innerHTML = '\u26cf';
		hideSettingsElement.innerHTML = '\u2714';
		hideSettingsElement.title = 'Hide menu settings bar';
		hideCalendarElement.innerHTML = '\u2715';
		hideCalendarElement.title = 'Hide calendar';
		setShowSettingsAppearance();
		setDateModeAppearance();
		setFirstDayOfWeekAppearance();
		setAutoSelectedDateAppearance();
		setAutoHideAppearance();
		addEvent(prevMonthElement, 'click', onDecrementMonth);
		addEvent(monthElement, 'change', onChangeMonth);
		addEvent(nextMonthElement, 'click', onIncrementMonth);
		addEvent(dec100YearElement, 'click', onDecrement100Year);
		addEvent(dec10YearElement, 'click', onDecrement10Year);
		addEvent(prevYearElement, 'click', onDecrementYear);
		addEvent(yearElement, 'change', onChangeYear);
		addEvent(nextYearElement, 'click', onIncrementYear);
		addEvent(inc10YearElement, 'click', onIncrement10Year);
		addEvent(inc100YearElement, 'click', onIncrement100Year);
		addEvent(showSettingsElement, 'click', onChangeSettingsShow);
		addEvent(changeDateModeElement, 'click', onChangeDateMode);
		addEvent(changeFirstDayOfWeekElement, 'click', onChangeFirstDayOfWeek);
		addEvent(changeAutoHideElement, 'click', onChangeAutoHide);
		addEvent(changeAutoSelectedDateElement, 'click', onChangeAutoSelectedDate);
		addEvent(hideSettingsElement, 'click', onChangeSettingsShow);
		addEvent(hideCalendarElement, 'click', onHideCalendar);
		for (var i = 0; i < 12; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.text = thisDate.getMonthName(i);
			monthElement.appendChild(opt);
		}
		header.appendChild(prevMonthElement);
		header.appendChild(monthElement);
		header.appendChild(nextMonthElement);
		header.appendChild(dec100YearElement);
		header.appendChild(dec10YearElement);
		header.appendChild(prevYearElement);
		header.appendChild(yearElement);
		header.appendChild(nextYearElement);
		header.appendChild(inc10YearElement);
		header.appendChild(inc100YearElement);
		header.appendChild(showSettingsElement);
		settingsRowElement.appendChild(changeDateModeElement);
		settingsRowElement.appendChild(changeFirstDayOfWeekElement);
		settingsRowElement.appendChild(changeAutoHideElement);
		settingsRowElement.appendChild(changeAutoSelectedDateElement);
		settingsRowElement.appendChild(hideSettingsElement);
		settingsRowElement.appendChild(hideCalendarElement);
		createWeekdayRow();
		calendarElement.appendChild(header);
		calendarElement.appendChild(settingsRowElement);
		calendarElement.appendChild(weekdayRowElement);
		calendarElement.appendChild(dateGridElement);
		createDateGrid();
	};
	
	var changeCalendarMode = function() {
		for (var i = 0; i < 12; i++) monthElement.options[i].text = thisDate.getMonthName(i);
		recreateWeekdayRow();
	};
	
	var recreateWeekdayRow = function() {
		while (weekdayRowElement.firstChild) weekdayRowElement.removeChild(weekdayRowElement.firstChild);
		createWeekdayRow();
		recreateDateGrid();
	};
	
	var createWeekdayRow = function() {
		for (var i = 0; i < 7; i++) {
			var day = document.createElement('div');
			var wd = (i + firstDayOfWeek) % 7;
			var cl = wd === 5 ? 'friday-date' : wd === 0 ? 'sunday-date' : 'normal-date';
			day.innerHTML = thisDate.getDayShortName(wd);
			day.classList.add(cl);
			weekdayRowElement.appendChild(day);
		}
	};
	
	var recreateDateGrid = function() {
		while (dateGridElement.firstChild) dateGridElement.removeChild(dateGridElement.firstChild);
		createDateGrid();
	};
	
	var createDateGrid = function() {
		monthElement.selectedIndex = thisDate.getMonth();
		yearElement.value = thisDate.getFullYear();
		var cdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() - 1);
		var pdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() + 1);
		var fdim = thisDate.getDay();
		var pxd = fdim - firstDayOfWeek;
		if (pxd < 0) pxd += 7;
		var nxd = (pxd + cdim) % 7;
		if (nxd > 0) nxd = 7 - nxd;
		for (var i = pdim - pxd + 1; i <= pdim; i++) {
			var de = document.createElement('div');
			de.classList.add('excluded-date');
			de.innerHTML = i;
			dateGridElement.appendChild(de);
		}
		var wd;
		var sd;
		for (var i = 1; i <= cdim; i++) {
			var de = document.createElement('div');
			de.innerHTML = i;
			wd = (fdim + i - 1) % 7;
			de.classList.add('normal-date')
			if (wd === 5) de.classList.add('friday-date');
			if (wd === 0) de.classList.add('sunday-date');
			if (thisDate.getFullYear() === currentYear && thisDate.getMonth() === currentMonth && i === currentDate) de.classList.add('current-date');
			if (thisDate.getFullYear() === selectedDate.getFullYear() && thisDate.getMonth() === selectedDate.getMonth() && i === selectedDate.getDate()) de.classList.add('selected-date');
			sd = (i - 1) * 864e5 + thisDate.getTime(); 
			if (265860e5 <= sd && sd < 266724e5) de.classList.add('specialz-date');
			addEvent(de, 'click', onChangeDate);
			dateGridElement.appendChild(de);
		}
		for (var i = 1; i <= nxd; i++) {
			var de = document.createElement('div');
			de.classList.add('excluded-date');
			de.innerHTML = i;
			dateGridElement.appendChild(de);
		}
	};
	
	var updateCalendar = function() {
		if (isAutoSelectedDate) {
			var dim = thisDate.getDaysInMonth();
			var dt = selectedDate.getDate();
			selectedDate.setTime(thisDate.getTime());
			selectedDate.setDate(dt > dim ? dim : dt);
			recreateDateGrid();
			if (typeof self.callback === 'function') self.callback();
		}
		else recreateDateGrid();
	};
	
	var changeSelectedDate = function(target) {
		var prevElm = dateGridElement.getElementsByClassName('selected-date')[0];
		if (target === prevElm) return false;
		if (prevElm) prevElm.classList.remove('selected-date');
		target.classList.add('selected-date');
		return true;
	};
	
	var addEvent = function(elm, evt, callback) {
		if (hasEventListeners) elm.addEventListener(evt, callback);
		else elm.attachEvent('on' + evt, callback);
	};
	
	var onChangeDate = function(evt) {
		evt = evt || window.event;
		var target = evt.target || evt.srcElement;
		if (!target) return;
		if (changeSelectedDate(target)) {
			if (isAutoHide) self.hide();
			selectedDate.setTime(thisDate.getTime());
			selectedDate.setDate(parseInt(target.innerHTML));
			if (typeof self.callback === 'function') self.callback();
		}
		return returnEvent(evt);
	};
	
	var onDecrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onChangeMonth = function() {
		thisDate.setMonth(parseInt(monthElement.value));
		updateCalendar();
	};
	
	var onIncrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onDecrement100Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 100);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onDecrement10Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 10);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onDecrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onChangeYear = function() {
		var y = parseInt(yearElement.value);
		if (isNaN(y)) {
			yearElement.value = thisDate.getFullYear();
			return;
		}
		if (y != thisDate.getFullYear()) {
			thisDate.setFullYear(y);
			updateCalendar();
		}
	};
	
	var onIncrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onIncrement10Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 10);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onIncrement100Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 100);
		updateCalendar();
		return returnEvent(evt);
	};
	
	var onChangeSettingsShow = function(evt) {
		evt = evt || window.event;
		isSettingsHidden ^= true;
		setShowSettingsAppearance();
		return returnEvent(evt);
	};
	
	var onChangeDateMode = function(evt) {
		evt = evt || window.event;
		self.changeDateMode();
		return returnEvent(evt);
	};
	
	var onChangeFirstDayOfWeek = function(evt) {
		evt = evt || window.event;
		self.changeFirstDayOfWeek();
		return returnEvent(evt);
	};
	
	var onChangeAutoHide = function(evt) {
		evt = evt || window.event;
		self.changeAutoHide();
		return returnEvent(evt);
	};
	
	var onChangeAutoSelectedDate = function(evt) {
		evt = evt || window.event;
		self.changeAutoSelectedDate();
		return returnEvent(evt);
	};
	
	var onHideCalendar = function(evt) {
		evt = evt || window.event;
		isSettingsHidden ^= true;
		setShowSettingsAppearance();
		self.hide();
		return returnEvent(evt);
	};
	
	var returnEvent = function(evt) {
		if (evt.preventDefault) evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	};
	
	if (year !== undefined) setDateParams(year, month, date);
	else {
		thisDate.setTime(selectedDate.getTime());
		thisDate.setDate(1);
	}
	createCalendar();
}

Calendar.parseInt = function(num, def) {
	var res = parseInt(num);
	return isNaN(res) ? def : res;
}
