/*
 * Kalender Masehi/Hijriah using W3CSS
 * 
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 * Revised to using W3CSS, @Gorontalo, Indonesia, 14 January 2019
 */
function Calendar(isHijr,firstDay,year,month){
	if(typeof HijriDate=='undefined')throw new Error('Required HijriDate() class!');
	isHijr=!!isHijr;
	firstDay=firstDay==undefined?1:~~firstDay;
	if(firstDay>1)firstDay=1;
	const BLACK_TEXT_THEME_NUMBER=16;
	var self=this,
	hDate=new HijriDate(),
	gDate=hDate.getGregorianDate(),
	dispDate=isHijr?hDate:gDate,
	tzOffset=hDate.getTimezoneOffset(),
	curY,
	curM,
	curD,
	curLang='en',
	gridAni='bottom',
	actTmo=300,// in seconds (default is 5 minutes)
	actTmoId,
	isDispToday=false,
	curThemIdx=-1,
	isSmallScreen=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<640,
	hasEventListeners=!!window.addEventListener;
	createElement=function(tagName,className,innerHTML){
		var elm=document.createElement(tagName);
		if(className)elm.className=className;
		if(innerHTML)elm.innerHTML=innerHTML;
		return elm;
	},
	calendarElm=createElement('div'),
	headerElm=createElement('div','w3-container w3-padding-small w3-theme-color'),
	yearValueElm=createElement('span'),
	monthValueElm=createElement('span'),
	gridsElm=createElement('div'),
	weekdayTitleElm=createElement('div','w3-cell-row w3-center w3-large w3-light-grey');
	menuContainerElm=createElement('div','w3-dropdown-content w3-bar-block w3-border w3-animate-opacity'),
	menuCalendarModeElm=createElement('span','w3-bar-item w3-button'),
	menuFirstDayOfWeekElm=createElement('span','w3-bar-item w3-button'),
	menuItemTodayElm=createElement('span','w3-bar-item w3-button'),
	menuItemNewThemeElm=createElement('span','w3-bar-item w3-button'),
	menuItemAboutElm=createElement('span','w3-bar-item w3-button'),
	menuItemCancelElm=createElement('span','w3-bar-item w3-button'),
	aboutModalElm=createElement('div','w3-modal'),
	createCalendar=function(){
		var rootMenuElm=createElement('div','w3-dropdown-click'),
			menuBtnElm=createElement('div','w3-button','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M0 6L18 6L18 8L0 8Z M0 13L18 13L18 15L0 15Z M0 20L18 20L18 22L0 22Z" stroke-width="1"/></svg>'),
			yearPanelElm=createElement('div','w3-center w3-xxxlarge'),
			prevYearBtnElm=createElement('div','w3-button w3-medium w3-left','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M7 7L2 15L7 23L9 23L4 15L9 7Z M14 7L9 15L14 23L16 23L11 15L16 7Z" stroke-width="1"/></svg>'),
			nextYearBtnElm=createElement('div','w3-button w3-medium w3-right','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M11 7L16 15L11 23L9 23L14 15L9 7Z M4 7L9 15L4 23L2 23L7 15L2 7Z" stroke-width="1"/></svg>'),
			monthPanelElm=createElement('div','w3-center w3-xxlarge'),
			prevMonthBtnElm=createElement('div','w3-button w3-medium w3-left','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M10 7L5 15L10 23L12 23L7 15L12 7Z" stroke-width="1"/></svg>'),
			nextMonthBtnElm=createElement('div','w3-button w3-medium w3-right','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M8 7L13 15L8 23L6 23L11 15L6 7Z" stroke-width="1"/></svg>'),
			aboutContentElm=createElement('div','w3-modal-content w3-animate-zoom w3-card-4'),
			aboutContentWrapperElm=createElement('div','w3-center w3-padding-24'),
			aboutCloseBtnElm=createElement('span','w3-button w3-large w3-display-topright','&times;'),
			aboutTagsContainerElm=createElement('div','w3-container w3-padding-24'),
			aboutTag1Elm=createElement('span','w3-tag w3-jumbo','&#90;'),
			aboutTag2Elm=createElement('span','w3-tag w3-jumbo w3-red','&#117;'),
			aboutTag3Elm=createElement('span','w3-tag w3-jumbo w3-blue','&#108;'),
			aboutTag4Elm=createElement('span','w3-tag w3-jumbo','&#78;'),
			aboutTag5Elm=createElement('span','w3-tag w3-jumbo w3-amber','&#115;'),
			aboutTextElm=createElement('p','w3-large','&#71;&#111;&#114;&#111;&#110;&#116;&#97;&#108;&#111;&#44;&nbsp;&#49;&#52;&nbsp;&#74;&#97;&#110;&#117;&#97;&#114;&#121;&nbsp;&#50;&#48;&#49;&#57;');
		prevYearBtnElm.style.cssText=nextYearBtnElm.style.cssText='margin-top:14px;';
		prevMonthBtnElm.style.cssText=nextMonthBtnElm.style.cssText='margin-top:6px;';
		yearValueElm.style.cssText=monthValueElm.style.cssText=gridsElm.style.cssText='cursor:default;';
		weekdayTitleElm.style.cssText='padding:8px 0px;margin-bottom:8px;';
		menuContainerElm.appendChild(menuCalendarModeElm);
		menuContainerElm.appendChild(menuFirstDayOfWeekElm);
		menuContainerElm.appendChild(menuItemTodayElm);
		menuContainerElm.appendChild(menuItemNewThemeElm);
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
		aboutTagsContainerElm.appendChild(createElement('span',null,'&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag2Elm);
		aboutTagsContainerElm.appendChild(createElement('span',null,'&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag3Elm);
		aboutTagsContainerElm.appendChild(createElement('span',null,'&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag4Elm);
		aboutTagsContainerElm.appendChild(createElement('span',null,'&nbsp;'));
		aboutTagsContainerElm.appendChild(aboutTag5Elm);
		aboutContentWrapperElm.appendChild(aboutCloseBtnElm);
		aboutContentWrapperElm.appendChild(aboutTagsContainerElm);
		aboutContentWrapperElm.appendChild(aboutTextElm);
		aboutContentElm.appendChild(aboutContentWrapperElm);
		aboutModalElm.appendChild(aboutContentElm);
		aboutContentElm.style.cssText='max-width:400px;';
		calendarElm.appendChild(aboutModalElm);
		addEvent(rootMenuElm,'mouseenter',onHoverMenu);
		addEvent(rootMenuElm,'mouseleave',onUnhoverMenu);
		addEvent(prevYearBtnElm,'mouseenter',onHoverBtn);
		addEvent(prevYearBtnElm,'mouseleave',onUnhoverBtn);
		addEvent(nextYearBtnElm,'mouseenter',onHoverBtn);
		addEvent(nextYearBtnElm,'mouseleave',onUnhoverBtn);
		addEvent(prevMonthBtnElm,'mouseenter',onHoverBtn);
		addEvent(prevMonthBtnElm,'mouseleave',onUnhoverBtn);
		addEvent(nextMonthBtnElm,'mouseenter',onHoverBtn);
		addEvent(nextMonthBtnElm,'mouseleave',onUnhoverBtn);
		addEvent(menuBtnElm,'click',onClickMenu);
		addEvent(menuCalendarModeElm,'click',onChangeCalendarMode);
		addEvent(menuFirstDayOfWeekElm,'click',onChangeFirstDayOfWeek);
		addEvent(menuItemTodayElm,'click',onDisplayToday);
		addEvent(menuItemNewThemeElm,'click',onNewTheme);
		addEvent(menuItemAboutElm,'click',onAbout);
		addEvent(menuItemCancelElm,'click',onCancel);
		addEvent(prevYearBtnElm,'click',onDecrementYear);
		addEvent(nextYearBtnElm,'click',onIncrementYear);
		addEvent(prevMonthBtnElm,'click',onDecrementMonth);
		addEvent(nextMonthBtnElm,'click',onIncrementMonth);
		addEvent(aboutCloseBtnElm,'click',onCloseAbout);
		addEvent(window,'resize',onResizeWindow);
		updateMenuLabel();
		updateCalendarModeMenuLabel();
		updateHeader();
		createWeekdayTitle();
		createDayGrid();
		newTheme();
	},
	addEvent=function(elm,evt,callback,option){
		if(elm==null||typeof(elm)=='undefined')return;
		if(hasEventListeners)elm.addEventListener(evt,callback,!!option);
		else if(elm.attachEvent)elm.attachEvent('on'+evt,callback);
		else elm['on'+evt]=callback;
	},
	updateMenuLabel=function(){
		menuItemTodayElm.innerHTML=Calendar.strData[curLang]['menuItem2'];
		menuItemNewThemeElm.innerHTML=Calendar.strData[curLang]['menuItem3'];
		menuItemAboutElm.innerHTML=Calendar.strData[curLang]['menuItem4'];
		menuItemCancelElm.innerHTML=Calendar.strData[curLang]['menuItem5']+'<span class="w3-right">&times;</span>';
	},
	updateCalendarModeMenuLabel=function(){
		menuCalendarModeElm.innerHTML=Calendar.strData[curLang]['menuItem0'][isHijr?1:0];
	},
	updateHeader=function(){
		var year=dispDate.getFullYear(),idx=isHijr?0:2;
		if(year<1){idx++;year=-year+1;}
		yearValueElm.innerHTML=year+'&nbsp;'+Calendar.strData[curLang]['eraSuffix'][idx];
		monthValueElm.innerHTML=dispDate.getMonthName(curLang);
	},
	createWeekdayTitle=function(){
		var lengthType=isSmallScreen?'shortWeekdayNames':'weekdayNames';
		for(var i=firstDay;i<7+firstDay;i++){
			var dayTitleElm=createElement('div','w3-cell',Calendar.strData[curLang][lengthType][i%7]);
			if(i==5)dayTitleElm.className+=' w3-text-teal';
			if(i%7==0)dayTitleElm.className+=' w3-text-red';
			dayTitleElm.style.width='14.2857%';
			weekdayTitleElm.appendChild(dayTitleElm);
		}
		menuFirstDayOfWeekElm.innerHTML=Calendar.strData[curLang]['menuItem1'][firstDay];
	},
	recreateWeekdayTitle=function(){
		while(weekdayTitleElm.firstChild)weekdayTitleElm.removeChild(weekdayTitleElm.firstChild);
		createWeekdayTitle();
	},
	createDayGrid=function(){
		var dispTm=dispDate.getTime(),
			ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		var pcdr=dispDate.getDaysInMonth(),
			pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);
		dispDate.syncDates();
		var pdate=dispDate.getDate(),
			sdate=dispDate.getOppositeDate().getDate(),
			pdim=dispDate.getDaysInMonth(),
			sdim=dispDate.getOppositeDate().getDaysInMonth(),
			smsn=dispDate.getOppositeDate().getShortMonthName(curLang),
			isFri=6-firstDay,
			isSun=1-firstDay,
			gridCtr=0,
			isToday;
		isDispToday=false;
		menuItemTodayElm.className=menuItemTodayElm.className.replace(' w3-disabled','');
		menuItemTodayElm.style.cursor='';
		for(var i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){
				var row=createElement('div','w3-cell-row w3-center');
				gridsElm.appendChild(row);
			}
			var grid=createElement('div','w3-cell w3-animate-'+gridAni),
				pde=createElement('div','w3-xlarge'),
				sde=createElement('div','w3-small');
			grid.style.cssText='width:14.2857%;padding:6px 0px;';
			grid.appendChild(pde);
			grid.appendChild(sde);
			row.appendChild(grid);
			isToday=dispDate.getFullYear()==curY&&dispDate.getMonth()==curM&&pdate==curD;
			if(i%7==isFri)grid.className+=isToday?' w3-teal':' w3-text-teal';
			else if(i%7==isSun)grid.className+=isToday?' w3-red':' w3-text-red';
			else if(isToday)grid.className+=' w3-dark-grey';
			if(dispTm==262584e5&&pdate==sdate&&pdate==5){
				grid.className+=' w3-black';
				grid.style.cursor='pointer';
				addEvent(grid,'click',onAbout);
			}
			if(i<=ppdr||ppdr+pcdr<i){
				grid.className+=' w3-disabled';
				grid.style.cursor='default';
			}
			else if(isToday){
				isDispToday=true;
				menuItemTodayElm.className+=' w3-disabled';
				menuItemTodayElm.style.cursor='default';
				if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null;}
			}
			pde.innerHTML=pdate;
			sde.innerHTML=sdate+'&nbsp;'+smsn;
			pdate++;
			if(pdate>pdim){
				pdate=1;
				dispDate.setDate(1);
				dispDate.setMonth(dispDate.getMonth()+1);
				pdim=dispDate.getDaysInMonth();
			}
			sdate++;
			if(sdate>sdim){
				sdate=1;
				dispDate.getOppositeDate().setDate(1);
				dispDate.getOppositeDate().setMonth(dispDate.getOppositeDate().getMonth()+1);
				sdim=dispDate.getOppositeDate().getDaysInMonth();
				smsn=dispDate.getOppositeDate().getShortMonthName(curLang);
			}
			gridCtr=(gridCtr+1)%7;
		}
		dispDate.setTime(dispTm);
	},
	recreateDayGrid=function(){
		while(gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1]);
		createDayGrid();
	},
	updateCalendar=function(){
		updateHeader();
		recreateDayGrid();
	},
	onDecrementMonth=function(evt){
		dispDate.setMonth(dispDate.getMonth()-1);
		gridAni='right';
		updateCalendar();
		applyActionTimeout();
	},
	onIncrementMonth=function(evt){
		dispDate.setMonth(dispDate.getMonth()+1);
		gridAni='left';
		updateCalendar();
		applyActionTimeout();
	},
	onDecrementYear=function(evt){
		dispDate.setFullYear(dispDate.getFullYear()-1);
		gridAni='right';
		updateCalendar();
		applyActionTimeout();
	},
	onIncrementYear=function(evt){
		dispDate.setFullYear(dispDate.getFullYear()+1);
		gridAni='left';
		updateCalendar();
		applyActionTimeout();
	},
	onHoverMenu=function(evt){
		if(curThemIdx>=BLACK_TEXT_THEME_NUMBER){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeColor(target.children[0],'#000');
		}
	},
	onUnhoverMenu=function(evt){
		hideMenu();
		if(curThemIdx>=BLACK_TEXT_THEME_NUMBER){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeColor(target.children[0],'#fff');
		}
	},
	onHoverBtn=function(evt){
		if(curThemIdx>=BLACK_TEXT_THEME_NUMBER){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeColor(target,'#000');
		}
	},
	onUnhoverBtn=function(evt){
		if(curThemIdx>=BLACK_TEXT_THEME_NUMBER){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeColor(target,'#fff');
		}
	},
	setStrokeColor=function(elm,color){elm.children[0].setAttribute('stroke',color);elm.children[0].setAttribute('fill',color);},
	hideMenu=function(){menuContainerElm.className=menuContainerElm.className.replace(' w3-show','');},
	onClickMenu=function(evt){
		if(menuContainerElm.className.indexOf('w3-show')==-1)menuContainerElm.className+=' w3-show';
		else hideMenu();
	},
	onChangeCalendarMode=function(evt){hideMenu();self.setHijriMode(!isHijr);applyActionTimeout();},
	onChangeFirstDayOfWeek=function(evt){hideMenu();self.setFirstDayOfWeek(1-firstDay);applyActionTimeout();},
	onDisplayToday=function(evt){hideMenu();self.today();},
	onNewTheme=function(evt){hideMenu();newTheme();},
	onAbout=function(evt){
		hideMenu();
		aboutModalElm.style.display='block';
		if(actTmoId)window.clearTimeout(actTmoId);
		actTmoId=window.setTimeout(function(){
			aboutModalElm.style.display='none';
			if(!isDispToday){newTheme();self.today();}
		},actTmo*1000);
	},
	onCloseAbout=function(evt){aboutModalElm.style.display='none';applyActionTimeout();},
	onCancel=function(evt){hideMenu();},
	onResizeWindow=function(evt){
		if(isSmallScreen&&calendarElm.clientWidth>=640||!isSmallScreen&&calendarElm.clientWidth<640){
			isSmallScreen=!isSmallScreen;
			recreateWeekdayTitle();
		}
	},
	getCurrentDate=function(){
		var savedTm=dispDate.getTime();
		dispDate.setTime(Date.now());
		curY=dispDate.getFullYear();
		curM=dispDate.getMonth();
		curD=dispDate.getDate();
		dispDate.setTime(savedTm);
	},
	beginNewDate=function(){
		var now=Date.now();
		now-=tzOffset * 6e4;
		var to=864e5-now%864e5;
		window.setTimeout(beginNewDate,to);
		getCurrentDate();
		if(isDispToday){newTheme();self.today();}
	},
	applyActionTimeout=function(){
		if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null;}
		if(!isDispToday)actTmoId=window.setTimeout(self.today,actTmo*1000);
	},
	newTheme=function(theme){
		var themeIdx=-1;
		if(theme){
			for(var i=0;i<Calendar.themes.length;i++)if(theme==Calendar.themes[i]){themeIdx=i;break;}
			if(themeIdx==-1)return false;
		}else{
			do{themeIdx=Math.floor(Math.random() * Calendar.themes.length);}
			while(curThemIdx==themeIdx);
		}
		headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'));
		headerElm.className+='w3-'+Calendar.themes[themeIdx];
		var elms=calendarElm.querySelectorAll('div.w3-button'),
			color=themeIdx<BLACK_TEXT_THEME_NUMBER?'#000':'#fff';
		for(var i=0;i<elms.length;i++)setStrokeColor(elms[i],color);
		curThemIdx=themeIdx;
		return true;
	};
	this.getElement=function(){return calendarElm;};
	this.setHijriMode=function(hm){
		if((hm==true||hm==false)&&isHijr!=hm){
			isHijr=hm;
			dispDate.syncDates();
			//if(isHijr){pDate=hDate;sDate=gDate;}
			//else{pDate=gDate;sDate=hDate;}
			dispDate=dispDate.getOppositeDate();
			getCurrentDate();
			updateCalendarModeMenuLabel();
			if(isDispToday){dispDate.setDate(1);this.today();}
			else{
				if(dispDate.getDate()>15)dispDate.setMonth(dispDate.getMonth()+1);
				dispDate.setDate(1);
				gridAni='bottom';
				updateCalendar();
			}
			return true;
		}
		return false;
	};
	this.setFirstDayOfWeek=function(fdow){
		if((fdow==0||fdow==1)&&fdow!=firstDay){
			firstDay=fdow;
			recreateWeekdayTitle();
			gridAni='bottom';
			recreateDayGrid();
			return true;
		}
		return false;
	};
	this.setYear=function(year){
		if(!isNaN(year)&&year!=pDate.getFullYear()){
			dispDate.setFullYear(year);
			gridAni='bottom';
			updateCalendar();
			return true;
		}
		return false;
	};
	this.setMonth=function(month){
		if(!isNaN(month)&&month!=pDate.getMonth()){
			dispDate.setMonth(month);
			gridAni='bottom';
			updateCalendar();
			return true;
		}
		return false;
	};
	this.today=function(){
		dispDate.setFullYear(curY);
		dispDate.setMonth(curM);
		gridAni='bottom';
		updateCalendar();
	};
	this.setLanguage=function(lang){
		lang=lang.toLowerCase();
		for(var li in Calendar.strData){
			if(li==lang){
				curLang=li;
				gridAni='bottom';
				updateMenuLabel();
				updateCalendarModeMenuLabel();
				updateHeader();
				recreateWeekdayTitle();
				recreateDayGrid();
				return true;
			}
		}
		return false;
	};
	this.setTheme=function(theme){return newTheme(theme);};
	this.setActionTimeout=function(tmo){
		if(!isNaN(tmo)&&tmo>=10){actTmo=tmo;applyActionTimeout();return true;}
		return false;
	};
	gDate.hijriDate=hDate;
	beginNewDate();
	year=parseInt(year);
	month=parseInt(month);
	if(isNaN(year)){year=curY;if(isNaN(month))month=curM;}
	else if(isNaN(month))month=0;
	dispDate.setFullYear(year);
	dispDate.setMonth(month);
	dispDate.setDate(1);
	dispDate.setHours(6);
	dispDate.setMinutes(0);
	dispDate.setSeconds(0);
	dispDate.setMilliseconds(0);
	createCalendar();
}
HijriDate.prototype.getMonthName=function(lang){
	if(typeof lang=='undefined'||lang=='en')return HijriDate.monthNames[this.getMonth()];
	for(var li in Calendar.strData){if(li==lang)return Calendar.strData[li]['hMonthNames'][this.getMonth()];}
	return null;
};
HijriDate.prototype.getShortMonthName=function(lang){
	if(typeof lang=='undefined'||lang=='en')return HijriDate.shortMonthNames[this.getMonth()];
	for(var li in Calendar.strData){if(li==lang)return Calendar.strData[li]['hShortMonthNames'][this.getMonth()];}
	return null;
};
HijriDate.prototype.getOppositeDate=function(){return this.getGregorianDate();};
Date.prototype.getMonthName=function(lang){
	for(var li in Calendar.strData){if(li==lang)return Calendar.strData[li]['monthNames'][this.getMonth()];}
	return null;
};
Date.prototype.getShortMonthName=function(lang){
	for(var li in Calendar.strData){if(li==lang)return Calendar.strData[li]['shortMonthNames'][this.getMonth()];}
	return null;
};
Date.prototype.getOppositeDate=function(){return this.hijriDate;};
Calendar.themes=['amber','aqua','cyan','grey','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','sand','white','yellow','black','blue','blue-grey','brown','dark-grey','deep-orange','deep-purple','green','indigo','pink','purple','red','teal'];
Calendar.strData={
	"en":{
		"menuItem0":["Hijri&nbsp;calendar","Gregorian&nbsp;calendar"],
		"menuItem1":["Monday&nbsp;first","Sunday&nbsp;first"],
		"menuItem2":"Today",
		"menuItem3":"New&nbsp;theme",
		"menuItem4":"About",
		"menuItem5":"Cancel",
		"eraSuffix":["H","BH","AD","BC"],
		"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],
		"shortMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		"weekdayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		"shortWeekdayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
	},
	"id":{
		"menuItem0":["Kalender&nbspHijriyah","Kalender&nbsp;Masehi"],
		"menuItem1":["Mulai&nbsp;Senin","Mulai&nbsp;Minggu"],
		"menuItem2":"Hari&nbsp;ini",
		"menuItem3":"Tema&nbsp;baru",
		"menuItem4":"Tentang",
		"menuItem5":"Batal",
		"eraSuffix":["H","SH","M","SM"],
		"monthNames":["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
		"shortMonthNames":["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
		"weekdayNames":["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
		"shortWeekdayNames":["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
		"hMonthNames":["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
		"hShortMonthNames":["Muh","Saf","Raw","Rak","Jaw","Jak","Raj","Sya","Ram","Syw","Zuq","Zuh"]
	}
};
