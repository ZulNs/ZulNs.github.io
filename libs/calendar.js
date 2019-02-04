/*
 * Hijri/Gregorian Calendar using W3CSS
 * 
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 * Revised to using W3CSS, @Gorontalo, Indonesia, 14 January 2019
 */
function Calendar(isHijr,year,month,firstDay,lang,theme,tmout){
	if(typeof HijriDate=='undefined')throw new Error('HijriDate() class required!');
	var self=this,gdate=new Date(),hdate=new HijriDate(),dispDate,tzOffset=Date.parse('01 Jan 1970'),
	gridAni='zoom',actTmoId,isDispToday=false,isAttached=false,isAccOpened=false,isAutoNewTheme,
	aboutElm,aboutTitleElm,aboutDateElm,aboutCloseBtnElm,
	isSmallScreen=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<640,
	createElm=function(tagName,className,innerHTML){
		var el=document.createElement(tagName);if(className)el.className=className;if(innerHTML)el.innerHTML=innerHTML;return el
	},
	addEvt=function(el,ev,cb){
		if(window.addEventListener)el.addEventListener(ev,cb);else if(el.attachEvent)el.attachEvent('on'+ev,cb);else el['on'+ev]=cb
	},
	calElm=createElm('div','zulns-calendar w3-card-4'),
	headerElm=createElm('div','w3-display-container w3-theme'),
	todayElm=createElm('div','w3-display-topright w3-xlarge'),
	yearValElm=createElm('div','w3-display-middle w3-xxxlarge'),
	monthValElm=createElm('div','w3-display-bottommiddle w3-xxlarge'),
	menuBtnElm=createElm('button','w3-button w3-ripple','<svg width="18" height="23"><path d="M0 6L18 6L18 8L0 8Z M0 13L18 13L18 15L0 15Z M0 20L18 20L18 22L0 22Z"/></svg>'),
	menuWrapElm=createElm('div','w3-dropdown-content w3-bar-block w3-border w3-light-grey'),
	accFirstDayElm=createElm('div','w3-white w3-border-bottom'),
	menuCalModElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuFirstDayElm=createElm('button','w3-bar-item w3-button w3-ripple collapsed','<span></span><span class="w3-right"><svg width="10" height="10"><path d="M1 3L5 7L9 3Z"/></svg></span><span class="w3-right"><svg width="10" height="10"><path d="M1 7L5 3L9 7Z"/></svg></span>'),
	menuTodayElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuNewThemeElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuAboutElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuCloseElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	wdayTitleElm=createElm('div','w3-cell-row w3-center w3-large w3-light-grey'),
	gridsElm=createElm('div','w3-white'),
	createStyle=function(){
		var stl=document.getElementById('ZulNsCalendarStyle'),ct=Calendar.themes,ctl=ct.length;
		if(stl)return false;
		var str='svg{stroke:currentColor;fill:currentColor;stroke-width:1}'+
			'.w3-button{background-color:transparent}'+
			'.w3-bar-item{border-left:6px solid transparent!important}'+
			'.w3-bar-item:not(:disabled):hover{border-color:#f44336!important}'+
			'.w3-bar-item:focus{border-color:#2196F3!important}'+
			'.w3-bar-item.expanded{color:#fff;background-color:#616161}'+
			'button.collapsed + div,button.collapsed>:nth-child(3),button.expanded>:nth-child(2){display:none!important}';
		stl=createElm('style',null,str);stl.id='ZulNsCalendarStyle';stl.type='text/css';document.body.appendChild(stl);return true
	},
	createAboutModal=function(){
		aboutElm=document.getElementById('ZulNsAbout');
		if(aboutElm){
			aboutTitleElm=document.getElementById('ZulNsAboutTitle');
			aboutDateElm=document.getElementById('ZulNsAboutDate');
			aboutCloseBtnElm=document.getElementById('ZulNsAboutCloseButton');
			return false
		}
		aboutElm=createElm('div','w3-modal');
		var cont=createElm('div','w3-modal-content w3-card-4 w3-border w3-display w3-black w3-animate-zoom'),
			info=createElm('div','w3-display-middle w3-bar w3-center'),
			zulns=createElm('p',null,'<span class="w3-tag w3-jumbo w3-red">Z</span>&nbsp;<span class="w3-tag w3-jumbo w3-yellow">u</span>&nbsp;<span class="w3-tag w3-jumbo w3-blue">l</span>&nbsp;<span class="w3-tag w3-jumbo w3-green">N</span>&nbsp;<span class="w3-tag w3-jumbo w3-purple">s</span>');
		aboutCloseBtnElm=createElm('button','w3-button w3-ripple w3-display-topright','<svg width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z"/></svg>');
		aboutTitleElm=createElm('p','w3-xlarge');aboutDateElm=createElm('p','w3-large');aboutElm.id='ZulNsAbout';
		aboutElm.style.display='none';aboutElm.setAttribute('callback',null);
		cont.style.cssText='width:440px;height:300px;cursor:default';
		aboutCloseBtnElm.id='ZulNsAboutCloseButton';aboutTitleElm.id='ZulNsAboutTitle';aboutDateElm.id='ZulNsAboutDate';
		info.appendChild(aboutTitleElm);info.appendChild(zulns);info.appendChild(aboutDateElm);cont.appendChild(info);
		cont.appendChild(aboutCloseBtnElm);aboutElm.appendChild(cont);document.body.appendChild(aboutElm);
		addEvt(aboutCloseBtnElm,'click',function(){
			aboutElm.style.display='none';aboutTitleElm.innerHTML='';aboutDateElm.innerHTML='';
			if(typeof aboutElm.callback=='function')aboutElm.callback();aboutElm.callback=null
		});return true
	},
	createCal=function(){
		var rootMenuElm=createElm('div','w3-dropdown-click w3-display-topleft'),
			prevYearBtnElm=createElm('button','w3-button w3-ripple w3-display-left','<svg width="18" height="23"><path d="M7 7L2 15L7 23L9 23L4 15L9 7Z M14 7L9 15L14 23L16 23L11 15L16 7Z"/></svg>'),
			nextYearBtnElm=createElm('button','w3-button w3-ripple w3-display-right','<svg width="18" height="23"><path d="M11 7L16 15L11 23L9 23L14 15L9 7Z M4 7L9 15L4 23L2 23L7 15L2 7Z"/></svg>'),
			prevMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomleft','<svg width="18" height="23"><path d="M10 7L5 15L10 23L12 23L7 15L12 7Z"/></svg>'),
			nextMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomright','<svg width="18" height="23"><path d="M8 7L13 15L8 23L6 23L11 15L6 7Z"/></svg>');
		headerElm.style.height='180px';
		todayElm.style.cssText='margin:16px 28px 0px 0px;cursor:default';
		yearValElm.style.cursor=gridsElm.style.cursor='default';
		monthValElm.style.cssText='margin-bottom:8px;cursor:default';
		rootMenuElm.style.cssText='margin:12px 0px 0px 12px';
		prevYearBtnElm.style.cssText='margin-left:12px';
		nextYearBtnElm.style.cssText='margin-right:12px';
		prevMonthBtnElm.style.cssText='margin:0px 0px 12px 12px';
		nextMonthBtnElm.style.cssText='margin:0px 12px 12px 0px';
		wdayTitleElm.style.cssText='padding:8px 0px;margin-bottom:8px';
		menuWrapElm.style.width='200px';
		menuWrapElm.appendChild(menuCalModElm);menuWrapElm.appendChild(menuFirstDayElm);menuWrapElm.appendChild(accFirstDayElm);
		menuWrapElm.appendChild(menuTodayElm);menuWrapElm.appendChild(menuNewThemeElm);menuWrapElm.appendChild(menuAboutElm);
		menuWrapElm.appendChild(menuCloseElm);rootMenuElm.appendChild(menuBtnElm);rootMenuElm.appendChild(menuWrapElm);
		headerElm.appendChild(todayElm);headerElm.appendChild(yearValElm);headerElm.appendChild(monthValElm);
		headerElm.appendChild(rootMenuElm);headerElm.appendChild(prevYearBtnElm);headerElm.appendChild(nextYearBtnElm);
		headerElm.appendChild(prevMonthBtnElm);headerElm.appendChild(nextMonthBtnElm);gridsElm.appendChild(wdayTitleElm);
		calElm.appendChild(headerElm);calElm.appendChild(gridsElm);
		addEvt(menuBtnElm,'click',onClickMenu);addEvt(menuCalModElm,'click',onChgCalMod);addEvt(menuFirstDayElm,'click',onFirstDay);
		addEvt(menuTodayElm,'click',onDispToday);addEvt(menuNewThemeElm,'click',onNewTheme);addEvt(menuAboutElm,'click',onAbout);
		addEvt(menuCloseElm,'click',onClose);addEvt(prevYearBtnElm,'click',onDecYear);addEvt(nextYearBtnElm,'click',onIncYear);
		addEvt(prevMonthBtnElm,'click',onDecMonth);addEvt(nextMonthBtnElm,'click',onIncMonth);addEvt(window,'resize',onRszWdw);
		for(var i=0;i<7;i++){
			var el=createElm('button','w3-bar-item w3-button w3-ripple');
			el.setAttribute('firstday',i);
			addEvt(el,'click',onSelFirstDay);
			accFirstDayElm.appendChild(el)
		}updMenuLbl();updCalModMenuLbl();updHeader();createWdayTitle();createDates()
	},
	updMenuLbl=function(){
		var cs=Calendar.strData[lang],wd=accFirstDayElm.children;
		menuFirstDayElm.children[0].innerHTML=cs.menuItem1;
		menuTodayElm.innerHTML=cs.menuItem2;
		menuNewThemeElm.innerHTML=cs.menuItem3;
		menuAboutElm.innerHTML=cs.menuItem4;
		menuCloseElm.innerHTML=cs.menuItem5+'<span class="w3-right">&times;</span>';
		for(var i=0;i<7;i++)wd[i].innerHTML='&#9679;&nbsp;'+cs.weekdayNames[i]
	},
	updCalModMenuLbl=function(){
		menuCalModElm.innerHTML=Calendar.strData[lang].menuItem0[isHijr?1:0];
	},
	updTodayLbl=function(){todayElm.innerHTML=isSmallScreen?dispDate.todayShortString():dispDate.todayString()},
	updHeader=function(){
		var year=dispDate.getFullYear(),idx=isHijr?0:2;
		if(year<1){idx++;year=-year+1}
		yearValElm.innerHTML=year+'&nbsp;'+Calendar.strData[lang].eraSuffix[idx];
		monthValElm.innerHTML=dispDate.getMonthName()
	},
	createWdayTitle=function(){
		var lt=isSmallScreen?'weekdayShortNames':'weekdayNames',el=accFirstDayElm.children[firstDay];
		replaceClass(el,'w3-button w3-ripple','w3-transparent');el.disabled=true;
		for(var i=firstDay;i<7+firstDay;i++){
			var day=createElm('div','w3-cell',Calendar.strData[lang][lt][i%7]);
			if(i%7==5)day.className+=' w3-text-teal';
			if(i%7==0)day.className+=' w3-text-red';
			day.style.width='14.2857%';wdayTitleElm.appendChild(day)
		}
	},
	recreateWdayTitle=function(){
		while(wdayTitleElm.firstChild)wdayTitleElm.removeChild(wdayTitleElm.firstChild);createWdayTitle()
	},
	createDates=function(){
		var dispTm=dispDate.getTime(),ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		var pcdr=dispDate.getDaysInMonth(),pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);syncDates();
		var pdate=dispDate.getDate(),sdate=getOppsDate().getDate(),pdim=dispDate.getDaysInMonth(),sdim=getOppsDate().getDaysInMonth(),
			smsn=getOppsDate().getMonthShortName(),isFri=(13-firstDay)%7,isSun=(8-firstDay)%7,gridCtr=0,ttc,isToday;
		dispDate.setDate(1);getOppsDate().setDate(1);
		if(isDispToday){
			isDispToday=false;replaceClass(menuTodayElm,'w3-transparent','w3-button w3-ripple');menuTodayElm.disabled=false
		}
		for(var i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){var row=createElm('div','w3-cell-row w3-center');gridsElm.appendChild(row)}
			var grid=createElm('div','w3-cell w3-animate-'+gridAni),pde=createElm('div','w3-xlarge'),sde=createElm('div','w3-small');
			ttc=dispDate.getTime()+(pdate-1)*864e5;
			grid.style.cssText='width:14.2857%;padding:6px 0px';
			grid.appendChild(pde);grid.appendChild(sde);row.appendChild(grid);
			isToday=getCurTime()==ttc;
			if(isToday)grid.className+=' w3-round-large';
			if(i%7==isFri)grid.className+=isToday?' w3-teal':' w3-text-teal';
			else if(i%7==isSun)grid.className+=isToday?' w3-red':' w3-text-red';
			else if(isToday)grid.className+=' w3-dark-grey';
			if(i<=ppdr||ppdr+pcdr<i){grid.className+=' w3-disabled';grid.style.cursor='default'}
			else if(isToday){
				isDispToday=true;
				grid.className+=' w3-round-large';
				replaceClass(menuTodayElm,'w3-button w3-ripple','w3-transparent');
				menuTodayElm.disabled=true;
				if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null}
			}
			if(26586e6==ttc){
				grid.className+=' w3-btn w3-ripple w3-round-large w3-black';grid.style.cursor='pointer';addEvt(grid,'click',onAbout)
			}
			pde.innerHTML=pdate;sde.innerHTML=sdate+'&nbsp;'+smsn;pdate++;
			if(pdate>pdim){pdate=1;dispDate.setMonth(dispDate.getMonth()+1);pdim=dispDate.getDaysInMonth()}
			sdate++;
			if(sdate>sdim){
				sdate=1;getOppsDate().setMonth(getOppsDate().getMonth()+1);
				sdim=getOppsDate().getDaysInMonth();smsn=getOppsDate().getMonthShortName()
			}gridCtr=++gridCtr%7
		}
		var spacer=createElm('div','w3-cell-row');spacer.style.height='8px';gridsElm.appendChild(spacer);dispDate.setTime(dispTm)
	},
	recreateDates=function(){
		while(gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1]);createDates()
	},
	updCal=function(){updHeader();recreateDates()},
	onDecMonth=function(){dispDate.setMonth(dispDate.getMonth()-1);gridAni='right';updCal();applyTodayTmout()},
	onIncMonth=function(){dispDate.setMonth(dispDate.getMonth()+1);gridAni='left';updCal();applyTodayTmout()},
	onDecYear=function(){dispDate.setFullYear(dispDate.getFullYear()-1);gridAni='right';updCal();applyTodayTmout()},
	onIncYear=function(){dispDate.setFullYear(dispDate.getFullYear()+1);gridAni='left';updCal();applyTodayTmout()},
	hideMenu=function(){if(isAccOpened)onFirstDay();replaceClass(menuWrapElm,' w3-show','');replaceClass(menuBtnElm,' w3-light-grey','')},
	onClickMenu=function(){
		if(menuWrapElm.className.indexOf('w3-show')==-1){
			menuBtnElm.className+=' w3-light-grey';menuWrapElm.className+=' w3-show'
		}else hideMenu()
	},
	onChgCalMod=function(){self.setHijriMode(!isHijr);applyTodayTmout()},
	onFirstDay=function(){
		if (menuFirstDayElm.className.indexOf('expanded')==-1){replaceClass(menuFirstDayElm,'collapsed','expanded');isAccOpened=true}
		else{replaceClass(menuFirstDayElm,'expanded','collapsed');isAccOpened=false}
	},
	onSelFirstDay=function(ev){
		ev=ev||window.event;var el=ev.target||ev.srcElement;self.setFirstDayOfWeek(el.getAttribute('firstday'));applyTodayTmout();
	},
	onDispToday=function(){self.today()},
	onNewTheme=function(){newTheme();applyTheme()},
	onAbout=function(){
		hideMenu();
		aboutTitleElm.innerHTML='Hijri/Gregorian&nbsp;Dual&nbsp;Calendar';
		aboutDateElm.innerHTML='Gorontalo,&nbsp;14&nbsp;January&nbsp;2019';
		aboutElm.style.display='block';
		aboutElm.callback=applyTodayTmout;
		if(actTmoId)window.clearTimeout(actTmoId);
		actTmoId=window.setTimeout(function(){
			aboutElm.style.display='none';aboutElm.callback=null;aboutTitleElm.innerHTML=aboutDateElm.innerHTML='';self.today()
		},tmout*1000)
	},
	onClose=function(){hideMenu()},
	onRszWdw=function(){
		if(isSmallScreen&&calElm.clientWidth>=640||!isSmallScreen&&calElm.clientWidth<640){
			isSmallScreen=!isSmallScreen;updTodayLbl();recreateWdayTitle()
		}
	},
	syncDates=function(){getOppsDate().setTime(dispDate.getTime())},
	getOppsDate=function(){return isHijr?gdate:hdate},
	getFixTime=function(time){time-=tzOffset;return time-time%864e5+36e5+tzOffset},
	getCurTime=function(){return getFixTime(Date.now())},
	beginNewDate=function(){
		var now=Date.now()-tzOffset,to=864e5-now%864e5;
		window.setTimeout(beginNewDate,to);updTodayLbl();
		if(isAutoNewTheme){newTheme();applyTheme()}
		if(isDispToday){isDispToday=false;self.today()}
	},
	applyTodayTmout=function(){
		if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null}
		if(!isDispToday)actTmoId=window.setTimeout(self.today,tmout*1000)
	},
	newTheme=function(){var ct=Calendar.themes,i;do i=Math.floor(Math.random()*ct.length);while(ct[i]==theme);theme=ct[i]},
	applyTheme=function(){
		headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'))+'w3-'+theme
	},
	replaceClass=function(el,dt,sr){el.className=el.className.replace(dt,sr)};
	this.attachTo=function(el){if(el.appendChild&&!isAttached){el.appendChild(calElm);onRszWdw();isAttached=true;return true}return false};
	this.fireResize=function(){onRszWdw()};
	this.getElement=function(){return calElm};
	this.resetDate=function(year,month){
		var oldTm=dispDate.getTime();
		dispDate.setFullYear(HijriDate.parseInt(year,dispDate.getFullYear()));
		dispDate.setMonth(HijriDate.parseInt(month,dispDate.getMonth()));
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updCal();return true}
		return false
	};
	this.setFirstDayOfWeek=function(fdow){
		fdow=HijriDate.parseInt(fdow,firstDay)%7;
		if(fdow!=firstDay){
			var el=accFirstDayElm.children[firstDay];
			replaceClass(el,'w3-transparent','w3-button w3-ripple');
			el.disabled=false;firstDay=fdow;recreateWdayTitle();gridAni='bottom';recreateDates();return true
		}return false
	};
	this.setFullYear=function(year){return this.resetDate(year)};
	this.setHijriMode=function(hm){
		if(typeof hm=='boolean'&&hm!=isHijr){
			syncDates();dispDate=getOppsDate();isHijr=hm;updCalModMenuLbl();updTodayLbl();
			if(isDispToday){isDispToday=false;dispDate.setDate(1);this.today()}
			else{
				var d=dispDate.getDate();dispDate.setDate(1);
				if(d>15)dispDate.setMonth(dispDate.getMonth()+1);
				gridAni='bottom';updCal()
			}return true
		}return false
	};
	this.setLanguage=function(lng){
		if(typeof lng=='string'){
			lng=lng.toLowerCase();
			if(typeof Calendar.strData[lng]=='object'&&lng!=lang){
				lang=gdate.language=hdate.language=lng;
				gridAni='zoom';updMenuLbl();updCalModMenuLbl();updTodayLbl();updHeader();recreateWdayTitle();recreateDates();return true
			}
		}return false
	};
	this.setMonth=function(month){return this.resetDate(null,month)};
	this.setTheme=function(thm){
		var ct=Calendar.themes,ctl=ct.length,i=0;console.log(thm);
		if(typeof thm=='number'){
			if(0<=thm&&thm<ctl){isAutoNewTheme=false;theme=ct[thm]}
			else{isAutoNewTheme=true;newTheme()}
		}else if(typeof thm=='string'){
			thm=thm.toLowerCase();
			for(;i<ctl;i++)if(ct[i]==thm)break;
			if(i<ctl){isAutoNewTheme=false;theme=ct[i]}
			else{isAutoNewTheme=true;newTheme()}
		}else{isAutoNewTheme=true;newTheme()}
		applyTheme();return isAutoNewTheme
	};
	this.setTime=function(tm){
		var oldTm=dispDate.getTime();
		dispDate.setTime(getFixTime(HijriDate.parseInt(time,getCurTime())));dispDate.setDate(1);
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updCal();return true}
		return false
	};
	this.setTodayTimeout=function(tmo){tmo=HijriDate.parseInt(tmo,tmout);if(!isNaN(tmo)&&tmo>=10){tmout=tmo;applyTodayTmout();return true}return false};
	this.today=function(){if(!isDispToday){dispDate.setTime(getCurTime());dispDate.setDate(1);gridAni='bottom';updCal();return true}return false};
	if(typeof isHijr!='boolean')isHijr=false;
	dispDate=isHijr?hdate:gdate;
	firstDay=HijriDate.parseInt(firstDay,1)%7;
	if(typeof lang=='string'){lang=lang.toLowerCase();if(typeof Calendar.strData[lang]!='object')lang='en'}
	else lang='en';
	gdate.language=hdate.language=lang;
	this.setTheme(theme);
	tmout=HijriDate.parseInt(tmout,120);
	beginNewDate();
	year=HijriDate.parseInt(year,NaN);month=HijriDate.parseInt(month,NaN);
	if(!isNaN(year)&&isNaN(month)){dispDate.setTime(getFixTime(year));dispDate.setDate(1)}
	else{
		dispDate.setTime(getCurTime());dispDate.setDate(1);
		if(!isNaN(year))dispDate.setFullYear(year);
		if(!isNaN(month))dispDate.setMonth(month)
	}
	createStyle();createAboutModal();createCal();applyTodayTmout()
}
Date.prototype.language='en';
Date.prototype.getMonthName=function(month){
	month=(HijriDate.parseInt(month,this.getMonth())%12+12)%12;
	return Calendar.strData[this.language].monthNames[month]
};
Date.prototype.getMonthShortName=function(month){
	month=(HijriDate.parseInt(month,this.getMonth())%12+12)%12;
	return Calendar.strData[this.language].monthShortNames[month]
};
Date.prototype.todayShortString=function(){
	var tmp=this.getTime();this.setTime(Date.now());
	var tds=Calendar.strData[this.language].weekdayShortNames[this.getDay()]+',&nbsp;';
	tds+=this.getDate()+'&nbsp;'+this.getMonthShortName()+'&nbsp;'+this.getFullYear();
	this.setTime(tmp);return tds
};
Date.prototype.todayString=function(){
	var tmp=this.getTime();this.setTime(Date.now());
	var tds=Calendar.strData[this.language].weekdayNames[this.getDay()]+',&nbsp;';
	tds+=this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp;'+this.getFullYear();
	this.setTime(tmp);return tds
};
HijriDate.prototype.language='en';
HijriDate.prototype.getMonthName=function(month){
	month=(HijriDate.parseInt(month,this.getMonth())%12+12)%12;
	month=this.language=='en'?HijriDate.monthNames[month]:Calendar.strData[this.language].hMonthNames[month];
	return month.replace('-','&#8209;')
};
HijriDate.prototype.getMonthShortName=function(month){
	if(isNaN(month))month=this.getMonth();month%=12;
	if(this.language=='en')return HijriDate.monthShortNames[month];
	return Calendar.strData[this.language].hMonthShortNames[month]
};
HijriDate.prototype.todayShortString=function(){
	var tmp=this.getTime();this.setTime(Date.now());
	var tds=',&nbsp;'+this.getDate()+'&nbsp;'+this.getMonthShortName()+'&nbsp;'+this.getFullYear()+'H';
	tds=this.language=='en'?HijriDate.weekdayShortNames[this.getDay()]+tds:Calendar.strData[this.language].weekdayShortNames[this.getDay()]+tds;
	this.setTime(tmp);return tds
};
HijriDate.prototype.todayString=function(){
	var tmp=this.getTime();this.setTime(Date.now());
	var tds=',&nbsp;'+this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp;'+this.getFullYear()+'H';
	tds=this.language=='en'?HijriDate.weekdayNames[this.getDay()]+tds:Calendar.strData[this.language].weekdayNames[this.getDay()]+tds;
	this.setTime(tmp);return tds
};
Calendar.themes=['amber','aqua','black','blue','blue-grey','brown','cyan','dark-grey','deep-orange','deep-purple','green','grey','indigo','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','pink','purple','red','sand','teal','yellow'];
Calendar.strData={
	en:{
		menuItem0:["Hijri&nbsp;calendar","Gregorian&nbsp;calendar"],
		menuItem1:"Firstday",
		menuItem2:"Today",
		menuItem3:"New&nbsp;theme",
		menuItem4:"About",
		menuItem5:"Close",
		eraSuffix:["H","BH","AD","BC"],
		monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
		monthShortNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		weekdayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		weekdayShortNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
	},
	id:{
		menuItem0:["Kalender&nbspHijriyah","Kalender&nbsp;Masehi"],
		menuItem1:"Mulai&nbsp;hari",
		menuItem2:"Hari&nbsp;ini",
		menuItem3:"Tema&nbsp;baru",
		menuItem4:"Tentang",
		menuItem5:"Tutup",
		eraSuffix:["H","SH","M","SM"],
		monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
		monthShortNames:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
		weekdayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
		weekdayShortNames:["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
		hMonthNames:["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
		hMonthShortNames:["Muh","Saf","Raw","Rak","Jaw","Jak","Raj","Sya","Ram","Syw","Zuq","Zuh"]
	}
};
