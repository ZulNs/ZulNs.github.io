/*
 * Kalender Masehi/Hijriah using W3CSS
 * 
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 * Revised to using W3CSS, @Gorontalo, Indonesia, 11 January 2019
 */

function Calendar(isHijriMode, firstDayOfWeek, year, month)
{
	if (typeof HijriDate === 'undefined')
	{
		throw new Error('Required HijriDate() class!');
	}
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	
	const BLACK_TEXT_THEME_NUMBER = 16;
	
	var self = this,
	thisDate,
	currentYear,
	currentMonth,
	currentDate,
	isDisplayCurrentDate,
	isThemeAutoChanged = true,
	currentThemeIdx = -1,
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
		'aqua',
		'cyan',
		'grey',
		'khaki',
		'light-blue',
		'light-green',
		'lime',
		'orange',
		'pale-blue',
		'pale-green',
		'pale-red',
		'pale-yellow',
		'sand',
		'white',
		'yellow',
		'black',
		'blue',
		'blue-grey',
		'brown',
		'dark-grey',
		'deep-orange',
		'deep-purple',
		'green',
		'indigo',
		'light-green',
		'pink',
		'purple',
		'red',
		'teal'
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
	headerElm = createElement('div', 'w3-container w3-padding w3-color'),
	yearValueElm = createElement('span'),
	monthValueElm = createElement('span'),
	gridsElm = createElement('div'),
	weekdayTitleElm = createElement('div', 'w3-cell-row w3-center w3-large w3-light-grey');
	menuContainerElm = createElement('div', 'w3-dropdown-content w3-bar-block w3-border w3-animate-opacity'),
	menuCalendarModeElm = createElement('span', 'w3-bar-item w3-button'),
	menuFirstDayOfWeekElm = createElement('span', 'w3-bar-item w3-button'),
	aboutModalElm = createElement('div', 'w3-modal'),
	
	createCalendar = function()
	{
		var rootMenuElm = createElement('div', 'w3-dropdown-click'),
			menuBtnElm = createElement('div', 'w3-button',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M0 6L18 6L18 8L0 8Z M0 13L18 13L18 15L0 15Z M0 20L18 20L18 22L0 22Z" stroke-width="1" /></svg>'
			),
			menuItemRefreshElm = createElement('span', 'w3-bar-item w3-button', 'Refresh'),
			menuItemResetElm = createElement('span', 'w3-bar-item w3-button', 'Reset'),
			menuItemAboutElm = createElement('span', 'w3-bar-item w3-button', 'About'),
			menuItemCancelElm = createElement('span', 'w3-bar-item w3-button', 'Cancel<span class="w3-right">&times;</span>'),
			yearPanelElm = createElement('div', 'w3-center w3-xxxlarge'),
			prevYearBtnElm = createElement('div', 'w3-button w3-medium w3-left',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M7 7L2 15L7 23L9 23L4 15L9 7Z M14 7L9 15L14 23L16 23L11 15L16 7Z" stroke-width="1" /></svg>'
			),
			nextYearBtnElm = createElement('div', 'w3-button w3-medium w3-right',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M11 7L16 15L11 23L9 23L14 15L9 7Z M4 7L9 15L4 23L2 23L7 15L2 7Z" stroke-width="1" /></svg>'
			),
			monthPanelElm = createElement('div', 'w3-center w3-xxlarge'),
			prevMonthBtnElm = createElement('div', 'w3-button w3-medium w3-left',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M10 7L5 15L10 23L12 23L7 15L12 7Z" stroke-width="1" /></svg>'
			),
			nextMonthBtnElm = createElement('div', 'w3-button w3-medium w3-right',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M8 7L13 15L8 23L6 23L11 15L6 7Z" stroke-width="1" /></svg>'
			),
			aboutContentElm = createElement('div', 'w3-modal-content w3-animate-zoom w3-card-4'),
			aboutContentWrapperElm = createElement('div', 'w3-center w3-padding-24'),
			aboutCloseBtnElm = createElement('span', 'w3-button w3-large w3-display-topright', '&times;'),
			aboutTagsContainerElm = createElement('div', 'w3-container w3-padding-24'),
			aboutTag1Elm = createElement('span', 'w3-tag w3-jumbo', 'Z'),
			aboutTag2Elm = createElement('span', 'w3-tag w3-jumbo w3-red', 'u'),
			aboutTag3Elm = createElement('span', 'w3-tag w3-jumbo w3-blue', 'l'),
			aboutTag4Elm = createElement('span', 'w3-tag w3-jumbo', 'N'),
			aboutTag5Elm = createElement('span', 'w3-tag w3-jumbo w3-amber', 's'),
			aboutTextElm = createElement('p', 'w3-large', 'Gorontalo, 7 January 2019');
		prevYearBtnElm.style = nextYearBtnElm.style = 'margin-top: 14px;';
		prevMonthBtnElm.style = nextMonthBtnElm.style = 'margin-top: 6px;';
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
		addEvent(rootMenuElm, 'mouseenter', onHoverMenu);
		addEvent(rootMenuElm, 'mouseleave', onUnhoverMenu);
		addEvent(prevYearBtnElm, 'mouseenter', onHoverBtn);
		addEvent(prevYearBtnElm, 'mouseleave', onUnhoverBtn);
		addEvent(nextYearBtnElm, 'mouseenter', onHoverBtn);
		addEvent(nextYearBtnElm, 'mouseleave', onUnhoverBtn);
		addEvent(prevMonthBtnElm, 'mouseenter', onHoverBtn);
		addEvent(prevMonthBtnElm, 'mouseleave', onUnhoverBtn);
		addEvent(nextMonthBtnElm, 'mouseenter', onHoverBtn);
		addEvent(nextMonthBtnElm, 'mouseleave', onUnhoverBtn);
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
		newTheme();
	},
	
	addEvent = function(elm, evt, callback, option)
	{
		if (elm == null || typeof(elm) == 'undefined')
		{
			return;
		}
		if (hasEventListeners)
		{
			elm.addEventListener(evt, callback, !!option);
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
			rowCtr = 0,
			isToday;
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
			isToday = thisDate.getFullYear() == currentYear && thisDate.getMonth() == currentMonth && pdate == currentDate;
			if (i % 7 == isFri)
			{
				grid.className += isToday ? ' w3-teal' : ' w3-text-teal';
			}
			else if (i % 7 == isSun)
			{
				grid.className += isToday ? ' w3-red' : ' w3-text-red';
			}
			else if (isToday)
			{
				grid.className += ' w3-dark-grey';
				isDisplayCurrentDate = ppdr < i && i <= ppdr + pcdr;
			}
			if (thisTime == 262368e5 && pdate == 5 && sdate == 5)
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
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateCalendar();
	},
	
	onIncrementMonth = function(evt)
	{
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateCalendar();
	},
	
	onDecrementYear = function(evt)
	{
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateCalendar();
	},
	
	onIncrementYear = function(evt)
	{
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateCalendar();
	},
	
	onHoverMenu = function(evt)
	{
		setStrokeColor(evt.target.children[0], '#000');
	},
	
	onUnhoverMenu = function(evt)
	{
		hideMenu();
		if (currentThemeIdx >= BLACK_TEXT_THEME_NUMBER)
		{
			setStrokeColor(evt.target.children[0], '#fff');
		}
	},
	
	onHoverBtn = function(evt)
	{
		setStrokeColor(evt.target, '#000');
	},
	
	onUnhoverBtn = function(evt)
	{
		if (currentThemeIdx >= BLACK_TEXT_THEME_NUMBER)
		{
			setStrokeColor(evt.target, '#fff');
		}
	},
	
	setStrokeColor = function(elm, color, isCurrentColor)
	{
		if (isCurrentColor)
		{
			color = window.getComputedStyle(elm).getPropertyValue('color');
		}
		elm.children[0].setAttribute('stroke', color);
		elm.children[0].setAttribute('fill', color);
	}
	
	hideMenu = function()
	{
		menuContainerElm.className = menuContainerElm.className.replace(' w3-show', '');
	},
	
	onClickMenu = function(evt)
	{
		if (menuContainerElm.className.indexOf('w3-show') == -1)
		{
			menuContainerElm.className += ' w3-show';
		}
		else
		{
			hideMenu();
		}
	},
	
	onChangeCalendarMode = function(evt)
	{
		hideMenu();
		self.setHijriMode(!isHijriMode);
	},
	
	onChangeFirstDayOfWeek = function(evt)
	{
		hideMenu();
		self.setFirstDayOfWeek(1 - firstDayOfWeek);
	},
	
	onRefresh = function(evt)
	{
		hideMenu();
		self.refresh();
	},
	
	onReset = function(evt)
	{
		hideMenu();
		self.reset();
	},
	
	onAbout = function(evt)
	{
		hideMenu();
		showAbout();
	},
	
	showAbout = function()
	{
		aboutModalElm.style.display = 'block';
	},
	
	onCloseAbout = function(evt)
	{
		aboutModalElm.style.display = 'none';
	},
	
	onCancel = function(evt)
	{
		hideMenu();
	},
	
	onResizeWindow = function(evt)
	{
		if
		(
			isSmallScreen && calendarElm.clientWidth >= 640 ||
			!isSmallScreen && calendarElm.clientWidth < 640
		)
		{
			isSmallScreen = !isSmallScreen;
			recreateWeekdayTitle();
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
		var themeIdx;
		if (theme)
		{
			themeIdx = getThemeIdx(theme);
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
			while (currentThemeIdx == themeIdx);
		}
		currentThemeIdx = themeIdx;
		headerElm.className = headerElm.className.substring(0, headerElm.className.lastIndexOf('w3-'));
		headerElm.className += 'w3-' + themes[currentThemeIdx];
		var elms = calendarElm.querySelectorAll('div.w3-button');
		var color = currentThemeIdx < BLACK_TEXT_THEME_NUMBER ? '#000' : '#fff';
		for (var i = 0; i < elms.length; i++)
		{
			setStrokeColor(elms[i], color);
		}
	},
	
	getThemeIdx = function(theme)
	{
		for (var i = 0; i < themes.length; i++)
		{
			if (theme == themes[i])
			{
				return i;
			}
		}
		return -1;
	};
	
	this.getElement = function()
	{
		return calendarElm;
	};
	
	this.setHijriMode = function(hm)
	{
		if ((hm === true || hm === false) && isHijriMode != hm)
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
				this.reset();
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
		if (isThemeAutoChanged)
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
		newTheme(theme);
	};
	
	this.setThemeAutoChanged = function(tac)
	{
		if (tac === true || tac === false)
		{
			isThemeAutoChanged = tac;
		}
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
