/*********************************************
 * Hijri - Gregorian Date Picker             *
 *                                           *
 * Design by ZulNs @Yogyakarta, January 2016 *
 *********************************************
 *
 * Revised on 30 December 2018:
 *   Calendar class name was changed to Datepicker
 *
 * Revised on 8 January 2018:
 *   UI has been changed to adapt with W3CSS
 */
function Datepicker(isHijriMode, firstDayOfWeek, year, month)
{
	if (typeof HijriDate === 'undefined')
	{
		throw new Error('HijriDate() class is required!');
	}
	isHijriMode = !!isHijriMode;
	firstDayOfWeek = (firstDayOfWeek === undefined) ? 1 : ~~firstDayOfWeek;
	
	const BLACK_TEXT_THEME_NUMBER = 15;
	const MIN_WIDTH = 280;
	const MAX_WIDTH = 600;
	
	var	self = this,
	thisDate = isHijriMode ? new HijriDate() : new Date(),
	selectedDate = isHijriMode ? new HijriDate() : new Date(),
	currentYear = thisDate.getFullYear(),
	currentMonth = thisDate.getMonth(),
	currentDate = thisDate.getDate(),
	isHidden = true,
	isDisableCallback = false,
	displayStyle = 'block',
	hasEventListeners = !!window.addEventListener,
	currentWidth = 320,
	currentThemeIdx = Math.floor(Math.random() * Datepicker.themes.length),
	curLang='en',
	
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
	
	datepickerElm = createElement('div', 'w3-card-4'),
	headerElm = createElement('div', 'w3-container w3-' + Datepicker.themes[currentThemeIdx]),
	yearValueElm = createElement('div', 'w3-xlarge'),
	monthValueElm = createElement('div', 'w3-large'),
	dateGridsElm = createElement('div'),
	weekdayTitleElm = createElement('div', 'w3-cell-row w3-center w3-small w3-light-grey');
	
	createDatepicker =  function()
	{
		var closeBtnPanelElm = createElement('div', 'w3-container'),
			closeBtnElm = createElement('div', 'w3-btn w3-right',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z" stroke-width="1" /></svg>'
			),
			yearPanelElm = createElement('div', 'w3-container w3-center'),
			prevYearBtnElm = createElement('div', 'w3-btn w3-left',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M6 7L3 13L6 19L8 19L5 13L8 7Z M13 7L10 13L13 19L15 19L12 13L15 7Z" stroke-width="1" /></svg>'
			),
			nextYearBtnElm = createElement('div', 'w3-btn w3-right',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M4 7L7 13L4 19L6 19L9 13L6 7Z M11 7L14 13L11 19L13 19L16 13L13 7Z" stroke-width="1" /></svg>'
			),
			monthPanelElm = createElement('div', 'w3-container w3-center w3-large'),
			prevMonthBtnElm = createElement('div', 'w3-btn w3-left',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M10 7L7 13L10 19L12 19L9 13L12 7Z" stroke-width="1" /></svg>'
			),
			nextMonthBtnElm = createElement('div', 'w3-btn w3-right',
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M7 7L10 13L7 19L9 19L12 13L9 7Z" stroke-width="1" /></svg>'
			);
		datepickerElm.style.minWidth = MIN_WIDTH + 'px';
		datepickerElm.style.maxWidth = MAX_WIDTH + 'px';
		datepickerElm.style.width = currentWidth + 'px';
		headerElm.style.cssText = 'padding: 8px;';
		closeBtnPanelElm.style.cssText = yearPanelElm.style.cssText = 'padding: 0px;';
		monthPanelElm.style.cssText = 'padding: 6px 0px 0px 0px;';
		prevMonthBtnElm.style.cssText = nextMonthBtnElm.style.cssText = 'margin-top: -6px;';
		yearValueElm.style.cssText = monthValueElm.style.cssText = 'cursor: default;';
		weekdayTitleElm.style.cssText = 'padding: 0px 8px; margin-bottom: 8px; cursor: default;';
		closeBtnPanelElm.appendChild(closeBtnElm);
		headerElm.appendChild(closeBtnPanelElm);
		yearPanelElm.appendChild(prevYearBtnElm);
		yearPanelElm.appendChild(nextYearBtnElm);
		yearPanelElm.appendChild(yearValueElm);
		headerElm.appendChild(yearPanelElm);
		monthPanelElm.appendChild(prevMonthBtnElm);
		monthPanelElm.appendChild(nextMonthBtnElm);
		monthPanelElm.appendChild(monthValueElm);
		headerElm.appendChild(monthPanelElm);
		datepickerElm.appendChild(headerElm);
		dateGridsElm.appendChild(weekdayTitleElm);
		datepickerElm.appendChild(dateGridsElm);
		setDatepickerDisplay();
		addEvent(closeBtnElm, 'click', onHideDatepicker);
		addEvent(prevYearBtnElm, 'click', onDecrementYear);
		addEvent(nextYearBtnElm, 'click', onIncrementYear);
		addEvent(prevMonthBtnElm, 'click', onDecrementMonth);
		addEvent(nextMonthBtnElm, 'click', onIncrementMonth);
		createWeekdayTitle();
		createDateGrid();
	},
	
	createWeekdayTitle = function()
	{
		for (var i = 0; i < 7; i++)
		{
			var day = createElement('div', 'w3-cell'),
				wd = (i + firstDayOfWeek) % 7;
			if (wd == 5)
			{
				day.className += ' w3-text-teal';
			}
			else if (wd == 0)
			{
				day.className += ' w3-text-red';
			}
			day.style.cssText = 'width: 14.2857%; padding: 8px 0px;';
			day.innerHTML = Datepicker.strData[curLang]['shortWeekdayNames'][i];
			weekdayTitleElm.appendChild(day);
		}
	},
	
	recreateWeekdayTitle = function()
	{
		while (weekdayTitleElm.firstChild)
		{
			weekdayTitleElm.removeChild(weekdayTitleElm.firstChild);
		}
		createWeekdayTitle();
		recreateDateGrid();
	},
	
	createDateGrid = function()
	{
		var year = thisDate.getFullYear();
		if (year > 0)
		{
			yearValueElm.innerHTML = year + '&nbsp;' + (isHijriMode ? 'H' : 'AD');
		}
		else
		{
			yearValueElm.innerHTML = (-year + 1) + '&nbsp;' + (isHijriMode ? 'BH' : 'BC');
		}
		monthValueElm.innerHTML = thisDate.getMonthName(curLang);
		var cdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() - 1);
		var pdim = thisDate.getDaysInMonth();
		thisDate.setMonth(thisDate.getMonth() + 1);
		var fdim = thisDate.getDay(), pxd = fdim - firstDayOfWeek;
		if (pxd < 0) pxd += 7;
		var nxd = (pxd + cdim) % 7;
		if (nxd > 0) nxd = 7 - nxd;
		var gridCtr = 0;
		var cellRow = createElement('div', 'w3-cell-row w3-center');
		cellRow.style.cssText = 'padding: 0px 8px; margin-bottom: 8px;';
		dateGridsElm.appendChild(cellRow);
		for (var i = pdim - pxd + 1; i <= pdim; i++)
		{
			var de = createElement('div', 'w3-cell w3-disabled', i);
			de.style.cssText = 'width: 14.2857%; padding: 4px 0px; cursor: default;';
			cellRow.appendChild(de);
			gridCtr++;
		}
		var wd, sd;
		for (var i = 1; i <= cdim; i++)
		{
			var de = createElement('div', 'w3-cell', i);
			var today = thisDate.getFullYear() == currentYear && thisDate.getMonth() == currentMonth && i == currentDate;
			if (gridCtr == 0 && i > 1)
			{
				var cellRow = createElement('div', 'w3-cell-row w3-center');
				cellRow.style.cssText = 'padding: 0px 8px; margin-bottom: 8px;';
				dateGridsElm.appendChild(cellRow);
			}
			wd = (fdim + i - 1) % 7;
			if (today)
			{
				de.className += ' w3-' + Datepicker.themes[currentThemeIdx];
			}
			if (wd == 5)
			{
				if (!today)
				{
					de.className += ' w3-text-teal';
				}
				de.className += ' w3-hover-teal';
			}
			else if (wd == 0)
			{
				if (!today)
				{
					de.className += ' w3-text-red';
				}
				de.className += ' w3-hover-red';
			}
			else
			{
				de.className += ' w3-hover-dark-grey';
			}
			sd = (i - 1) * 864e5 + thisDate.getTime(); 
			if (265860e5 <= sd && sd < 266724e5)
			{
				de.className += 'w3-black';
			}
			de.style.cssText = 'width: 14.2857%; padding: 4px 0px; cursor: pointer;';
			addEvent(de, 'click', onSelectDate);
			cellRow.appendChild(de);
			gridCtr = (gridCtr + 1) % 7;
		}
		for (var i = 1; i <= nxd; i++)
		{
			var de = createElement('div', 'w3-cell w3-disabled', i);
			de.style.cssText = 'width: 14.2857%; padding: 4px 0px; cursor: default;';
			cellRow.appendChild(de);
		}
		var cellRow = createElement('div', 'w3-container');
		dateGridsElm.appendChild(cellRow);
	},
	
	recreateDateGrid = function()
	{
		while (dateGridsElm.children[1])
		{
			dateGridsElm.removeChild(dateGridsElm.children[1]);
		}
		createDateGrid();
		scrollToFix();
	},
	
	scrollToFix = function()
	{
		var dw = document.body.offsetWidth,
			vw = window.innerWidth,
			vh = window.innerHeight,
			rect = datepickerElm.getBoundingClientRect(),
			hsSpc = dw > vw ? 20 : 0,
			scrollX = rect.left < 0 ? rect.left : 0,
			scrollY = rect.bottom - rect.top > vh ? rect.top : rect.bottom > vh - hsSpc ? rect.bottom - vh + hsSpc : 0;
		window.scrollBy(scrollX, scrollY);
	},
	
	updateDatepicker = function()
	{
		if (isAutoSelectedDate)
		{
			var dim = thisDate.getDaysInMonth(),
				dt = selectedDate.getDate();
			selectedDate.setTime(thisDate.getTime());
			selectedDate.setDate(dt > dim ? dim : dt);
			recreateDateGrid();
			if (typeof self.callback === 'function' && !isDisableCallback) self.callback();
		}
		else
		{
			recreateDateGrid();
		}
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
		
	onDecrementMonth = function(evt)
	{
		thisDate.setMonth(thisDate.getMonth() - 1);
		updateDatepicker();
	},
	
	onIncrementMonth = function(evt)
	{
		thisDate.setMonth(thisDate.getMonth() + 1);
		updateDatepicker();
	},
	
	onDecrementYear = function(evt)
	{
		thisDate.setFullYear(thisDate.getFullYear() - 1);
		updateDatepicker();
	},
	
	onIncrementYear = function(evt)
	{
		thisDate.setFullYear(thisDate.getFullYear() + 1);
		updateDatepicker();
	},
	
	onSelectDate = function(evt) {
		evt = evt || window.event;
		var target = evt.target || evt.srcElement;
		var prevElm = dateGridsElm.getElementsByClassName('selected-date')[0];
		selectedDate.setTime(thisDate.getTime());
		selectedDate.setDate(parseInt(target.innerHTML));
		if (isAutoHide)
		{
			hideDatepicker();
		}
		if (typeof self.callback == 'function' && !isDisableCallback)
		{
			self.callback();
		}
	},
	
	setStrokeColor = function(elm, color)
	{
		elm.children[0].setAttribute('stroke', color);
		elm.children[0].setAttribute('fill', color);
	},
	
	newTheme = function(theme)
	{
		var themeIdx = -1;
		if (theme)
		{
			for (var i = 0; i < Datepicker.themes.length; i++)
			{
				if (theme == Datepicker.themes[i])
				{
					themeIdx = i;
					break;
				}
			}
			if (themeIdx == -1)
			{
				return false;
			}
		}
		else
		{
			do
			{
				themeIdx = Math.floor(Math.random() * Datepicker.themes.length);
			}
			while (currentThemeIdx == themeIdx);
		}
		headerElm.className = headerElm.className.replace('w3-' + Datepicker.themes[currentThemeIdx], 'w3-' + Datepicker.themes[themeIdx]);
		var elms = datepickerElm.querySelectorAll('div.w3-btn');
		var color = themeIdx < BLACK_TEXT_THEME_NUMBER ? '#000' : '#fff';
		for (var i = 0; i < elms.length; i++)
		{
			setStrokeColor(elms[i], color);
		}
		var elm = dateGridsElm.querySelector('.w3-' + Datepicker.themes[currentThemeIdx]);
		if (elm)
		{
			elm.className = elm.className.replace('w3-' + Datepicker.themes[currentThemeIdx], 'w3-' + Datepicker.themes[themeIdx]);
		}
		currentThemeIdx = themeIdx;
		return true;
	};
	
	this.setDate = function(setYear, setMonth, setDate)
	{
		setDateParams(setYear, setMonth, setDate);
		recreateDateGrid();
	};
	
	this.setTime = function(time)
	{
		selectedDate.setTime(time);
		thisDate.setTime(time);
		thisDate.setDate(1);
		recreateDateGrid();
	};
	
	this.changeDateMode = function()
	{
		isHijriMode = !isHijriMode;
		thisDate = isHijriMode ? new HijriDate() : new Date();
		currentYear = thisDate.getFullYear();
		currentMonth = thisDate.getMonth();
		currentDate = thisDate.getDate();
		thisDate.setTime(selectedDate.getTime());
		selectedDate = isHijriMode ? new HijriDate(thisDate.getTime()) : new Date(thisDate.getTime());
		thisDate.setDate(1);
		changeDatepickerMode();
		setDateModeAppearance();
		setFirstDayOfWeekAppearance();
		if (typeof this.callback === 'function' && !isDisableCallback)
		{
			this.callback();
		}
	};
	
	this.changeFirstDayOfWeek = function()
	{
		firstDayOfWeek ^= 1;
		recreateWeekdayTitle();
		setFirstDayOfWeekAppearance();
	};
	
	this.changeAutoHide = function()
	{
		isAutoHide = !isAutoHide;
		setAutoHideAppearance();
	};
	
	this.changeAutoSelectedDate = function()
	{
		if (isAutoHide)
		{
			return;
		}
		isAutoSelectedDate = !isAutoSelectedDate;
		setAutoSelectedDateAppearance();
	};
	
	this.getDate = function()
	{
		return selectedDate;
	};
	
	this.getTime = function()
	{
		return selectedDate.getTime();
	};
	
	this.isHijriMode = function()
	{
		return isHijriMode;
	};
	
	this.firstDayOfWeek = function()
	{
		return firstDayOfWeek;
	};
	
	this.isAutoHide = function()
	{
		return isAutoHide;
	};
	
	this.isAutoSelectedDate = function()
	{
		return isAutoSelectedDate;
	};
	
	this.isHidden = function()
	{
		return isHidden;
	};
	
	this.callback;
	
	this.onHide;
	
	this.disableCallback = function(state)
	{
		isDisableCallback = !!state;
	};
	
	this.getElement = function()
	{
		return datepickerElm;
	};
	
	this.setDisplayStyle = function(style)
	{
		displayStyle = style;
		setDatepickerDisplay();
	};
	
	this.show = function()
	{
		if (isHidden)
		{
			isHidden = false;
			newTheme();
			setDatepickerDisplay();
			scrollToFix();
		}
	};
	
	this.hide = function()
	{
		if (!isHidden)
		{
			isHidden = true;
			setDatepickerDisplay();
		}
	};
	
	this.destroy = function()
	{
		selectedDate = null;
		thisDate = null;
		datepickerElm.remove();
		self = null;
	};
	
	if (year !== undefined)
	{
		setDateParams(year, month, date);
	}
	else
	{
		thisDate.setTime(selectedDate.getTime());
		thisDate.setDate(1);
	}
	createDatepicker();
}
HijriDate.prototype.language='en';
HijriDate.prototype.getMonthName=function(month){
	if(isNaN(month))month=this.getMonth();
	month%=12;
	if(this.language=='en')return HijriDate.monthNames[month];
	return Datepicker.strData[this.language]['hMonthNames'][month];
};
Date.prototype.language='en';
Date.prototype.getMonthName=function(month){
	if(isNaN(month))month=this.getMonth();return Datepicker.strData[this.language]['monthNames'][month%12];
};
Datepicker.themes=['amber','aqua','cyan','grey','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','sand','yellow','black','blue','blue-grey','brown','dark-grey','deep-orange','deep-purple','green','indigo','pink','purple','red','teal'];
Datepicker.strData={
	"en":{
		"eraSuffix":["H","BH","AD","BC"],
		"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],
		"shortWeekdayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
	},
	"id":{
		"eraSuffix":["H","SH","M","SM"],
		"monthNames":["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
		"shortWeekdayNames":["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
		"hMonthNames":["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
	}
};
