/*
 * Kalender Masehi/Hijriah using W3CSS
 * 
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 * Revised to using W3CSS, @Gorontalo, Indonesia, 6 January 2019
 */

function Calendar(isHijriMode, firstDayOfWeek, year, month)
{
	if (typeof HijriDate === 'undefined')
	{
		throw new Error('Required HijriDate() class!');
	}
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	
	var self = this,
	thisDate,
	currentYear,
	currentMonth,
	currentDate,
	isThemeChangeable,
	isDisplayCurrentDate,
	currentTheme,
	themeHref,
	isSmallScreen =
	(
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth
	) < 640,
	hasEventListeners = !!window.addEventListener,
	themes =
	[
		'amber',
		'black',
		'blue',
		'blue-grey',
		'brown',
		'cyan',
		'dark-grey',
		'deep-orange',
		'deep-purple',
		'green',
		'grey',
		'indigo',
		'khaki',
		'light-blue',
		'light-green',
		'lime',
		'orange',
		'pink',
		'purple',
		'red',
		'teal',
		'w3schools',
		'yellow'
	],
	
	createElement = function(tagName, className, innerHTML)
	{
		var elm = document.createElement(tagName);
		if (className)
		{
			elm.className = className;
		}
		if (innerHTML)
		{
			elm.innerHTML = innerHTML;
		}
		return elm;
	},
	
	calendarElm = createElement('div'),
	yearValueElm = createElement('span', 'w3-button w3-hover-theme'),
	monthValueElm = createElement('span', 'w3-button w3-hover-theme'),
	gridsElm = createElement('div'),
	weekdayTitleElm = createElement('div', 'w3-cell-row w3-center w3-large w3-theme-light');
	rootMenuElm = createElement('div', 'w3-dropdown-click'),
	menuBtnElm = createElement('button', 'w3-btn w3-hover-theme', '&#x2630;'),
	menuContainerElm = createElement('div', 'w3-dropdown-content w3-bar-block w3-border w3-animate-opacity w3-theme-light'),
	menuCalendarModeElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme'),
	menuFirstDayOfWeekElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme'),
	aboutModalElm = createElement('div', 'w3-modal'),
	
	createCalendar = function()
	{
		var headerElm = createElement('div', 'w3-container w3-padding w3-theme'),
			menuItemRefreshElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme', 'Refresh'),
			menuItemResetElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme', 'Reset'),
			menuItemAboutElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme', 'About'),
			menuItemCancelElm = createElement('span', 'w3-bar-item w3-button w3-hover-theme', 'Cancel<span class="w3-right">&times;</span>'),
			yearPanelElm = createElement('div', 'w3-center w3-xxlarge'),
			prevYearBtnElm = createElement('button', 'w3-btn w3-left', '&#xab;'),
			nextYearBtnElm = createElement('button', 'w3-btn w3-right', '&#xbb;'),
			monthPanelElm = createElement('div', 'w3-center w3-xlarge'),
			prevMonthBtnElm = createElement('button', 'w3-btn w3-left', '&#x2039;'),
			nextMonthBtnElm = createElement('button', 'w3-btn w3-right','&#x203a;'),
			aboutContentElm = createElement('div', 'w3-modal-content w3-animate-zoom w3-card-4 w3-theme-light'),
			aboutContentWrapperElm = createElement('div', 'w3-center w3-padding-24'),
			aboutCloseBtnElm = createElement('span', 'w3-btn w3-large w3-display-topright', '&times;'),
			aboutTagsContainerElm = createElement('div', 'w3-container w3-padding-24'),
			aboutTag1Elm = createElement('span', 'w3-tag w3-jumbo', 'Z'),
			aboutTag2Elm = createElement('span', 'w3-tag w3-jumbo w3-red', 'u'),
			aboutTag3Elm = createElement('span', 'w3-tag w3-jumbo w3-blue', 'l'),
			aboutTag4Elm = createElement('span', 'w3-tag w3-jumbo', 'N'),
			aboutTag5Elm = createElement('span', 'w3-tag w3-jumbo w3-amber', 's'),
			aboutTextElm = createElement('p', 'w3-large', 'Gorontalo, 7 January 2019');
		yearValueElm.style = monthValueElm.style = gridsElm.style = 'cursor: default;';
		weekdayTitleElm.style = 'padding: 12px 0px; margin-bottom: 8px;';
		menuContainerElm.appendChild(menuCalendarModeElm);
		menuContainerElm.appendChild(menuFirstDayOfWeekElm);
		menuContainerElm.appendChild(menuItemRefreshElm);
		menuContainerElm.appendChild(menuItemResetElm);
		menuContainerElm.appendChild(menuItemAboutElm);
		menuContainerElm.appendChild(menuItemCancelElm);
		rootMenuElm.appendChild(menuBtnElm);
		rootMenuElm.appendChild(menuContainerElm);
		yearPanelElm.appendChild(prevYearBtnElm);
		yearPanelElm.appendChild(nextYearBtnElm);
		yearPanelElm.appendChild(yearValueElm);
		monthPanelElm.appendChild(prevMonthBtnElm);
		monthPanelElm.appendChild(nextMonthBtnElm);
		monthPanelElm.appendChild(monthValueElm);
		headerElm.appendChild(rootMenuElm);
		headerElm.appendChild(yearPanelElm);
		headerElm.appendChild(monthPanelElm);
		gridsElm.appendChild(weekdayTitleElm);
		calendarElm.appendChild(headerElm);
		calendarElm.appendChild(gridsElm);
		aboutTagsContainerElm.appendChild(aboutTag1Elm);
		aboutTagsContainerElm.appendChild(createElement('span', null, '&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag2Elm);
		aboutTagsContainerElm.appendChild(createElement('span', null, '&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag3Elm);
		aboutTagsContainerElm.appendChild(createElement('span', null, '&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag4Elm);
		aboutTagsContainerElm.appendChild(createElement('span', null, '&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag5Elm);
		aboutContentWrapperElm.appendChild(aboutCloseBtnElm);
		aboutContentWrapperElm.appendChild(aboutTagsContainerElm);
		aboutContentWrapperElm.appendChild(aboutTextElm);
		aboutContentElm.appendChild(aboutContentWrapperElm);
		aboutModalElm.appendChild(aboutContentElm);
		aboutContentElm.style = 'max-width: 400px;';
		calendarElm.appendChild(aboutModalElm);
		// Add event
		addEvent(rootMenuElm, 'mouseleave', onUnhoverMenu);
		addEvent(menuBtnElm, 'click', onClickMenu);
		addEvent(menuCalendarModeElm, 'click', onChangeCalendarMode);
		addEvent(menuFirstDayOfWeekElm, 'click', onChangeFirstDayOfWeek);
		addEvent(menuItemRefreshElm, 'click', onRefresh);
		addEvent(menuItemResetElm, 'click', onReset);
		addEvent(menuItemAboutElm, 'click', onAbout);
		addEvent(menuItemCancelElm, 'click', onCancel);
		addEvent(prevYearBtnElm, 'click', onDecrementYear);
		addEvent(nextYearBtnElm, 'click', onIncrementYear);
		addEvent(prevMonthBtnElm, 'click', onDecrementMonth);
		addEvent(nextMonthBtnElm, 'click', onIncrementMonth);
		addEvent(aboutCloseBtnElm, 'click', onCloseAbout);
		addEvent(window, 'resize', onResizeWindow);
		updateCalendarModeMenuLabel();
		updateHeader();
		createWeekdayTitle();
		createDayGrid();
		var themeElm = document.getElementById('currentTheme');
		isThemeChangeable = (themeElm != null && themeElm.tagName == 'LINK' && themeElm.rel == 'stylesheet');
		if (isThemeChangeable)
		{
			var theme = themeElm.href;
			var idx = theme.lastIndexOf('w3-theme-') + 9;
			if (idx < 9)
			{
				isThemeChangeable = false;
			}
			else
			{
				themeHref = theme.substring(0, idx);
				newTheme(themes[Math.floor(Math.random() * themes.length)]);
			}
		}
		alert(isThemeChangeable);
	},
	
	updateCalendarModeMenuLabel = function()
	{
		menuCalendarModeElm.innerHTML = 'Kalender&nbsp;' + (isHijriMode ? 'Masehi' : 'Hijriah');
	},
	
	updateHeader = function()
	{
		yearValueElm.innerHTML = thisDate.getFullYear() + '&nbsp;' + (isHijriMode ? 'H' : 'M');
		monthValueElm.innerHTML = thisDate.getMonthName();
	},
	
	createWeekdayTitle = function()
	{
		for (var i = firstDayOfWeek; i < 7 + firstDayOfWeek; i++)
		{
			var dayTitleElm = createElement('div', 'w3-cell', isSmallScreen ? thisDate.getDayShortName(i % 7) : thisDate.getDayName(i % 7));
			if (i == 5)
			{
				dayTitleElm.className += ' w3-text-teal';
			}
			if (i % 7 == 0)
			{
				dayTitleElm.className += ' w3-text-red';
			}
			dayTitleElm.style.width = '14.2857%';
			weekdayTitleElm.appendChild(dayTitleElm);
		}
		menuFirstDayOfWeekElm.innerHTML = 'Mulai&nbsp;' + thisDate.getDayName(1 - firstDayOfWeek);
	},
	
	recreateWeekdayTitle = function()
	{
		while (weekdayTitleElm.firstChild)
		{
			weekdayTitleElm.removeChild(weekdayTitleElm.firstChild);
		}
		createWeekdayTitle();
	},
	
	createDayGrid = function()
	{
		var thisTime = thisDate.getTime(),
			ppdr = thisDate.getDay() - firstDayOfWeek;
		if (ppdr < 0)
		{
			ppdr += 7;
		}
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
			isSun = 1 - firstDayOfWeek,
			rowCtr = 0;
		isDisplayCurrentDate = false;
		for (var i = 1; i <= ppdr + pcdr + pndr; i++)
		{
			if (rowCtr == 0)
			{
				var row = createElement('div', 'w3-cell-row w3-center');
				gridsElm.appendChild(row);
			}
			var grid = createElement('div', 'w3-cell'),
				pde = createElement('div', 'w3-xlarge'),
				sde = createElement('div', 'w3-small');
			grid.style = 'width: 14.2857%; padding: 6px 0px;';
			grid.appendChild(pde);
			grid.appendChild(sde);
			row.appendChild(grid);
			if (i % 7 == isFri)
			{
				grid.className += ' w3-text-teal';
			}
			else if (i % 7 == isSun)
			{
				grid.className += ' w3-text-red';
			}
			if
			(
				thisDate.getFullYear() == currentYear &&
				thisDate.getMonth() == currentMonth &&
				pdate == currentDate
			)
			{
				grid.className += ' w3-theme';
				isDisplayCurrentDate = ppdr < i && i <= ppdr + pcdr;
			}
			else if (thisTime == 262368e5 && pdate == 5 && sdate == 5)
			{
				grid.className += ' w3-black';
				grid.style.cursor = 'pointer';
				addEvent(grid, 'click', onAbout);
			}
			if (i <= ppdr || ppdr + pcdr < i)
			{
				grid.className += ' w3-disabled';
				grid.style.cursor = 'default';
			}
			pde.innerHTML = pdate;
			sde.innerHTML = sdate + '&nbsp;' + smsn;
			pdate++;
			if (pdate > pdim)
			{
				pdate = 1;
				thisDate.setDate(1);
				thisDate.setMonth(thisDate.getMonth() + 1);
				pdim = thisDate.getDaysInMonth();
			}
			sdate++;
			if (sdate > sdim)
			{
				sdate = 1;
				thatDate.setDate(1);
				thatDate.setMonth(thatDate.getMonth() + 1);
				sdim = thatDate.getDaysInMonth();
				smsn = thatDate.getMonthShortName();
			}
			rowCtr = (rowCtr + 1) % 7;
		}
		thisDate.setTime(thisTime);
	},
	
	recreateDayGrid = function()
	{
		while (gridsElm.children[1])
		{
			gridsElm.removeChild(gridsElm.children[1]);
		}
		createDayGrid();
	},
	
	updateCalendar = function()
	{
		updateHeader();
		recreateDayGrid();
	}
	
	onDecrementMonth = function(evt)
	{
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrementMonth = function(evt)
	{
		evt = evt || window.event;
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onDecrementYear = function(evt)
	{
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onIncrementYear = function(evt)
	{
		evt = evt || window.event;
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateCalendar();
		return returnEvent(evt);
	},
	
	onClickMenu = function(evt)
	{
		evt = evt || window.event;
		if (menuContainerElm.className.indexOf('w3-show') == -1)
		{
			menuBtnElm.className += ' w3-theme-light';
			menuContainerElm.className += ' w3-show';
		}
		else
		{
			hideMenu();
		}
		return returnEvent(evt);
	},
	
	onUnhoverMenu = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		return returnEvent(evt);
	},
	
	onChangeCalendarMode = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		self.setHijriMode(!isHijriMode);
		return returnEvent(evt);
	},
	
	onChangeFirstDayOfWeek = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		self.setFirstDayOfWeek(1 - firstDayOfWeek);
		return returnEvent(evt);
	},
	
	onRefresh = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		self.refresh();
		return returnEvent(evt);
	},
	
	onReset = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		self.reset();
		return returnEvent(evt);
	},
	
	onAbout = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		showAbout();
		return returnEvent(evt);
	},
	
	onCancel = function(evt)
	{
		evt = evt || window.event;
		hideMenu();
		return returnEvent(evt);
	},
	
	onCloseAbout = function(evt)
	{
		evt = evt || window.event;
		aboutModalElm.style.display = 'none';
		return returnEvent(evt);
	},
	
	onResizeWindow = function(evt)
	{
		evt = evt || window.event;
		if
		(
			isSmallScreen && calendarElm.clientWidth >= 640 ||
			!isSmallScreen && calendarElm.clientWidth < 640
		)
		{
			isSmallScreen = !isSmallScreen;
			recreateWeekdayTitle();
		}
		return returnEvent(evt);
	},
	
	addEvent = function(elm, evt, callback)
	{
		if (elm == null || typeof(elm) == 'undefined')
		{
			return;
		}
		if (hasEventListeners)
		{
			elm.addEventListener(evt, callback, false);
		}
		else if (elm.attachEvent)
		{
			elm.attachEvent('on' + evt, callback);
		}
		else
		{
			elm['on' + evt] = callback;
		}
	},
	
	returnEvent = function(evt)
	{
		if (evt.stopPropagation)
		{
			evt.stopPropagation();
		}
		if (evt.preventDefault)
		{
			evt.preventDefault();
		}
		else
		{
			evt.returnValue = false;
			return false;
		}
	},
	
	getCurrentDate = function()
	{
		var nd = new Date();
		nd.setHours(0);
		if (isHijriMode)
		{
			nd = nd.getHijriDate();
		}
		currentYear = nd.getFullYear();
		currentMonth = nd.getMonth();
		currentDate = nd.getDate();
	},
	
	newTheme = function(theme)
	{
		var themeIdx = -1;
		if (theme)
		{
			for (var i = 0; i < themes.length; i++)
			{
				if (theme == themes[i])
				{
					themeIdx = i;
					break;
				}
			}
			if (themeIdx == -1)
			{
				return;
			}
		}
		else
		{
			do
			{
				themeIdx = Math.floor(Math.random() * themes.length);
			}
			while (currentTheme == themeIdx);
		}
		currentTheme = themeIdx;
		document.body.removeChild(document.getElementById('currentTheme'));
		var style = createElement('link');
		style.id = 'currentTheme';
		style.rel = 'stylesheet';
		style.href = themeHref + themes[currentTheme] + '.css';
		document.body.appendChild(style);
	},
	
	hideMenu = function()
	{
		menuBtnElm.className = menuBtnElm.className.replace(' w3-theme-light', '');
		menuContainerElm.className = menuContainerElm.className.replace(' w3-show', '');
	},
	
	showAbout = function()
	{
		aboutModalElm.style.display = 'block';
	};
	
	this.getElement = function()
	{
		return calendarElm;
	};
	
	this.setHijriMode = function(hm)
	{
		if ((hm == true || hm == false) && isHijriMode != hm)
		{
			isHijriMode = hm;
			if (isHijriMode)
			{
				thisDate = thisDate.getHijriDate();
			}
			else
			{
				thisDate = thisDate.getGregorianDate();
			}
			if (isDisplayCurrentDate)
			{
				thisDate.setDate(1);
				self.reset();
			}
			else
			{
				if (thisDate.getDate() >= 15)
				{
					thisDate.setMonth(thisDate.getMonth() + 1);
				}
				thisDate.setDate(1);
				getCurrentDate();
				updateCalendar();
			}
			updateCalendarModeMenuLabel();
		}
	};
	
	this.setFirstDayOfWeek = function(fdow)
	{
		if ((fdow == 0 || fdow == 1) && fdow != firstDayOfWeek)
		{
			firstDayOfWeek = fdow;
			recreateWeekdayTitle();
			recreateDayGrid();
		}
	};
	
	this.setYear = function(year)
	{
		if (!isNaN(year) && year != thisDate.getFullYear())
		{
			thisDate.setFullYear(year);
			updateCalendar();
		}
	};
	
	this.setMonth = function(month)
	{
		if (!isNaN(month) && month != thisDate.getMonth())
		{
			thisDate.setMonth(month);
			updateCalendar();
		}
	};
	
	this.refresh = function()
	{
		if (isThemeChangeable)
		{
			newTheme();
		}
		var cy = currentYear,
			cm = currentMonth,
			cd = currentDate;
		getCurrentDate();
		if
		(
			(currentYear != cy || currentMonth != cm || currentDate != cd) &&
			thisDate.getFullYear() == cy &&
			thisDate.getMonth() == cm
		)
		{
			recreateDayGrid();
		}
	};
	
	this.reset = function()
	{
		getCurrentDate();
		thisDate.setFullYear(currentYear);
		thisDate.setMonth(currentMonth);
		updateCalendar();
	};
	
	this.setTheme = function(theme)
	{
		if (isThemeChangeable)
		{
			newTheme(theme);
		}
	};
	
	this.disableThemeChange = function()
	{
		isThemeChangeable = false;
	};
	
	getCurrentDate();
	if (isNaN(year))
	{
		year = currentYear;
		if (isNaN(month))
		{
			month = currentMonth;
		}
	}
	else
	{
		if (isNaN(month))
		{
			month = 0;
		}
	}
	thisDate = isHijriMode ?
		new HijriDate(year, month, 1, 6) :
		new Date(year, month, 1);
	createCalendar();
}
