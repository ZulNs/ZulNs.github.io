/*
 * Kalender Masehi/Hijriah
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 */

function Calendar(isHijriMode, firstDayOfWeek, year, month) {
	if (typeof HijriDate === 'undefined')
		throw new Error('Required HijriDate() class!');
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	
	var self = this,
	thisDate,
	currentYear,
	currentMonth,
	currentDate,
	isMenuDisplayed = false,
	isSmallScreen = (
					window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth
					) < 480,
	hasEventListeners = !!window.addEventListener,
	calendarElm = document.createElement('div'),
	yearValueElm = document.createElement('li'),
	monthValueElm = document.createElement('li'),
	weekdaysElm = document.createElement('ul'),
	daysElm = document.createElement('ul'),
	menuItemContainerElm = document.createElement('ul'),
	menuCalendarModeElm = document.createElement('a'),
	menuFirstDayOfWeekElm = document.createElement('a');
	
	createCalendar = function() {
		var rootMenuElm = document.createElement('nav'),
			rootMenuValueElm = document.createElement('a'),
			menuItem1Elm = document.createElement('li'),
			menuItem2Elm = document.createElement('li'),
			menuItem3Elm = document.createElement('li'),
			menuItem4Elm = document.createElement('li'),
			menuRefreshElm = document.createElement('a'),
			menuResetElm = document.createElement('a'),
			yearHeaderElm = document.createElement('ul'),
			prevYearContainerElm = document.createElement('li'),
			prevYearElm = document.createElement('a'),
			nextYearContainerElm = document.createElement('li'),
			nextYearElm = document.createElement('a'),
			monthHeaderElm = document.createElement('ul'),
			prevMonthContainerElm = document.createElement('li'),
			prevMonthElm = document.createElement('a'),
			nextMonthContainerElm = document.createElement('li'),
			nextMonthElm = document.createElement('a');
		// Construct the calendar
		menuItem1Elm.appendChild(menuCalendarModeElm);
		menuItem2Elm.appendChild(menuFirstDayOfWeekElm);
		menuItem3Elm.appendChild(menuRefreshElm);
		menuItem4Elm.appendChild(menuResetElm);
		menuItemContainerElm.appendChild(menuItem1Elm);
		menuItemContainerElm.appendChild(menuItem2Elm);
		menuItemContainerElm.appendChild(menuItem3Elm);
		menuItemContainerElm.appendChild(menuItem4Elm);
		rootMenuElm.appendChild(rootMenuValueElm);
		rootMenuElm.appendChild(menuItemContainerElm);
		prevYearContainerElm.appendChild(prevYearElm);
		nextYearContainerElm.appendChild(nextYearElm);
		yearHeaderElm.appendChild(prevYearContainerElm);
		yearHeaderElm.appendChild(nextYearContainerElm);
		yearHeaderElm.appendChild(yearValueElm);
		prevMonthContainerElm.appendChild(prevMonthElm);
		nextMonthContainerElm.appendChild(nextMonthElm);
		monthHeaderElm.appendChild(prevMonthContainerElm);
		monthHeaderElm.appendChild(nextMonthContainerElm);
		monthHeaderElm.appendChild(monthValueElm);
		calendarElm.appendChild(rootMenuElm);
		calendarElm.appendChild(yearHeaderElm);
		calendarElm.appendChild(monthHeaderElm);
		calendarElm.appendChild(weekdaysElm);
		calendarElm.appendChild(daysElm);
		// Add class
		calendarElm.classList.add('calendar-wrap');
		rootMenuElm.classList.add('menu');
		menuItemContainerElm.classList.add('menu-item');
		yearHeaderElm.classList.add('year');
		prevYearContainerElm.classList.add('prev');
		nextYearContainerElm.classList.add('next');
		monthHeaderElm.classList.add('month');
		prevMonthContainerElm.classList.add('prev');
		nextMonthContainerElm.classList.add('next');
		weekdaysElm.classList.add('weekdays');
		daysElm.classList.add('days');
		// Set href
		rootMenuValueElm.href = '#';
		prevYearElm.href = '#';
		menuCalendarModeElm.href = '#';
		menuFirstDayOfWeekElm.href = '#';
		menuRefreshElm.href = '#';
		menuResetElm.href = '#';
		nextYearElm.href = '#';
		prevMonthElm.href = '#';
		nextMonthElm.href = '#';
		// Set innerHTML
		//rootMenuValueElm.innerHTML = '&#x25bc;';
		rootMenuValueElm.innerHTML = '&#x2261;';
		//prevYearElm.innerHTML = '&#x276e;';
		//nextYearElm.innerHTML = '&#x276f;';
		prevYearElm.innerHTML = '&#x25c4;';
		nextYearElm.innerHTML = '&#x25ba;';
		prevMonthElm.innerHTML = '&#x25c4;';
		nextMonthElm.innerHTML = '&#x25ba;';
		menuRefreshElm.innerHTML = 'Refresh';
		menuResetElm.innerHTML = 'Reset';
		// Add event
		addEvent(window, 'resize', onResizeWindow);
		addEvent(prevMonthElm, 'click', onDecrementMonth);
		addEvent(nextMonthElm, 'click', onIncrementMonth);
		addEvent(prevYearElm, 'click', onDecrementYear);
		addEvent(nextYearElm, 'click', onIncrementYear);
		addEvent(rootMenuValueElm, 'click', onClickMenu);
		addEvent(menuItemContainerElm, 'click', onSelectMenuItem);
		addEvent(menuItemContainerElm, 'mouseleave', onUnhoverMenuItem);
		addEvent(menuItem1Elm, 'click', onChangeCalendarMode);
		addEvent(menuItem2Elm, 'click', onChangeFirstDayOfWeek);
		addEvent(menuItem3Elm, 'click', onRefresh);
		addEvent(menuItem4Elm, 'click', onReset);
		updateCalendarModeMenuLabel();
		updateHeader();
		createWeekdayGrids();
		createDayGrids();
	},
	
	updateCalendarModeMenuLabel = function() {
		menuCalendarModeElm.innerHTML = 'Kalender ' + (isHijriMode ? 'Masehi' : 'Hijriah');
	},
	
	updateHeader = function() {
		yearValueElm.innerHTML = thisDate.getFullYear() + (isHijriMode ? ' H' : ' M');
		monthValueElm.innerHTML = thisDate.getMonthName();
	},
	
	createWeekdayGrids = function() {
		for (var i = firstDayOfWeek; i < 7 + firstDayOfWeek; i++) {
			var day = document.createElement('li');
			day.innerHTML = isSmallScreen ?
				thisDate.getDayShortName(i % 7) :
				thisDate.getDayName(i % 7);
			if (i == 5)
				day.classList.add('friday');
			if (i % 7 == 0)
				day.classList.add('sunday');
			weekdaysElm.appendChild(day);
		}
		menuFirstDayOfWeekElm.innerHTML = 'Mulai ' + thisDate.getDayName(1 - firstDayOfWeek);
	},
	
	recreateWeekdayGrids = function() {
		while (weekdaysElm.firstChild)
			weekdaysElm.removeChild(weekdaysElm.firstChild);
		createWeekdayGrids();
	},
	
	createDayGrids = function() {
		var thisTime = thisDate.getTime(),
			ppdr = thisDate.getDay() - firstDayOfWeek;
		if (ppdr < 0)
			ppdr += 7;
		var pcdr = thisDate.getDaysInMonth();
		var pndr = (ppdr + pcdr) % 7;
		pndr = pndr > 0 ? 7 - pndr : 0;
		thisDate.setDate(1 - ppdr);
		var thatDate = isHijriMode ? thisDate.getGregorianDate() : thisDate.getHijriDate(),
			pdate = thisDate.getDate(),
			sdate = thatDate.getDate(),
			pdim = thisDate.getDaysInMonth(),
			sdim = thatDate.getDaysInMonth(),
			smsn = thatDate.getMonthShortName(),
			isFri = 6 - firstDayOfWeek,
			isSun = 1 - firstDayOfWeek;
		for (var i = 1; i <= ppdr + pcdr + pndr; i++) {
			var pde = document.createElement('li'),
				sde = document.createElement('span');
			sde.classList.add('footer-date');
			if (i <= ppdr || i > ppdr + pcdr) {
				pde.classList.add('inactive-date');
			}
			else {
				if (
						thisDate.getFullYear() == currentYear &&
						thisDate.getMonth() == currentMonth &&
						pdate == currentDate
					)
					pde.classList.add('current-date');
				if (thisTime == 262368e5 && pdate == 5)
					pde.classList.add('specialz-date');
				if (i % 7 == isFri)
					pde.classList.add('friday');
				if (i % 7 == isSun)
					pde.classList.add('sunday');
			}
			pde.innerHTML = pdate + '<br>';
			sde.innerHTML = sdate + ' ' + smsn;
			pde.appendChild(sde);
			daysElm.appendChild(pde);
			pdate++;
			if (pdate > pdim) {
				pdate = 1;
				thisDate.setDate(1);
				thisDate.setMonth(thisDate.getMonth() + 1);
				pdim = thisDate.getDaysInMonth();
			}
			sdate++;
			if (sdate > sdim) {
				sdate = 1;
				thatDate.setDate(1);
				thatDate.setMonth(thatDate.getMonth() + 1);
				sdim = thatDate.getDaysInMonth();
				smsn = thatDate.getMonthShortName();
			}
		}
		thisDate.setTime(thisTime);
	},
	
	recreateDayGrids = function() {
		while (daysElm.firstChild)
			daysElm.removeChild(daysElm.firstChild);
		createDayGrids();
	},
	
	updateCalendar = function() {
		updateHeader();
		recreateDayGrids();
	}
	
	onDecrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrementMonth = function(evt) {
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onDecrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrementYear = function(evt) {
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onClickMenu = function(evt) {
		evt = evt || window.event;
		isMenuDisplayed = !isMenuDisplayed;
		if (isMenuDisplayed)
			menuItemContainerElm.classList.add('show');
		else
			menuItemContainerElm.classList.remove('show');
		return returnEvent(evt);
	},
	
	onSelectMenuItem = function(evt) {
		evt = evt || window.event;
		isMenuDisplayed = false;
		menuItemContainerElm.classList.remove('show');
		return returnEvent(evt);
	},
	
	onUnhoverMenuItem = function(evt) {
		evt = evt || window.event;
		isMenuDisplayed = false;
		menuItemContainerElm.classList.remove('show');
		return returnEvent(evt);
	},
	
	onChangeCalendarMode = function(evt) {
		//evt = evt || window.event;
		self.setHijriMode(!isHijriMode);
		//return returnEvent(evt);
	},
	
	onChangeFirstDayOfWeek = function(evt) {
		//evt = evt || window.event;
		self.setFirstDayOfWeek(1 - firstDayOfWeek);
		//return returnEvent(evt);
	},
	
	onRefresh = function(evt) {
		//evt = evt || window.event;
		self.refresh();
		//return returnEvent(evt);
	},
	
	onReset = function(evt) {
		//evt = evt || window.event;
		self.reset();
		//return returnEvent(evt);
	},
	
	onResizeWindow = function(evt) {
		evt = evt || window.event;
		if (isSmallScreen && calendarElm.clientWidth >= 480 ||
			!isSmallScreen && calendarElm.clientWidth < 480) {
			isSmallScreen = !isSmallScreen;
			recreateWeekdayGrids();
		}
		return returnEvent(evt);
	},
	
	addEvent = function(elm, evt, callback) {
		if (elm == null || typeof(elm) == 'undefined')
			return;
		if (hasEventListeners)
			elm.addEventListener(evt, callback, false);
		else if (elm.attachEvent)
			elm.attachEvent('on' + evt, callback);
		else
			elm['on' + evt] = callback;
	},
	
	returnEvent = function(evt) {
		if (evt.stopPropagation)
			evt.stopPropagation();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	},
	
	getCurrentDate = function() {
		var nd = new Date();
		currentYear = nd.getFullYear();
		currentMonth = nd.getMonth();
		currentDate = nd.getDate();
		if (isHijriMode) {
			nd = new Date(currentYear, currentMonth, currentDate);
			nd = nd.getHijriDate();
			currentYear = nd.getFullYear();
			currentMonth = nd.getMonth();
			currentDate = nd.getDate();
		}
	};
	
	this.getElement = function() {
		return calendarElm;
	};
	
	this.setHijriMode = function(hm) {
		if ((hm == true || hm == false) && isHijriMode != hm) {
			isHijriMode = hm;
			getCurrentDate();
			thisDate = isHijriMode ? thisDate.getHijriDate() : thisDate.getGregorianDate();
			var dd = thisDate.getDate();
			thisDate.setDate(1);
			if (dd >= 15)
				thisDate.setMonth(thisDate.getMonth() + 1);
			updateCalendarModeMenuLabel();
			updateCalendar();
		}
	};
	
	this.setFirstDayOfWeek = function(fdow) {
		if ((fdow == 0 || fdow == 1) && fdow != firstDayOfWeek) {
			firstDayOfWeek = fdow;
			recreateWeekdayGrids();
			recreateDayGrids();
		}
	};
	
	this.setYear = function(year) {
		if (!isNaN(year) && year != thisDate.getFullYear()) {
			thisDate.setFullYear(year);
			updateCalendar();
		}
	};
	
	this.setMonth = function(month) {
		if (!isNaN(month) && month != thisDate.getMonth()) {
			thisDate.setMonth(month);
			updateCalendar();
		}
	};
	
	this.refresh = function() {
		var cy = currentYear,
			cm = currentMonth,
			cd = currentDate;
		getCurrentDate();
		if (
			(currentYear != cy || currentMonth != cm || currentDate != cd) &&
			thisDate.getFullYear() == cy &&
			thisDate.getMonth() == cm
		)
			recreateDayGrids();
	};
	
	this.reset = function() {
		getCurrentDate();
		thisDate = isHijriMode ?
			new HijriDate(currentYear, currentMonth, 1, 6) :
			new Date(currentYear, currentMonth, 1);
		updateCalendar();
	};
	
	getCurrentDate();
	if (isNaN(year)) {
		year = currentYear;
		if (isNaN(month))
			month = currentMonth;
	}
	else {
		if (isNaN(month))
			month = 0;
	}
	thisDate = isHijriMode ?
		new HijriDate(year, month, 1, 6) :
		new Date(year, month, 1);
	createCalendar();
}
