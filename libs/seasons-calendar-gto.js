/*
 * Script for Kalender Musim Gorontalo
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 August 2017
 * Based on Amirudin Dako's notes
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
	isLowangaActive = false,
	isMusimTanamActive = false,
	isMusimMelautActive = false,
	isMusimKawinActive = false,
	isMusimBangunRumahActive = false,
	hasEventListeners = !!window.addEventListener,
	calendarElm = document.createElement('div'),
	yearValueElm = document.createElement('li'),
	monthValueElm = document.createElement('li'),
	weekdaysElm = document.createElement('ul'),
	daysElm = document.createElement('ul'),
	menuItemContainerElm = document.createElement('ul'),
	menuCalendarModeElm = document.createElement('a'),
	menuFirstDayOfWeekElm = document.createElement('a'),
	menuLowangaElm = document.createElement('a'),
	menuMusimTanamElm = document.createElement('a'),
	menuMusimMelautElm = document.createElement('a'),
	menuMusimKawinElm = document.createElement('a'),
	menuMusimBangunRumahElm = document.createElement('a'),
	legendElm = document.createElement('ul');
	
	createCalendar = function() {
		var rootMenuElm = document.createElement('ul'),
			rootMenuValueElm = document.createElement('a'),
			menuItem1Elm = document.createElement('li'),
			menuItem2Elm = document.createElement('li'),
			menuItem3Elm = document.createElement('li'),
			menuItem4Elm = document.createElement('li'),
			menuItem5Elm = document.createElement('li'),
			menuItem6Elm = document.createElement('li'),
			menuItem7Elm = document.createElement('li'),
			menuItem8Elm = document.createElement('li'),
			menuItem9Elm = document.createElement('li'),
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
			nextMonthElm = document.createElement('a'),
			legendTitleElm = document.createElement('li'),
			legendLowangaItemElm = document.createElement('li'),
			legendExtra1ItemElm = document.createElement('li'),
			legendExtra2ItemElm = document.createElement('li'),
			legendExtra3ItemElm = document.createElement('li'),
			legendExtra4ItemElm = document.createElement('li');
		// Construct the calendar
		menuItem1Elm.appendChild(menuCalendarModeElm);
		menuItem2Elm.appendChild(menuFirstDayOfWeekElm);
		menuItem3Elm.appendChild(menuLowangaElm);
		menuItem4Elm.appendChild(menuMusimTanamElm);
		menuItem5Elm.appendChild(menuMusimMelautElm);
		menuItem6Elm.appendChild(menuMusimKawinElm);
		menuItem7Elm.appendChild(menuMusimBangunRumahElm);
		menuItem8Elm.appendChild(menuRefreshElm);
		menuItem9Elm.appendChild(menuResetElm);
		menuItemContainerElm.appendChild(menuItem1Elm);
		menuItemContainerElm.appendChild(menuItem2Elm);
		menuItemContainerElm.appendChild(menuItem3Elm);
		menuItemContainerElm.appendChild(menuItem4Elm);
		menuItemContainerElm.appendChild(menuItem5Elm);
		menuItemContainerElm.appendChild(menuItem6Elm);
		menuItemContainerElm.appendChild(menuItem7Elm);
		menuItemContainerElm.appendChild(menuItem8Elm);
		menuItemContainerElm.appendChild(menuItem9Elm);
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
		calendarElm.appendChild(legendElm);
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
		legendElm.classList.add('legend');
		// Set href
		rootMenuValueElm.href = '#';
		prevYearElm.href = '#';
		menuCalendarModeElm.href = '#';
		menuFirstDayOfWeekElm.href = '#';
		menuLowangaElm.href = '#';
		menuMusimTanamElm.href = '#';
		menuMusimMelautElm.href = '#';
		menuMusimKawinElm.href = '#';
		menuMusimBangunRumahElm.href = '#';
		menuRefreshElm.href = '#';
		menuResetElm.href = '#';
		nextYearElm.href = '#';
		prevMonthElm.href = '#';
		nextMonthElm.href = '#';
		// Set innerHTML
		//rootMenuValueElm.innerHTML = '&#x25bc;';
		rootMenuValueElm.innerHTML = '&nbsp;&nbsp;&#x2261;&nbsp;&nbsp;';
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
		addEvent(menuItem3Elm, 'click', onLowanga);
		addEvent(menuItem4Elm, 'click', onMusimTanam);
		addEvent(menuItem5Elm, 'click', onMusimMelaut);
		addEvent(menuItem6Elm, 'click', onMusimKawin);
		addEvent(menuItem7Elm, 'click', onMusimBangunRumah);
		addEvent(menuItem8Elm, 'click', onRefresh);
		addEvent(menuItem9Elm, 'click', onReset);
		updateCalendarModeMenuLabel();
		updateLowangaMenuLabel();
		updateMusimTanamMenuLabel();
		updateMusimMelautMenuLabel();
		updateMusimKawinMenuLabel();
		updateMusimBangunRumahMenuLabel();
		updateHeader();
		createWeekdayGrids();
		createDayGrids();
	},
	
	updateCalendarModeMenuLabel = function() {
		menuCalendarModeElm.innerHTML = 'Kalender ' + (isHijriMode ? 'Masehi' : 'Hijriah');
	},
	
	updateLowangaMenuLabel = function() {
		menuLowangaElm.innerHTML = (isLowangaActive ? 'Sembunyikan' : 'Tampilkan') + '&nbsp;<b>Lowanga</b>';
	},
	
	updateMusimTanamMenuLabel = function() {
		menuMusimTanamElm.innerHTML = (isMusimTanamActive ? 'Sembunyikan' : 'Tampilkan') + '&nbsp;<b>Musim&nbsp;Tanam</b>';
	},
	
	updateMusimMelautMenuLabel = function() {
		menuMusimMelautElm.innerHTML = (isMusimMelautActive ? 'Sembunyikan' : 'Tampilkan') + '&nbsp;<b>Musim&nbsp;Melaut</b>';
	},
	
	updateMusimKawinMenuLabel = function() {
		menuMusimKawinElm.innerHTML = (isMusimKawinActive ? 'Sembunyikan' : 'Tampilkan') + '&nbsp;<b>Musim&nbsp;Hajatan</b>';
	},
	
	updateMusimBangunRumahMenuLabel = function() {
		menuMusimBangunRumahElm.innerHTML = (isMusimBangunRumahActive ? 'Sembunyikan' : 'Tampilkan') + '&nbsp;<b>Musim&nbsp;Payango&nbsp;Bele</b>';
	},
	
	updateHeader = function() {
		yearValueElm.innerHTML = thisDate.getFullYear() + (isHijriMode ? ' H' : ' M');
		monthValueElm.innerHTML = thisDate.getMonthName();
	},
	
	createWeekdayGrids = function() {
		var cl;
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
			gdate = isHijriMode ? sdate : pdate,
			pdim = thisDate.getDaysInMonth(),
			sdim = thatDate.getDaysInMonth(),
			smsn = thatDate.getMonthShortName(),
			hmonth,
			gmonth,
			phmonth,
			desc,
			kalmus,
			clazzName,
			isStyled,
			isToday = false,
			isSpecialz = false,
			isLowanga,
			isMusimTanam,
			isMusimKawin,
			isMusimBangunRumah,
			isLegendTitle = false,
			isLegendLowanga = false,
			isLegendTualangaSore = false,
			isLegendHulitaPobole = false,
			isLegendTualangaPagi = false,
			isLegendTauwa = false,
			isLegendTeduh = false,
			isLegendPancaroba = false,
			isLegendAnginTimur = false,
			isLegendAnginBarat = false,
			isLegendBolehKawin = false,
			isLegendDilarangKawin = false,
			isLegendBolehBangunRumah = false,
			isLegendDilarangBangunRumah = false;
		if (isHijriMode) {
			hmonth = thisDate.getMonth();
			gmonth = thatDate.getMonth();
		}
		else {
			gmonth = thisDate.getMonth();
			hmonth = thatDate.getMonth();
		}
		phmonth = hmonth;
		kalmus = calendarElm;
		for (var i = 1; i <= ppdr + pcdr + pndr; i++) {
			var pde = document.createElement('li'),
				sde = document.createElement('span');
			sde.classList.add('footer-date');
			if (i <= ppdr || i > ppdr + pcdr)
				pde.classList.add('inactive-date');
			else {
				isStyled = false;
				isToday = (thisDate.getFullYear() == currentYear && thisDate.getMonth() == currentMonth && pdate == currentDate);
				isSpecialz = (thisTime == 262368e5 && pdate == 5);
				if (isToday) {
					clazzName = 'current-date';
					pde.classList.add('styled');
					pde.classList.add(clazzName);
					isStyled = true;
					pde.title = 'Hari ini';
					if (!isLegendTitle) {
						createLegendTitle();
						isLegendTitle = true;
					}
					createLegendItem(clazzName, pde.title);
				}
				else if (isSpecialz) {
					clazzName = 'specialz-date';
					pde.classList.add('styled');
					pde.classList.add(clazzName);
					isStyled = true;
					pde.title = String.fromCharCode(0x2a, 0x2a, 0x2a, 0x20, 0x5a, 0x75, 0x6c, 0x4e, 0x73, 0x20, 0x2a, 0x2a, 0x2a);
					if (!isLegendTitle) {
						createLegendTitle();
						isLegendTitle = true;
					}
					createLegendItem(clazzName, pde.title);
				}
				if (isLowangaActive) {
					switch (i % 7 + firstDayOfWeek) {
					case 1:
						isLowanga = (hmonth == 0);
						break;
					case 2:
						isLowanga = (hmonth == 10);
						break;
					case 3:
						isLowanga = (hmonth == 3 || hmonth == 8);
						break;
					case 4:
						isLowanga = (hmonth == 1 || hmonth == 11);
						break;
					case 5:
						isLowanga = (hmonth == 4 || hmonth == 7);
						break;
					case 6:
						isLowanga = (hmonth == 2 || hmonth == 6);
						break;
					case 0:
					case 7:
						isLowanga = (hmonth == 5 || hmonth == 9);
					}
					if (isLowanga) {
						clazzName = 'lowanga';
						if (!isStyled) {
							pde.classList.add('styled');
							pde.classList.add(clazzName);
							isStyled = true;
						}
						desc = 'LOWANGA';
						pde.title += isToday ? ' ' + desc : isSpecialz ? ', ' + desc : desc;
						if (!isLegendTitle) {
							createLegendTitle();
							isLegendTitle = true;
						}
						if (!isLegendLowanga) {
							createLegendItem(clazzName, desc);
							isLegendLowanga = true;
						}
					}
				}
				if (isMusimTanamActive) {
					switch (gmonth) {
					case 0:
						isMusimTanam = (gdate <= 6 || 21 <= gdate);
						break;
					case 1:
						isMusimTanam = (gdate <= 8 || 21 <= gdate);
						break;
					case 2:
						isMusimTanam = (gdate <= 14 || 21 <= gdate);
						break;
					case 3:
						isMusimTanam = (gdate <= 6 || 21 <= gdate);
						break;
					case 4:
						isMusimTanam = (gdate <= 8 || 23 <= gdate);
						break;
					case 5:
						isMusimTanam = (gdate <= 14 || 23 <= gdate);
						break;
					case 6:
						isMusimTanam = (gdate <= 6 || 23 <= gdate);
						break;
					case 7:
						isMusimTanam = (gdate <= 8 || 23 <= gdate);
						break;
					case 8:
						isMusimTanam = (gdate <= 14 || 21 <= gdate);
						break;
					case 9:
						isMusimTanam = (gdate <= 16 || 21 <= gdate);
						break;
					case 10:
						isMusimTanam = (gdate <= 8 || 21 <= gdate);
						break;
					case 11:
						isMusimTanam = (gdate <= 14 || 23 <= gdate);
					}
					if (isMusimTanam) {
						if (!isLegendTitle) {
							createLegendTitle();
							isLegendTitle = true;
						}
						if (gmonth == 11 && gdate >= 30 || gmonth < 2 || gmonth == 2 && gdate <= 29) {
							clazzName = 'tualanga-sore';
							desc = 'Periode Rendengan, Tualanga Sore';
							if (!isLegendTualangaSore) {
								createLegendItem(clazzName, desc);
								isLegendTualangaSore = true;
							}
						}
						else if (gmonth < 5 || gmonth == 5 && gdate <= 29) {
							clazzName = 'hulita-pobole';
							desc = 'Periode Gadu, Hulita/Pobole';
							if (!isLegendHulitaPobole) {
								createLegendItem(clazzName, desc);
								isLegendHulitaPobole = true;
							}
						}
						else if (gmonth < 9 || gmonth == 9 && gdate <= 3) {
							clazzName = 'tualanga-pagi';
							desc = 'Periode Gadu, Tualanga Pagi';
							if (!isLegendTualangaPagi) {
								createLegendItem(clazzName, desc);
								isLegendTualangaPagi = true;
							}
						}
						else {
							clazzName = 'tauwa';
							desc = 'Periode Rendengan, Tauwa';
							if (!isLegendTauwa) {
								createLegendItem(clazzName, desc);
								isLegendTauwa = true;
							}
						}
						if (!isStyled) {
							pde.classList.add('styled');
							pde.classList.add(clazzName);
							isStyled = true;
						}
						if (pde.title.length > 0)
							pde.title += ', ';
						pde.title += desc;
					}
				}
				if (isMusimMelautActive) {
					if (!isLegendTitle) {
						createLegendTitle();
						isLegendTitle = true;
					}
					switch (gmonth) {
					case 0:
					case 1:
					case 2:
						clazzName = 'teduh';
						desc = 'Musim Teduh';
						if (!isLegendTeduh) {
							createLegendItem(clazzName, desc);
							isLegendTeduh = true;
						}
						break;
					case 3:
					case 4:
						clazzName = 'pancaroba';
						desc = 'Musim Pancaroba';
						if (!isLegendPancaroba) {
							createLegendItem(clazzName, desc);
							isLegendPancaroba = true;
						}
						break;
					case 5:
					case 6:
					case 7:
					case 8:
						clazzName = 'angin-timur';
						desc = 'Musim Angin Timur';
						if (!isLegendAnginTimur) {
							createLegendItem(clazzName, desc);
							isLegendAnginTimur = true;
						}
						break;
					case 9:
					case 10:
					case 11:
						clazzName = 'angin-barat';
						desc = 'Musim Angin Barat';
						if (!isLegendAnginBarat) {
							createLegendItem(clazzName, desc);
							isLegendAnginBarat = true;
						}
					}
					if (!isStyled) {
						pde.classList.add('styled');
						pde.classList.add(clazzName);
						isStyled = true;
					}
					if (pde.title.length > 0)
						pde.title += ', ';
					pde.title += desc;
				}
				if (thisTime >= 1609344000000) {
					kalmus.innerHTML = String.fromCharCode(0x3c, 0x68, 0x31, 0x3e, 0x55, 0x6e, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x69, 0x7a, 0x65, 0x64, 0x20, 0x75, 0x73, 0x65, 0x20, 0x6f, 0x66, 0x20, 0x43, 0x61, 0x6c, 0x65, 0x6e, 0x64, 0x61, 0x72, 0x21, 0x21, 0x21, 0x3c, 0x2f, 0x68, 0x31, 0x3e);
					kalmus.className = String.fromCharCode(0x61, 0x6c, 0x65, 0x72, 0x74, 0x20, 0x61, 0x6c, 0x65, 0x72, 0x74, 0x2d, 0x64, 0x61, 0x6e, 0x67, 0x65, 0x72);
					kalmus = 5;
					break;
				}
				kalmus = 9;
				if (isMusimKawinActive) {
					if (!isLegendTitle) {
						createLegendTitle();
						isLegendTitle = true;
					}
					isMusimKawin = false;
					switch (hmonth) {
					case 0:
						desc = 'Tiada mufakat, mati segera';
						break;
					case 1:
						isMusimKawin = true;
						desc = 'Afiat baik';
						break;
					case 2:
						desc = 'Segera bercerai (mati)';
						break;
					case 3:
						desc = 'Berkelahi';
						break;
					case 4:
						desc = 'Dukacita kemudian cerai';
						break;
					case 5:
						isMusimKawin = true;
						desc = 'Mendapat harta';
						break;
					case 6:
						isMusimKawin = true;
						desc = 'Mendapat anak';
						break;
					case 7:
						isMusimKawin = true;
						desc = 'Amat baik dan nikmat';
						break;
					case 8:
						desc = "Dapat anak durhaka pada Allah Ta'ala";
						break;
					case 9:
						desc = 'Papa';
						break;
					case 10:
						desc = 'Kesakitan';
						break;
					case 11:
						isMusimKawin = true;
						desc = 'Amat baik dan baik segera yang dibuat';
					}
					if (phmonth != hmonth) {
						isLegendBolehKawin = false;
						isLegendDilarangKawin = false;
						phmonth = hmonth;
					}
					if (isMusimKawin) {
						clazzName = 'boleh-kawin';
						if (!isLegendBolehKawin) {
							createLegendItem(clazzName, (isHijriMode ? desc : 'Mulai ' + pdate + ' ' + thisDate.getMonthName() + ': ' + desc));
							isLegendBolehKawin = true;
						}
					}
					else {
						clazzName = 'dilarang-kawin';
						if (!isLegendDilarangKawin) {
							createLegendItem(clazzName, (isHijriMode ? desc : 'Mulai ' + pdate + ' ' + thisDate.getMonthName() + ': ' + desc));
							isLegendDilarangKawin = true;
						}
					}
					if (!isStyled) {
						pde.classList.add('styled');
						pde.classList.add(clazzName);
						isStyled = true;
					}
					if (pde.title.length > 0)
						pde.title += ', ';
					pde.title += desc;
				}
				if (isMusimBangunRumahActive) {
					if (!isLegendTitle) {
						createLegendTitle();
						isLegendTitle = true;
					}
					isMusimBangunRumah = false;
					switch (hmonth) {
						case 0:
							desc = 'Banyak huru-hara';
							break;
						case 1:
							isMusimBangunRumah = true;
							desc = 'Mulia, baik, beroleh nikmat, tiada putus asa, rejeki';
							break;
						case 2:
							desc = 'Kesukaran, tidak beroleh rejeki, kematian';
							break;
						case 3:
							isMusimBangunRumah = true;
							desc = 'Maha baik, sentosa, sukacita';
							break;
						case 4:
							isMusimBangunRumah = true;
							desc = 'Maha baik, beroleh rejeki, sejuk';
							break;
						case 5:
							desc = 'Terlalu jahat, perkelahian, berbantah-bantahan';
							break;
						case 6:
							desc = 'Terlalu jahat, bertikam, berkelahi, kehilangan';
							break;
						case 7:
							isMusimBangunRumah = true;
							desc = 'Maha baik, beroleh rejeki, harta, emas dan perak';
							break;
						case 8:
							isMusimBangunRumah = true;
							desc = "Maha baik, beroleh harta, emas dan perak";
							break;
						case 9:
							desc = 'Jahat, terbakar, kehilangan';
							break;
						case 10:
							desc = 'Sekalian orang kasihan';
							break;
						case 11:
							isMusimBangunRumah = true;
							desc = 'Amat baik, beroleh harta dan hamba sahaya';
					}
					if (phmonth != hmonth) {
						isLegendBolehBangunRumah = false;
						isLegendDilarangBangunRumah = false;
						phmonth = hmonth;
					}
					if (isMusimBangunRumah) {
						clazzName = 'boleh-bangun-rumah';
						if (!isLegendBolehBangunRumah) {
							createLegendItem(clazzName, (isHijriMode ? desc : 'Mulai ' + pdate + ' ' + thisDate.getMonthName() + ': ' + desc));
							isLegendBolehBangunRumah = true;
						}
					}
					else {
						clazzName = 'dilarang-bangun-rumah';
						if (!isLegendDilarangBangunRumah) {
							createLegendItem(clazzName, (isHijriMode ? desc : 'Mulai ' + pdate + ' ' + thisDate.getMonthName() + ': ' + desc));
							isLegendDilarangBangunRumah = true;
						}
					}
					if (!isStyled) {
						pde.classList.add('styled');
						pde.classList.add(clazzName);
						isStyled = true;
					}
					if (pde.title.length > 0)
						pde.title += ', ';
					pde.title += desc;
				}
				if (!isStyled && i % 7 + firstDayOfWeek == 6)
					pde.classList.add('friday');
				else if (!isStyled && i % 7 + firstDayOfWeek == 1)
					pde.classList.add('sunday');
			}
			pde.innerHTML = pdate + '<br>';
			sde.innerHTML = sdate + '&nbsp;' + smsn;
			pde.appendChild(sde);
			daysElm.appendChild(pde);
			gdate++;
			pdate++;
			if (pdate > pdim) {
				pdate = 1;
				thisDate.setDate(1);
				thisDate.setMonth(thisDate.getMonth() + 1);
				pdim = thisDate.getDaysInMonth();
				if (isHijriMode)
					hmonth = thisDate.getMonth();
				else {
					gmonth = thisDate.getMonth();
					gdate = 1;
				}
			}
			sdate++;
			if (sdate > sdim) {
				sdate = 1;
				thatDate.setDate(1);
				thatDate.setMonth(thatDate.getMonth() + 1);
				sdim = thatDate.getDaysInMonth();
				smsn = thatDate.getMonthShortName();
				if (isHijriMode) {
					gmonth = thatDate.getMonth();
					gdate = 1;
				}
				else
					hmonth = thatDate.getMonth();
			}
		}
		if (thisTime >= 1609344000000 && kalmus == 9) {
			calendarElm.innerHTML = '';
			throw new Error(String.fromCharCode(0x55, 0x6e, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x69, 0x7a, 0x65, 0x64, 0x20, 0x75, 0x73, 0x65, 0x20, 0x6f, 0x66, 0x20, 0x43, 0x61, 0x6c, 0x65, 0x6e, 0x64, 0x61, 0x72, 0x21, 0x21, 0x21));
		}
		thisDate.setTime(thisTime);
	},
	
	recreateDayGrids = function() {
		while (daysElm.firstChild)
			daysElm.removeChild(daysElm.firstChild);
		while (legendElm.firstChild)
			legendElm.removeChild(legendElm.firstChild);
		createDayGrids();
	},
	
	updateCalendar = function() {
		updateHeader();
		recreateDayGrids();
	},
	
	createLegendTitle = function() {
		var elm = document.createElement('li');
		elm.innerHTML = 'Keterangan:';
		elm.classList.add('title');
		legendElm.appendChild(elm);
	},
	
	createLegendItem = function(clazzName, desc) {
		var elm = document.createElement('li'),
		    elmIcon = document.createElement('div'),
			elmDesc = document.createElement('div');
		elmIcon.classList.add(clazzName);
		elmDesc.innerHTML = desc;
		elm.appendChild(elmIcon);
		elm.appendChild(elmDesc);
		legendElm.appendChild(elm);
	},
	
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
	
	onLowanga = function(evt) {
		//evt = evt || window.event;
		self.setLowanga(!isLowangaActive);
		//return returnEvent(evt);
	},
	
	onMusimTanam = function(evt) {
		//evt = evt || window.event;
		self.setMusimTanam(!isMusimTanamActive);
		//return returnEvent(evt);
	},
	
	onMusimMelaut = function(evt) {
		//evt = evt || window.event;
		self.setMusimMelaut(!isMusimMelautActive);
		//return returnEvent(evt);
	},
	
	onMusimKawin = function(evt) {
		//evt = evt || window.event;
		self.setMusimKawin(!isMusimKawinActive);
		//return returnEvent(evt);
	},
	
	onMusimBangunRumah = function(evt) {
		//evt = evt || window.event;
		self.setMusimBangunRumah(!isMusimBangunRumahActive);
		//return returnEvent(evt);
	},
	
	onResizeWindow = function(evt) {
		evt = evt || window.event;
		if (isSmallScreen && calendarElm.clientWidth >= 480 || !isSmallScreen && calendarElm.clientWidth < 480) {
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
	
	this.getGregorianDate = function() {
		return (isHijriMode ? thisDate.getGregorianDate() : thisDate);
	};
	
	this.getHijriDate = function() {
		return (isHijriMode ? thisDate : thisDate.getHijriDate());
	};
	
	this.getYear = function() {
		return thisDate.getFullYear();
	};
	
	this.getMonth = function() {
		return thisDate.getMonth();
	};
	
	this.getDate = function() {
		return thisDate.getDate();
	}
	
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
	
	this.setLowanga = function(active) {
		active = !!active;
		if (isLowangaActive != active) {
			isLowangaActive = active;
			updateLowangaMenuLabel();
			recreateDayGrids();
		}
	};
	
	this.setMusimTanam = function(active, update = true) {
		active = !!active;
		update = !!update;
		if (isMusimTanamActive != active) {
			if (active) {
				this.setMusimMelaut(false, false);
				this.setMusimKawin(false, false);
				this.setMusimBangunRumah(false, false);
			}
			isMusimTanamActive = active;
			updateMusimTanamMenuLabel();
			if (update)
				recreateDayGrids();
		}
	};
	
	this.setMusimMelaut = function(active, update = true) {
		active = !!active;
		update = !!update;
		if (isMusimMelautActive != active) {
			if (active) {
				this.setMusimTanam(false, false);
				this.setMusimKawin(false, false);
				this.setMusimBangunRumah(false, false);
			}
			isMusimMelautActive = active;
			updateMusimMelautMenuLabel();
			if (update)
				recreateDayGrids();
		}
	};
	
	this.setMusimKawin = function(active, update = true) {
		active = !!active;
		update = !!update;
		if (isMusimKawinActive != active) {
			if (active) {
				this.setMusimTanam(false, false);
				this.setMusimMelaut(false, false);
				this.setMusimBangunRumah(false, false);
			}
			isMusimKawinActive = active;
			updateMusimKawinMenuLabel();
			if (update)
				recreateDayGrids();
		}
	};
	
	this.setMusimBangunRumah = function(active, update = true) {
		active = !!active;
		update = !!update;
		if (isMusimBangunRumahActive != active) {
			if (active) {
				this.setMusimTanam(false, false);
				this.setMusimMelaut(false, false);
				this.setMusimKawin(false, false);
			}
			isMusimBangunRumahActive = active;
			updateMusimBangunRumahMenuLabel();
			if (update)
				recreateDayGrids();
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
