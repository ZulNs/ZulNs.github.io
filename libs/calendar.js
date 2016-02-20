
/*********************************************
 * Hijri - Gregorian Date Picker             *
 *                                           *
 * Design by ZulNs @Yogyakarta, January 2016 *
 *********************************************/

function Calendar(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate, year, month, date) {
	if (typeof HijriDate === 'undefined') throw new Error('HijriDate() class is required!');
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	isAutoHide = (isAutoHide === undefined) ? true : !!isAutoHide;
	isAutoSelectedDate = !!isAutoSelectedDate;
	
	var self = this,
		thisDate = isHijriMode ? new HijriDate() : new Date(),
		selectedDate = isHijriMode ? new HijriDate() : new Date(),
		currentYear = thisDate.getFullYear(),
		currentMonth = thisDate.getMonth(),
		currentDate = thisDate.getDate(),
		isHidden = true,
		isSettingsHidden = true,
		isExtraButtonsInvisible = true,
		isDisableCallback = false,
		isAbsolutePosition = false,
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
		changeExtraButtonsVisibilityElement = document.createElement('div'),
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
		isHijriMode = !isHijriMode;
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
		if (typeof this.callback === 'function' && !isDisableCallback) this.callback();
	};
	
	this.changeFirstDayOfWeek = function() {
		firstDayOfWeek ^= 1;
		recreateWeekdayRow();
		setFirstDayOfWeekAppearance();
	};
	
	this.changeAutoHide = function() {
		isAutoHide = !isAutoHide;
		setAutoHideAppearance();
	};
	
	this.changeAutoSelectedDate = function() {
		if (isAutoHide) return;
		isAutoSelectedDate = !isAutoSelectedDate;
		setAutoSelectedDateAppearance();
	};
	
	this.getDate = function() {
		return selectedDate;
	};
	
	this.getTime = function() {
		return selectedDate.getTime();
	};
	
	this.isHijriMode = function() {
		return isHijriMode;
	};
	
	this.firstDayOfWeek = function() {
		return firstDayOfWeek;
	};
	
	this.isAutoHide = function() {
		return isAutoHide;
	};
	
	this.isAutoSelectedDate = function() {
		return isAutoSelectedDate;
	};
	
	this.isHidden = function() {
		return isHidden;
	};
	
	this.callback;
	
	this.disableCallback = function(cb) {
		isDisableCallback = !!cb;
	};
	
	this.setAbsolutePosition = function(pos) {
		isAbsolutePosition = !!pos;
		setCalendarPosition();
	};
	
	this.calendarElement = function() {
		return calendarElement;
	};
	
	this.show = function() {
		if (isHidden) {
			isHidden = false;
			Calendar.hideElement(calendarElement, isHidden);
		}
	};
	
	this.hide = function() {
		if (!isHidden) {
			if (!isSettingsHidden) {
				isSettingsHidden = true;
				setShowSettingsAppearance();
			}
			isHidden = true;
			Calendar.hideElement(calendarElement, isHidden);
		}
	};
	
	this.destroy = function() {
		selectedDate = null;
		thisDate = null;
		calendarElement.remove();
		self = null;
	};
	
	var setCalendarPosition = function() {
		if (isAbsolutePosition) {
			calendarElement.classList.remove('position-relative');
			calendarElement.classList.add('position-absolute');
		}
		else {
			calendarElement.classList.remove('position-absolute');
			calendarElement.classList.add('position-relative');
		}
	},
	
	setShowSettingsAppearance = function() {
		Calendar.hideElement(settingsRowElement, isSettingsHidden);
		showSettingsElement.title = (isSettingsHidden ? 'Show' : 'Hide') + ' menu settings bar';
		Calendar.markElement(showSettingsElement, !isSettingsHidden);
	},
	
	setDateModeAppearance = function() {
		changeDateModeElement.title = 'Change to ' + (isHijriMode ? 'Gregorian' : 'Hijri') + ' Calendar';
		Calendar.markElement(changeDateModeElement, isHijriMode);
	},
	
	setFirstDayOfWeekAppearance = function() {
		changeFirstDayOfWeekElement.title = 'Set ' + thisDate.getDayName(firstDayOfWeek ^ 1) + ' as first day of week';
		Calendar.markElement(changeFirstDayOfWeekElement, !!firstDayOfWeek);
	},
	
	setAutoHideAppearance = function() {
		changeAutoHideElement.title = (isAutoHide ? 'Disable' : 'Enable') + ' auto hide calendar on select date';
		Calendar.markElement(changeAutoHideElement, isAutoHide);
		if (isAutoHide && isAutoSelectedDate) {
			isAutoSelectedDate = false;
			setAutoSelectedDateAppearance();
		}
		Calendar.disableElement(changeAutoSelectedDateElement, isAutoHide);
	},
	
	setAutoSelectedDateAppearance = function() {
		changeAutoSelectedDateElement.title = (isAutoSelectedDate ? 'Disable' : 'Enable') + ' auto selected date on change at year or month values';
		Calendar.markElement(changeAutoSelectedDateElement, isAutoSelectedDate);
	},
	
	setExtraButtonsVisibilityAppearance = function() {
		changeExtraButtonsVisibilityElement.title = (isExtraButtonsInvisible ? 'Show' : 'Hide') + ' extra buttons to adjust year value';
		Calendar.markElement(changeExtraButtonsVisibilityElement, !isExtraButtonsInvisible);
		Calendar.concealElement(dec100YearElement, isExtraButtonsInvisible);
		Calendar.concealElement(dec10YearElement, isExtraButtonsInvisible);
		Calendar.concealElement(inc10YearElement, isExtraButtonsInvisible);
		Calendar.concealElement(inc100YearElement, isExtraButtonsInvisible);
	},
	
	setDateParams = function(setYear, setMonth, setDate) {
		setYear = Calendar.parseInt(setYear, 1);
		setMonth = Calendar.parseInt(setMonth, 0);
		setDate = Calendar.parseInt(setDate, 1);
		selectedDate.setFullYear(setYear);
		selectedDate.setMonth(setMonth);
		selectedDate.setDate(setDate);
		thisDate.setTime(selectedDate.getTime());
		thisDate.setDate(1);
	},
	
	createCalendar =  function() {
		var header = document.createElement('div');
		calendarElement.classList.add('calendar');
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
		settingsRowElement.classList.add('setting-row');
		changeDateModeElement.classList.add('setting-button');
		changeFirstDayOfWeekElement.classList.add('setting-button');
		changeAutoHideElement.classList.add('setting-button');
		changeAutoSelectedDateElement.classList.add('setting-button');
		changeExtraButtonsVisibilityElement.classList.add('setting-button');
		hideSettingsElement.classList.add('setting-button');
		hideCalendarElement.classList.add('setting-button');
		weekdayRowElement.classList.add('weekday-row');
		dateGridElement.classList.add('date-grid');
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
		changeExtraButtonsVisibilityElement.innerHTML = '«»';
		hideSettingsElement.innerHTML = '\u2714';
		hideSettingsElement.title = 'Hide menu settings bar';
		hideCalendarElement.innerHTML = '\u2715';
		hideCalendarElement.title = 'Hide calendar';
		setCalendarPosition();
		setShowSettingsAppearance();
		setDateModeAppearance();
		setFirstDayOfWeekAppearance();
		setAutoSelectedDateAppearance();
		setAutoHideAppearance();
		setExtraButtonsVisibilityAppearance();
		Calendar.hideElement(calendarElement, isHidden);
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
		addEvent(changeExtraButtonsVisibilityElement, 'click', onChangeExtraButtonsVisibility),
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
		settingsRowElement.appendChild(changeExtraButtonsVisibilityElement);
		settingsRowElement.appendChild(hideSettingsElement);
		settingsRowElement.appendChild(hideCalendarElement);
		createWeekdayRow();
		calendarElement.appendChild(header);
		calendarElement.appendChild(settingsRowElement);
		calendarElement.appendChild(weekdayRowElement);
		calendarElement.appendChild(dateGridElement);
		createDateGrid();
	},
	
	changeCalendarMode = function() {
		for (var i = 0; i < 12; i++) monthElement.options[i].text = thisDate.getMonthName(i);
		recreateWeekdayRow();
	},
	
	recreateWeekdayRow = function() {
		while (weekdayRowElement.firstChild) weekdayRowElement.removeChild(weekdayRowElement.firstChild);
		createWeekdayRow();
		recreateDateGrid();
	},
	
	createWeekdayRow = function() {
		for (var i = 0; i < 7; i++) {
			var day = document.createElement('div'),
				wd = (i + firstDayOfWeek) % 7,
				cl = wd === 5 ? 'friday-date' : wd === 0 ? 'sunday-date' : 'normal-date';
			day.innerHTML = thisDate.getDayShortName(wd);
			day.classList.add(cl);
			weekdayRowElement.appendChild(day);
		}
	},
	
	recreateDateGrid = function() {
		while (dateGridElement.firstChild) dateGridElement.removeChild(dateGridElement.firstChild);
		createDateGrid();
	},
	
	createDateGrid = function() {
		monthElement.selectedIndex = thisDate.getMonth();
		yearElement.value = thisDate.getFullYear();
		var cdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() - 1);
		var pdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() + 1);
		var fdim = thisDate.getDay(), pxd = fdim - firstDayOfWeek;
		if (pxd < 0) pxd += 7;
		var nxd = (pxd + cdim) % 7;
		if (nxd > 0) nxd = 7 - nxd;
		for (var i = pdim - pxd + 1; i <= pdim; i++) {
			var de = document.createElement('div');
			de.classList.add('excluded-date');
			de.innerHTML = i;
			dateGridElement.appendChild(de);
		}
		var wd, sd;
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
	},
	
	updateCalendar = function() {
		if (isAutoSelectedDate) {
			var dim = thisDate.getDaysInMonth(),
				dt = selectedDate.getDate();
			selectedDate.setTime(thisDate.getTime());
			selectedDate.setDate(dt > dim ? dim : dt);
			recreateDateGrid();
			if (typeof self.callback === 'function' && !isDisableCallback) self.callback();
		}
		else recreateDateGrid();
	},
	
	changeSelectedDate = function(target) {
		var prevElm = dateGridElement.getElementsByClassName('selected-date')[0];
		if (target === prevElm) return false;
		if (prevElm) prevElm.classList.remove('selected-date');
		target.classList.add('selected-date');
		return true;
	},
	
	addEvent = function(elm, evt, callback) {
		if (hasEventListeners) elm.addEventListener(evt, callback);
		else elm.attachEvent('on' + evt, callback);
	},
		
	onChangeDate = function(evt) {
		evt = evt || window.event;
		var target = evt.target || evt.srcElement;
		if (!target) return;
		if (changeSelectedDate(target)) {
			if (isAutoHide) self.hide();
			selectedDate.setTime(thisDate.getTime());
			selectedDate.setDate(parseInt(target.innerHTML));
			if (typeof self.callback === 'function' && !isDisableCallback) self.callback();
		}
		return returnEvent(evt);
	},
	
	onDecrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onChangeMonth = function() {
		thisDate.setMonth(parseInt(monthElement.value));
		updateCalendar();
	},
	
	onIncrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onDecrement100Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 100);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onDecrement10Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 10);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onDecrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onChangeYear = function() {
		var y = parseInt(yearElement.value);
		if (isNaN(y)) {
			yearElement.value = thisDate.getFullYear();
			return;
		}
		if (y != thisDate.getFullYear()) {
			thisDate.setFullYear(y);
			updateCalendar();
		}
	},
	
	onIncrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrement10Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 10);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrement100Year = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 100);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onChangeSettingsShow = function(evt) {
		evt = evt || window.event;
		isSettingsHidden = !isSettingsHidden;
		setShowSettingsAppearance();
		return returnEvent(evt);
	},
	
	onChangeDateMode = function(evt) {
		evt = evt || window.event;
		self.changeDateMode();
		return returnEvent(evt);
	},
	
	onChangeFirstDayOfWeek = function(evt) {
		evt = evt || window.event;
		self.changeFirstDayOfWeek();
		return returnEvent(evt);
	},
	
	onChangeAutoHide = function(evt) {
		evt = evt || window.event;
		self.changeAutoHide();
		return returnEvent(evt);
	},
	
	onChangeAutoSelectedDate = function(evt) {
		evt = evt || window.event;
		self.changeAutoSelectedDate();
		return returnEvent(evt);
	},
	
	onChangeExtraButtonsVisibility = function(evt) {
		evt = evt || window.event;
		isExtraButtonsInvisible = !isExtraButtonsInvisible;
		setExtraButtonsVisibilityAppearance();
		return returnEvent(evt);
	},
	
	onHideCalendar = function(evt) {
		evt = evt || window.event;
		self.hide();
		return returnEvent(evt);
	},
	
	returnEvent = function(evt) {
		if (evt.stopPropagation) evt.stopPropagation();
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
};

Calendar.hideElement = function(target, mode) {
	Calendar.addOrRemoveClass(target, mode, 'hidden');
};

Calendar.markElement = function(target, mode) {
	Calendar.addOrRemoveClass(target, mode, 'active');
};

Calendar.disableElement = function(target, mode) {
	Calendar.addOrRemoveClass(target, mode, 'disabled');
};

Calendar.concealElement = function(target, mode) {
	Calendar.addOrRemoveClass(target, mode, 'invisible');
};

Calendar.addOrRemoveClass = function(target, addFlag, className) {
	if (addFlag) target.classList.add(className);
	else target.classList.remove(className);
};
