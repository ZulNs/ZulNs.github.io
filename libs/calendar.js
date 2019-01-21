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
	const BLACK_TXT_THEME_COUNT=15;
	var self=this,
	hDate=new HijriDate(),
	gDate=hDate.getGregorianDate(),
	dispDate=isHijr?hDate:gDate,
	tzOffset=hDate.getTimezoneOffset()*6e4,
	curLang='en',
	gridAni='zoom',
	actTmo=300,//in seconds (default is 5 minutes)
	actTmoId,
	isDispToday=false,
	isAttached=false,
	curThemIdx=-1,
	isSmallScreen=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<640,
	createElm=function(tagName,className,innerHTML){
		var elm=document.createElement(tagName);
		if(className)elm.className=className;
		if(innerHTML)elm.innerHTML=innerHTML;
		return elm;
	},
	calElm=createElm('div','w3-card-4'),
	headerElm=createElm('div','w3-display-container w3-theme-color'),
	todayElm=createElm('div','w3-display-topright w3-xlarge');
	yearValElm=createElm('div','w3-display-middle w3-xxxlarge'),
	monthValElm=createElm('div','w3-display-bottommiddle w3-xxlarge'),
	menuWrapElm=createElm('div','w3-dropdown-content w3-bar-block w3-border w3-animate-opacity'),
	menuCalModElm=createElm('span','w3-bar-item w3-button'),
	menuFirstDayElm=createElm('span','w3-bar-item w3-button'),
	menuTodayElm=createElm('span','w3-bar-item w3-button'),
	menuNewThemeElm=createElm('span','w3-bar-item w3-button'),
	menuAboutElm=createElm('span','w3-bar-item w3-button'),
	menuCancelElm=createElm('span','w3-bar-item w3-button'),
	weekdayTitleElm=createElm('div','w3-cell-row w3-center w3-large w3-light-grey');
	gridsElm=createElm('div'),
	aboutModalElm=createElm('div','w3-modal'),
	createCal=function(){
		var rootMenuElm=createElm('div','w3-dropdown-click w3-display-topleft'),
			menuBtnElm=createElm('div','w3-button','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M0 6L18 6L18 8L0 8Z M0 13L18 13L18 15L0 15Z M0 20L18 20L18 22L0 22Z" stroke-width="1"/></svg>'),
			prevYearBtnElm=createElm('div','w3-button w3-display-left','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M7 7L2 15L7 23L9 23L4 15L9 7Z M14 7L9 15L14 23L16 23L11 15L16 7Z" stroke-width="1"/></svg>'),
			nextYearBtnElm=createElm('div','w3-button w3-display-right','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M11 7L16 15L11 23L9 23L14 15L9 7Z M4 7L9 15L4 23L2 23L7 15L2 7Z" stroke-width="1"/></svg>'),
			prevMonthBtnElm=createElm('div','w3-button w3-display-bottomleft','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M10 7L5 15L10 23L12 23L7 15L12 7Z" stroke-width="1"/></svg>'),
			nextMonthBtnElm=createElm('div','w3-button w3-display-bottomright','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="23"><path d="M8 7L13 15L8 23L6 23L11 15L6 7Z" stroke-width="1"/></svg>'),
			aboutContentElm=createElm('div','w3-modal-content w3-animate-zoom w3-card-4'),
			aboutContentWrapElm=createElm('div','w3-center w3-padding-24'),
			aboutCloseBtnElm=createElm('span','w3-button w3-large w3-display-topright','&times;'),
			aboutTagsWrapElm=createElm('div','w3-container w3-padding-24'),
			aboutTag1Elm=createElm('span','w3-tag w3-jumbo','&#90;'),
			aboutTag2Elm=createElm('span','w3-tag w3-jumbo w3-red','&#117;'),
			aboutTag3Elm=createElm('span','w3-tag w3-jumbo w3-blue','&#108;'),
			aboutTag4Elm=createElm('span','w3-tag w3-jumbo','&#78;'),
			aboutTag5Elm=createElm('span','w3-tag w3-jumbo w3-amber','&#115;'),
			aboutTextElm=createElm('p','w3-large','&#71;&#111;&#114;&#111;&#110;&#116;&#97;&#108;&#111;&#44;&nbsp;&#49;&#52;&nbsp;&#74;&#97;&#110;&#117;&#97;&#114;&#121;&nbsp;&#50;&#48;&#49;&#57;');
		headerElm.style.cssText='height:180px;';
		todayElm.style.cssText='margin:16px 28px 0px 0px;cursor:default;';
		yearValElm.style.cssText=gridsElm.style.cssText='cursor:default;';
		monthValElm.style.cssText='margin-bottom:8px;cursor:default;';
		rootMenuElm.style.cssText='margin:12px 0px 0px 12px;';
		prevYearBtnElm.style.cssText='margin-left:12px;';
		nextYearBtnElm.style.cssText='margin-right:12px;';
		prevMonthBtnElm.style.cssText='margin:0px 0px 12px 12px;';
		nextMonthBtnElm.style.cssText='margin:0px 12px 12px 0px;';
		weekdayTitleElm.style.cssText='padding:8px 0px;margin-bottom:8px;';
		menuWrapElm.appendChild(menuCalModElm);
		menuWrapElm.appendChild(menuFirstDayElm);
		menuWrapElm.appendChild(menuTodayElm);
		menuWrapElm.appendChild(menuNewThemeElm);
		menuWrapElm.appendChild(menuAboutElm);
		menuWrapElm.appendChild(menuCancelElm);
		rootMenuElm.appendChild(menuBtnElm);
		rootMenuElm.appendChild(menuWrapElm);
		headerElm.appendChild(todayElm);
		headerElm.appendChild(yearValElm);
		headerElm.appendChild(monthValElm);
		headerElm.appendChild(rootMenuElm);
		headerElm.appendChild(prevYearBtnElm);
		headerElm.appendChild(nextYearBtnElm);
		headerElm.appendChild(prevMonthBtnElm);
		headerElm.appendChild(nextMonthBtnElm);
		gridsElm.appendChild(weekdayTitleElm);
		calElm.appendChild(headerElm);
		calElm.appendChild(gridsElm);
		aboutTagsWrapElm.appendChild(aboutTag1Elm);
		aboutTagsWrapElm.appendChild(createElm('span',null,'&nbsp;'));
		aboutTagsWrapElm.appendChild(aboutTag2Elm);
		aboutTagsWrapElm.appendChild(createElm('span',null,'&nbsp;'));
		aboutTagsWrapElm.appendChild(aboutTag3Elm);
		aboutTagsWrapElm.appendChild(createElm('span',null,'&nbsp;'));
		aboutTagsWrapElm.appendChild(aboutTag4Elm);
		aboutTagsWrapElm.appendChild(createElm('span',null,'&nbsp;'));
		aboutTagsWrapElm.appendChild(aboutTag5Elm);
		aboutContentWrapElm.appendChild(aboutCloseBtnElm);
		aboutContentWrapElm.appendChild(aboutTagsWrapElm);
		aboutContentWrapElm.appendChild(aboutTextElm);
		aboutContentElm.appendChild(aboutContentWrapElm);
		aboutModalElm.appendChild(aboutContentElm);
		aboutContentElm.style.cssText='max-width:400px;';
		calElm.appendChild(aboutModalElm);
		addEvt(rootMenuElm,'mouseenter',onHoverMenu);
		addEvt(rootMenuElm,'mouseleave',onUnhoverMenu);
		addEvt(prevYearBtnElm,'mouseenter',onHoverBtn);
		addEvt(prevYearBtnElm,'mouseleave',onUnhoverBtn);
		addEvt(nextYearBtnElm,'mouseenter',onHoverBtn);
		addEvt(nextYearBtnElm,'mouseleave',onUnhoverBtn);
		addEvt(prevMonthBtnElm,'mouseenter',onHoverBtn);
		addEvt(prevMonthBtnElm,'mouseleave',onUnhoverBtn);
		addEvt(nextMonthBtnElm,'mouseenter',onHoverBtn);
		addEvt(nextMonthBtnElm,'mouseleave',onUnhoverBtn);
		addEvt(menuBtnElm,'click',onClickMenu);
		addEvt(menuCalModElm,'click',onChgCalMod);
		addEvt(menuFirstDayElm,'click',onChgFirstDay);
		addEvt(menuTodayElm,'click',onDispToday);
		addEvt(menuNewThemeElm,'click',onNewTheme);
		addEvt(menuAboutElm,'click',onAbout);
		addEvt(menuCancelElm,'click',onCancel);
		addEvt(prevYearBtnElm,'click',onDecYear);
		addEvt(nextYearBtnElm,'click',onIncYear);
		addEvt(prevMonthBtnElm,'click',onDecMonth);
		addEvt(nextMonthBtnElm,'click',onIncMonth);
		addEvt(aboutCloseBtnElm,'click',onCloseAbout);
		addEvt(window,'resize',onRszWdw);
		updMenuLbl();
		updCalModMenuLbl();
		updHeader();
		createWdayTitle();
		createDates();
		newTheme();
	},
	addEvt=function(elm,evt,callback){
		if(window.addEventListener)elm.addEventListener(evt,callback);
		else if(elm.attachEvent)elm.attachEvent('on'+evt,callback);
		else elm['on'+evt]=callback;
	},
	updMenuLbl=function(){
		menuTodayElm.innerHTML=Calendar.strData[curLang]['menuItem2'];
		menuNewThemeElm.innerHTML=Calendar.strData[curLang]['menuItem3'];
		menuAboutElm.innerHTML=Calendar.strData[curLang]['menuItem4'];
		menuCancelElm.innerHTML=Calendar.strData[curLang]['menuItem5']+'<span class="w3-right">&times;</span>';
	},
	updCalModMenuLbl=function(){
		menuCalModElm.innerHTML=Calendar.strData[curLang]['menuItem0'][isHijr?1:0];
	},
	updTodayLbl=function(){todayElm.innerHTML=isSmallScreen?dispDate.todayShortString():dispDate.todayString();},
	updHeader=function(){
		var year=dispDate.getFullYear(),idx=isHijr?0:2;
		if(year<1){idx++;year=-year+1;}
		yearValElm.innerHTML=year+'&nbsp;'+Calendar.strData[curLang]['eraSuffix'][idx];
		monthValElm.innerHTML=dispDate.getMonthName();
	},
	createWdayTitle=function(){
		var lengthType=isSmallScreen?'weekdayShortNames':'weekdayNames';
		for(var i=firstDay;i<7+firstDay;i++){
			var dayTitleElm=createElm('div','w3-cell',Calendar.strData[curLang][lengthType][i%7]);
			if(i==5)dayTitleElm.className+=' w3-text-teal';
			if(i%7==0)dayTitleElm.className+=' w3-text-red';
			dayTitleElm.style.width='14.2857%';
			weekdayTitleElm.appendChild(dayTitleElm);
		}
		menuFirstDayElm.innerHTML=Calendar.strData[curLang]['menuItem1'][firstDay];
	},
	recreateWdayTitle=function(){
		while(weekdayTitleElm.firstChild)weekdayTitleElm.removeChild(weekdayTitleElm.firstChild);
		createWdayTitle();
	},
	createDates=function(){
		var dispTm=dispDate.getTime(),ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		var pcdr=dispDate.getDaysInMonth(),pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);
		dispDate.syncDates();
		var pdate=dispDate.getDate(),
			sdate=dispDate.getOppositeDate().getDate(),
			pdim=dispDate.getDaysInMonth(),
			sdim=dispDate.getOppositeDate().getDaysInMonth(),
			smsn=dispDate.getOppositeDate().getMonthShortName(),
			isFri=6-firstDay,isSun=1-firstDay,
			gridCtr=0,isToday;
		dispDate.setDate(1);
		dispDate.getOppositeDate().setDate(1);
		isDispToday=false;
		menuTodayElm.className=menuTodayElm.className.replace(' w3-disabled','');
		menuTodayElm.style.cursor='';
		for(var i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){
				var row=createElm('div','w3-cell-row w3-center');
				gridsElm.appendChild(row);
			}
			var grid=createElm('div','w3-cell w3-animate-'+gridAni),
				pde=createElm('div','w3-xlarge'),
				sde=createElm('div','w3-small');
			grid.style.cssText='width:14.2857%;padding:6px 0px;';
			grid.appendChild(pde);
			grid.appendChild(sde);
			row.appendChild(grid);
			isToday=getCurTime()==dispDate.getTime()+(pdate-1)*864e5;
			if(i%7==isFri)grid.className+=isToday?' w3-teal':' w3-text-teal';
			else if(i%7==isSun)grid.className+=isToday?' w3-red':' w3-text-red';
			else if(isToday)grid.className+=' w3-dark-grey';
			if(2658456e4==dispDate.getTime()+(pdate-1)*864e5){
				grid.className+=' w3-black';
				grid.style.cursor='pointer';
				addEvt(grid,'click',onAbout);
			}if(i<=ppdr||ppdr+pcdr<i){
				grid.className+=' w3-disabled';
				grid.style.cursor='default';
			}else if(isToday){
				isDispToday=true;
				menuTodayElm.className+=' w3-disabled';
				menuTodayElm.style.cursor='default';
				if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null;}
			}
			pde.innerHTML=pdate;
			sde.innerHTML=sdate+'&nbsp;'+smsn;
			pdate++;
			if(pdate>pdim){
				pdate=1;
				dispDate.setMonth(dispDate.getMonth()+1);
				pdim=dispDate.getDaysInMonth();
			}
			sdate++;
			if(sdate>sdim){
				sdate=1;
				dispDate.getOppositeDate().setMonth(dispDate.getOppositeDate().getMonth()+1);
				sdim=dispDate.getOppositeDate().getDaysInMonth();
				smsn=dispDate.getOppositeDate().getMonthShortName();
			}
			gridCtr=(gridCtr+1)%7;
		}
		var spacer=createElm('div','w3-cell-row');
		spacer.style.cssText='height:8px;';
		gridsElm.appendChild(spacer);
		dispDate.setTime(dispTm);
	},
	recreateDates=function(){
		while(gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1]);
		createDates();
	},
	updCal=function(){
		updHeader();
		recreateDates();
	},
	onDecMonth=function(){
		dispDate.setMonth(dispDate.getMonth()-1);
		gridAni='right';
		updCal();
		applyTodayTmout();
	},
	onIncMonth=function(){
		dispDate.setMonth(dispDate.getMonth()+1);
		gridAni='left';
		updCal();
		applyTodayTmout();
	},
	onDecYear=function(){
		dispDate.setFullYear(dispDate.getFullYear()-1);
		gridAni='right';
		updCal();
		applyTodayTmout();
	},
	onIncYear=function(){
		dispDate.setFullYear(dispDate.getFullYear()+1);
		gridAni='left';
		updCal();
		applyTodayTmout();
	},
	onHoverMenu=function(evt){
		if(curThemIdx>=BLACK_TXT_THEME_COUNT){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeCol(target.children[0],'#000');
		}
	},
	onUnhoverMenu=function(evt){
		hideMenu();
		if(curThemIdx>=BLACK_TXT_THEME_COUNT){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeCol(target.children[0],'#fff');
		}
	},
	onHoverBtn=function(evt){
		if(curThemIdx>=BLACK_TXT_THEME_COUNT){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeCol(target,'#000');
		}
	},
	onUnhoverBtn=function(evt){
		if(curThemIdx>=BLACK_TXT_THEME_COUNT){
			evt=evt||window.event;
			var target=evt.target||evt.srcElement;
			setStrokeCol(target,'#fff');
		}
	},
	setStrokeCol=function(elm,color){elm.children[0].setAttribute('stroke',color);elm.children[0].setAttribute('fill',color);},
	hideMenu=function(){menuWrapElm.className=menuWrapElm.className.replace(' w3-show','');},
	onClickMenu=function(){
		if(menuWrapElm.className.indexOf('w3-show')==-1)menuWrapElm.className+=' w3-show';
		else hideMenu();
	},
	onChgCalMod=function(){hideMenu();self.setHijriMode(!isHijr);applyTodayTmout();},
	onChgFirstDay=function(){hideMenu();self.setFirstDayOfWeek(1-firstDay);applyTodayTmout();},
	onDispToday=function(){hideMenu();self.today();},
	onNewTheme=function(){hideMenu();newTheme();},
	onAbout=function(){
		hideMenu();
		aboutModalElm.style.display='block';
		if(actTmoId)window.clearTimeout(actTmoId);
		actTmoId=window.setTimeout(function(){
			aboutModalElm.style.display='none';
			if(!isDispToday){newTheme();self.today();}
		},actTmo*1000);
	},
	onCloseAbout=function(){aboutModalElm.style.display='none';applyTodayTmout();},
	onCancel=function(){hideMenu();},
	onRszWdw=function(){
		if(isSmallScreen&&calElm.clientWidth>=640||!isSmallScreen&&calElm.clientWidth<640){isSmallScreen=!isSmallScreen;updTodayLbl();recreateWdayTitle();}
	},
	getCurTime=function(){var now=Date.now()-tzOffset;return now-now%864e5+216e4+tzOffset;},
	beginNewDate=function(){
		var now=Date.now()-tzOffset*6e4;var to=864e5-now%864e5;window.setTimeout(beginNewDate,to);updTodayLbl();
		if(isDispToday){newTheme();self.today();}
	},
	applyTodayTmout=function(){
		if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null;}
		if(!isDispToday)actTmoId=window.setTimeout(self.today,actTmo*1000);
	},
	newTheme=function(theme){
		var themeIdx=-1;
		if(theme){
			for(var i=0;i<Calendar.themes.length;i++)if(theme==Calendar.themes[i]){themeIdx=i;break;}
			if(themeIdx==-1)return false;
		}else{
			do{themeIdx=Math.floor(Math.random()*Calendar.themes.length);}
			while(curThemIdx==themeIdx);
		}
		headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'));
		headerElm.className+='w3-'+Calendar.themes[themeIdx];
		var elms=calElm.querySelectorAll('div.w3-button'),color=themeIdx<BLACK_TXT_THEME_COUNT?'#000':'#fff';
		for(var i=0;i<elms.length;i++)setStrokeCol(elms[i],color);
		curThemIdx=themeIdx;
		return true;
	};
	this.attachTo=function(elm){if(elm.appendChild&&!isAttached){elm.appendChild(calElm);onRszWdw();isAttached=true;return true;}return false;};
	this.fireResize=function(){onRszWdw()};
	this.setDate=function(year,month){
		var oldTm=dispDate.getTime();
		year=parseInt(year);month=parseInt(month);
		if(!isNaN(year))dispDate.setFullYear(year);
		if(!isNaN(month))dispDate.setMonth(month);
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updCal();return true;}
		return false;
	};
	this.setFirstDayOfWeek=function(fdow){
		if((fdow==0||fdow==1)&&fdow!=firstDay){firstDay=fdow;recreateWdayTitle();gridAni='bottom';recreateDates();return true;}
		return false;
	};
	this.setFullYear=function(year){return this.setDate(year);};
	this.setHijriMode=function(hm){
		if((hm==true||hm==false)&&isHijr!=hm){
			isHijr=hm;dispDate.syncDates();dispDate=dispDate.getOppositeDate();updCalModMenuLbl();updTodayLbl();
			if(isDispToday){dispDate.setDate(1);this.today();}
			else{if(dispDate.getDate()>15)dispDate.setMonth(dispDate.getMonth()+1);dispDate.setDate(1);gridAni='bottom';updCal();}
			return true;
		}return false;
	};
	this.setLanguage=function(lang){
		lang=lang.toLowerCase();
		for(var li in Calendar.strData){
			if(li==lang){
				curLang=li;
				dispDate.language=li;
				dispDate.getOppositeDate().language=li;
				gridAni='zoom';
				updMenuLbl();
				updCalModMenuLbl();
				updTodayLbl();
				updHeader();
				recreateWdayTitle();
				recreateDates();
				return true;
			}
		}return false;
	};
	this.setMonth=function(month){return this.setDate(null,month);};
	this.setTheme=function(theme){return newTheme(theme);};
	this.setTodayTimeout=function(tmo){if(!isNaN(tmo)&&tmo>=10){actTmo=tmo;applyTodayTmout();return true;}return false;};
	this.today=function(){dispDate.setTime(getCurTime());dispDate.setDate(1);gridAni='bottom';updCal();};
	gDate.hijriDate=hDate;
	beginNewDate();
	year=parseInt(year);
	month=parseInt(month);
	dispDate.setTime(getCurTime());
	if(!isNaN(year))dispDate.setFullYear(year);
	if(!isNaN(month))dispDate.setMonth(month);
	dispDate.setDate(1);
	createCal();
}
HijriDate.prototype.language='en';
HijriDate.prototype.getMonthName=function(month){
	if(isNaN(month))month=this.getMonth();
	month%=12;
	if(this.language=='en')return HijriDate.monthNames[month].replace('-','&#8209;');
	return Calendar.strData[this.language]['hMonthNames'][month];
};
HijriDate.prototype.getMonthShortName=function(month){
	if(isNaN(month))month=this.getMonth();
	month%=12;
	if(this.language=='en')return HijriDate.monthShortNames[month];
	return Calendar.strData[this.language]['hMonthShortNames'][month];
};
HijriDate.prototype.getOppositeDate=function(){return this.getGregorianDate();};
HijriDate.prototype.todayString=function(){
	var tmp=this.getTime();
	this.setTime(Date.now());
	var tds=',&nbsp;'+this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp'+this.getFullYear()+'H';
	tds=this.language=='en'?HijriDate.weekdayNames[this.getDay()]+tds:Calendar.strData[this.language]['weekdayNames'][this.getDay()]+tds;
	this.setTime(tmp);
	return tds;
};
HijriDate.prototype.todayShortString=function(){
	var tmp=this.getTime();
	this.setTime(Date.now());
	var tds=',&nbsp;'+this.getDate()+'&nbsp;'+this.getMonthShortName()+'&nbsp'+this.getFullYear()+'H';
	tds=this.language=='en'?HijriDate.weekdayShortNames[this.getDay()]+tds:Calendar.strData[this.language]['weekdayShortNames'][this.getDay()]+tds;
	this.setTime(tmp);
	return tds;
};
Date.prototype.language='en';
Date.prototype.getMonthName=function(month){
	if(isNaN(month))month=this.getMonth();return Calendar.strData[this.language]['monthNames'][month%12];
};
Date.prototype.getMonthShortName=function(month){
	if(isNaN(month))month=this.getMonth();return Calendar.strData[this.language]['monthShortNames'][month%12];
};
Date.prototype.getOppositeDate=function(){return this.hijriDate;};
Date.prototype.todayString=function(){
	var tmp=this.getTime();
	this.setTime(Date.now());
	var tds=Calendar.strData[this.language]['weekdayNames'][this.getDay()]+',&nbsp;';
	tds+=this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp'+this.getFullYear();
	this.setTime(tmp);
	return tds;
};
Date.prototype.todayShortString=function(){
	var tmp=this.getTime();
	this.setTime(Date.now());
	var tds=Calendar.strData[this.language]['weekdayShortNames'][this.getDay()]+',&nbsp;';
	tds+=this.getDate()+'&nbsp;'+this.getMonthShortName()+'&nbsp'+this.getFullYear();
	this.setTime(tmp);
	return tds;
};
Calendar.themes=['amber','aqua','cyan','grey','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','sand','yellow','black','blue','blue-grey','brown','dark-grey','deep-orange','deep-purple','green','indigo','pink','purple','red','teal'];
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
		"monthShortNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		"weekdayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		"weekdayShortNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
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
		"monthShortNames":["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
		"weekdayNames":["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
		"weekdayShortNames":["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
		"hMonthNames":["Muharam","Safar","Rabi'ul&#8209;Awal","Rabi'ul&#8209;Akhir","Jumadil&#8209;Awal","Jumadil&#8209;Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
		"hMonthShortNames":["Muh","Saf","Raw","Rak","Jaw","Jak","Raj","Sya","Ram","Syw","Zuq","Zuh"]
	}
};
