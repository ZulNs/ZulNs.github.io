/*********************************************
 * Hijri/Gregorian Date Picker
 *
 * Design by ZulNs @Yogyakarta, January 2016
 *********************************************
 *
 * Revised on 30 December 2018:
 *   Calendar class name was changed to Datepicker
 *
 * Revised on 8 January 2018:
 *   UI has been changed to adapt with W3CSS
 */
function Datepicker(isHijr,year,month,firstDay,lang,theme,width){
	if(typeof HijriDate=='undefined')throw new Error('HijriDate() class required!');
	const MIN_WIDTH=280,MAX_WIDTH=600;
	var	self=this,
	dispDate=new HijriDate(),
	pickDate=new HijriDate(),
	tzOffset=dispDate.getTimezoneOffset()*6e4,
	isAttached=false,
	isAutoNewTheme,
	gridAni='zoom',
	aboutElm,
	aboutTitleElm,
	aboutDateElm,
	aboutCloseBtnElm,
	createElm=function(tagName,className,innerHTML){
		var el=document.createElement(tagName);
		if(className)el.className=className;
		if(innerHTML)el.innerHTML=innerHTML;
		return el
	},
	addEvt=function(el,ev,cb){
		if(window.addEventListener)el.addEventListener(ev,cb);
		else if(el.attachEvent)el.attachEvent('on'+ev,cb);
		else el['on'+ev]=cb
	},
	dpickElm=createElm('div','zulns-datepicker w3-card-4 w3-hide'),
	headerElm=createElm('div','w3-display-container w3-theme'),
	yearValElm=createElm('div','w3-display-middle w3-xlarge'),
	monthValElm=createElm('div','w3-display-bottommiddle w3-large'),
	gridsElm=createElm('div','w3-white'),
	wdayTitleElm=createElm('div','w3-cell-row w3-center w3-small w3-light-grey'),
	createStyle=function(){
		var stl=document.getElementById('ZulNsDatepickerStyle'),dt=Datepicker.themes,dtl=dt.length;
		if(stl)return false;
		var str='.svg{stroke:#000;fill:#000;background-color:transparent!important}';
		for(var i=15;i<dtl;i++){str+='.w3-'+dt[i]+' .svg';if(i<dtl-1)str+=','}str+='{stroke:#fff;fill:#fff}';
		str+='.svg:hover,.svg:focus{stroke:#000;fill:#000;background-color:#ccc!important}';
		str+='.date:focus{color:#fff!important}';
		str+='.date.w3-hover-dark-grey:focus{background-color:#616161!important}';
		str+='.date.w3-hover-teal:focus{background-color:#009688!important}';
		str+='.date.w3-hover-red:focus{background-color:#f44336!important}';
		stl=createElm('style',null,str);
		stl.id='ZulNsDatepickerStyle';
		stl.type='text/css';
		document.body.appendChild(stl);
		return true
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
		aboutCloseBtnElm=createElm('button','svg w3-button w3-ripple w3-display-topright','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z" stroke-width="1"/></svg>');
		aboutTitleElm=createElm('p','w3-xlarge');
		aboutDateElm=createElm('p','w3-large');
		aboutElm.id='ZulNsAbout';
		aboutElm.style.display='none';
		aboutElm.setAttribute('callback',null);
		cont.style.cssText='width:440px;height:300px;cursor:default;';
		aboutCloseBtnElm.id='ZulNsAboutCloseButton';
		aboutTitleElm.id='ZulNsAboutTitle';
		aboutDateElm.id='ZulNsAboutDate';
		info.appendChild(aboutTitleElm);
		info.appendChild(zulns);
		info.appendChild(aboutDateElm);
		cont.appendChild(info);
		cont.appendChild(aboutCloseBtnElm);
		aboutElm.appendChild(cont);
		document.body.appendChild(aboutElm);
		addEvt(aboutCloseBtnElm,'click',function(){
			aboutElm.style.display='none';
			aboutTitleElm.innerHTML='';
			aboutDateElm.innerHTML='';
			if(typeof aboutElm.callback=='function')aboutElm.callback();
			aboutElm.callback=null
		});
		return true
	},
	createPicker=function(){
		var closeBtnElm=createElm('button','svg w3-btn w3-ripple w3-display-topright','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z" stroke-width="1" /></svg>'),
			prevYearBtnElm=createElm('button','svg w3-btn w3-ripple w3-display-left','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M6 7L3 13L6 19L8 19L5 13L8 7Z M13 7L10 13L13 19L15 19L12 13L15 7Z" stroke-width="1"/></svg>'),
			nextYearBtnElm=createElm('button','svg w3-btn w3-ripple w3-display-right','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M4 7L7 13L4 19L6 19L9 13L6 7Z M11 7L14 13L11 19L13 19L16 13L13 7Z" stroke-width="1"/></svg>'),
			prevMonthBtnElm=createElm('button','svg w3-btn w3-ripple w3-display-bottomleft','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M10 7L7 13L10 19L12 19L9 13L12 7Z" stroke-width="1"/></svg>'),
			nextMonthBtnElm=createElm('button','svg w3-btn w3-ripple w3-display-bottomright','<svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"><path d="M7 7L10 13L7 19L9 19L12 13L9 7Z" stroke-width="1"/></svg>');
		dpickElm.style.minWidth=MIN_WIDTH+'px';
		dpickElm.style.maxWidth=MAX_WIDTH+'px';
		dpickElm.style.width=width+'px';
		headerElm.style.cssText='height:132px;';
		yearValElm.style.cssText='cursor:default;';
		monthValElm.style.cssText='margin-bottom:5px;cursor:default;';
		wdayTitleElm.style.cssText='padding:0px 8px;margin-bottom:8px;cursor:default;';
		headerElm.appendChild(yearValElm);
		headerElm.appendChild(monthValElm);
		headerElm.appendChild(closeBtnElm);
		headerElm.appendChild(prevYearBtnElm);
		headerElm.appendChild(nextYearBtnElm);
		headerElm.appendChild(prevMonthBtnElm);
		headerElm.appendChild(nextMonthBtnElm);
		gridsElm.appendChild(wdayTitleElm);
		dpickElm.appendChild(headerElm);
		dpickElm.appendChild(gridsElm);
		addEvt(closeBtnElm,'click',onHideMe);
		addEvt(prevYearBtnElm,'click',onDecYear);
		addEvt(nextYearBtnElm,'click',onIncYear);
		addEvt(prevMonthBtnElm,'click',onDecMonth);
		addEvt(nextMonthBtnElm,'click',onIncMonth);
		updHeader();createWdayTitle()
	},
	updHeader=function(){
		var year=dispDate.getFullYear(),idx=isHijr?0:2;
		if(year<1){idx++;year=-year+1}
		yearValElm.innerHTML=year+'&nbsp;'+Datepicker.strData[lang].eraSuffix[idx];
		monthValElm.innerHTML=dispDate.getMonthName()
	},
	createWdayTitle=function(){
		for(var i=firstDay;i<7+firstDay;i++){
			var day=createElm('div','w3-cell',Datepicker.strData[lang].weekdayShortNames[i%7]);
			if(i%7==5)day.className+=' w3-text-teal';
			if(i%7==0)day.className+=' w3-text-red';
			day.style.cssText='width:14.2857%;padding:8px 0px;';
			wdayTitleElm.appendChild(day)
		}
	},
	recreateWdayTitle=function(){while(wdayTitleElm.firstChild)wdayTitleElm.removeChild(wdayTitleElm.firstChild);createWdayTitle()},
	createDates=function(){
		var dispTm=dispDate.getTime(),ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		var pcdr=dispDate.getDaysInMonth(),pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);
		var pdate=dispDate.getDate(),pdim=dispDate.getDaysInMonth(),isFri=(13-firstDay)%7,isSun=(8-firstDay)%7,gridCtr=0,ttc;
		dispDate.setDate(1);
		for(var i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){var row=createElm('div','w3-cell-row w3-center');row.style.cssText='padding:0px 8px;margin-bottom:8px;';gridsElm.appendChild(row)}
			var grid=createElm('button','w3-cell w3-transparent w3-animate-'+gridAni,pdate),ttc=dispDate.getTime()+(pdate-1)*864e5;
			grid.style.cssText='width:14.2857%;padding:4px 0px;background-color:#fff;';
			row.appendChild(grid);
			ttc=dispDate.getTime()+(pdate-1)*864e5;
			if(getCurTime()==ttc||ttc==26586e6)grid.className+=' w3-'+theme;
			else{
				if(i%7==isFri)grid.className+=' w3-text-teal';
				else if(i%7==isSun)grid.className+=' w3-text-red'
			}
			if(i<=ppdr||ppdr+pcdr<i){
				grid.className+=' w3-disabled';
				grid.style.cssText+='border:none;';
				grid.style.cursor='default';
				grid.tabIndex=-1;
				addEvt(grid,'focus',onFocus)
			}else{
				grid.className+=' w3-btn w3-ripple date';
				if(i%7==isFri)grid.className+=' w3-hover-teal';
				else if(i%7==isSun)grid.className+=' w3-hover-red';
				else grid.className+=' w3-hover-dark-grey';
				addEvt(grid,'click',onPick)
			}
			pdate++;
			if(pdate>pdim){
				pdate=1;
				dispDate.setMonth(dispDate.getMonth()+1);
				pdim=dispDate.getDaysInMonth()
			}
			gridCtr=++gridCtr%7
		}
		var row=createElm('div','w3-container');gridsElm.appendChild(row);dispDate.setTime(dispTm)
	},
	deleteDates=function(){while (gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1])},
	scrollToFix=function(){
		var dw=document.body.offsetWidth,
			vw=window.innerWidth,
			vh=window.innerHeight,
			rect=dpickElm.getBoundingClientRect(),
			hsSpc=dw>vw?20:0,
			scrollX=rect.left<0?rect.left:0,
			scrollY=rect.bottom-rect.top>vh?rect.top:rect.bottom>vh-hsSpc?rect.bottom-vh+hsSpc:0;
		window.scrollBy(scrollX,scrollY)
	},
	updPicker=function(){updHeader();if(getShowing){deleteDates();createDates()}},
	onHideMe=function(){hideMe()},
	onDecYear=function(){dispDate.setFullYear(dispDate.getFullYear()-1);gridAni='right';updPicker()},
	onIncYear=function(){dispDate.setFullYear(dispDate.getFullYear()+1);gridAni='left';updPicker()},
	onDecMonth=function(){dispDate.setMonth(dispDate.getMonth()-1);gridAni='right';updPicker()},
	onIncMonth=function(){dispDate.setMonth(dispDate.getMonth()+1);gridAni='left';updPicker()},
	onPick=function(ev){
		ev=ev||window.event;
		var el=ev.target||ev.srcElement;
		pickDate.setTime(dispDate.getTime());
		pickDate.setDate(el.innerText);
		pickDate.syncDates();
		hideMe();
		if(pickDate.getTime()==26586e6){
			aboutTitleElm.innerHTML='Hijri/Gregorian&nbsp;Datepicker';
			aboutDateElm.innerHTML='Gorontalo,&nbsp;25&nbsp;January&nbsp;2019';
			aboutElm.style.display='block'
			aboutCloseBtnElm.focus();
		}
		if(typeof self.onPicked=='function')self.onPicked()
	},
	onFocus=function(ev){ev=ev||window.event;var el=ev.target||ev.srcElement;el.blur()},
	hideMe=function(){if(!getShowing())return false;dpickElm.className+=' w3-hide';deleteDates();return true},
	getShowing=function(){return dpickElm.className.indexOf('w3-hide')==-1},
	getFixTime=function(time){time-=tzOffset;return time-time%864e5+36e5+tzOffset},
	getCurTime=function(){return getFixTime(Date.now())},
	newTheme=function(){var dt=Datepicker.themes,i;do i=Math.floor(Math.random()*dt.length);while(dt[i]==theme);theme=dt[i]},
	applyTheme=function(){headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'))+'w3-'+theme};
	this.attachTo=function(el){if(el.appendChild&&!isAttached){el.appendChild(dpickElm);isAttached=true;return true}return false};
	this.getElement=function(){return dpickElm};
	this.getPickedDate=function(){return pickDate};
	this.hide=function(){return hideMe()};
	this.pick=function(){return this.show()};
	this.resetDate=function(year,month){
		var oldTm=dispDate.getTime();
		dispDate.setFullYear(HijriDate.parseInt(year,dispDate.getFullYear()));
		dispDate.setMonth(HijriDate.parseInt(month,dispDate.getMonth()));
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updPicker();return true}
		return false
	};
	this.setFirstDayOfWeek=function(fdow){
		fdow=HijriDate.parseInt(fdow,firstDay);
		if(fdow!=firstDay){
			firstDay=fdow;recreateWdayTitle();
			if(getShowing()){deleteDates();gridAni='zoom';createDates()}
			return true
		}return false
	};
	this.setFullYear=function(year){return this.resetDate(year)};
	this.setHijriMode=function(hm){
		if(typeof hm=='boolean'&&hm!=isHijr){
			isHijr=hm;dispDate.syncDates();dispDate=dispDate.getOppositeDate();pickDate=pickDate.getOppositeDate();
			var d=dispDate.getDate();dispDate.setDate(1);
			if(d>15)dispDate.setMonth(dispDate.getMonth()+1);
			gridAni='zoom';updPicker();return true
		}return false
	};
	this.setLanguage=function(lng){
		if(typeof lng=='string'){
			lng=lng.toLowerCase();
			if(typeof Datepicker.strData[lng]=='object'&&lng!=lang){
				lang=dispDate.language=dispDate.getOppositeDate().language=pickDate.language=pickDate.getOppositeDate().language=lng;
				recreateWdayTitle();gridAni='zoom';updPicker();return true
			}
		}return false
	};
	this.setMonth=function(month){return this.resetDate(null,month)};
	this.setTheme=function(thm){
		var dt=Datepicker.themes,dtl=dt.length,i=0;
		if(typeof thm=='number'){
			if(0<=thm&&thm<dtl){isAutoNewTheme=false;theme=dt[thm]}
			else{isAutoNewTheme=true;newTheme()}
		}else if(typeof thm=='string'){
			thm=thm.toLowerCase();
			for(;i<dtl;i++)if(dt[i]==thm)break;
			if(i<dtl){isAutoNewTheme=false;theme=dt[i]}
			else{isAutoNewTheme=true;newTheme()}
		}else{isAutoNewTheme=true;newTheme()}
		applyTheme();return isAutoNewTheme
	};
	this.setTime=function(time){
		var oldTm=dispDate.getTime();
		dispDate.setTime(getFixTime(HijriDate.parseInt(time,getCurTime())));
		dispDate.setDate(1);
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updPicker();return true}
		return false
	};
	this.setWidth=function(w){
		w=HijriDate.parseInt(w,width);
		if(isNaN(w))w=width=300;
		else if(w<MIN_WIDTH)w=MIN_WIDTH;
		else if(w>MAX_WIDTH)w=MAX_WIDTH;
		if(w!=width){dpickElm.style.width=w+'px';return true}
		return false
	};
	this.show=function(){
		if(getShowing())return false;
		gridAni='zoom';createDates();dpickElm.className=dpickElm.className.replace(' w3-hide','');scrollToFix();return true
	};
	this.today=function(){
		var oldTm=dispDate.getTime();
		dispDate.setTime(getCurTime());dispDate.setDate(1);
		if(dispDate.getTime()!=oldTm){gridAni='zoom';updPicker();return true}
		return false
	};
	if(typeof isHijr!='boolean')isHijr=false;
	if(!isHijr){dispDate=dispDate.gregorianDate;pickDate=pickDate.gregorianDate}
	firstDay=HijriDate.parseInt(firstDay,1)%7;
	if(typeof lang=='string'){lang=lang.toLowerCase();if(typeof Datepicker.strData[lang]!='object')lang='en'}
	else lang='en';
	dispDate.language=dispDate.getOppositeDate().language=pickDate.language=pickDate.getOppositeDate().language=lang;
	this.setTheme(theme);
	width=HijriDate.parseInt(width,300);
	year=HijriDate.parseInt(year,NaN);
	month=HijriDate.parseInt(month,NaN);
	if(!isNaN(year)&&isNaN(month)){dispDate.setTime(getFixTime(year));dispDate.setDate(1)}
	else{
		dispDate.setTime(getCurTime());dispDate.setDate(1);
		if(!isNaN(year))dispDate.setFullYear(year);
		if(!isNaN(month))dispDate.setMonth(month)
	}
	createStyle();
	createAboutModal();
	createPicker()
}
Date.prototype.language='en';
Date.prototype.getDateString=function(){
	var tds=Datepicker.strData[this.language].weekdayNames[this.getDay()]+',&nbsp;';
	tds+=this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp'+this.getFullYear();
	return tds
};
Date.prototype.getMonthName=function(month){
	month=(HijriDate.parseInt(month,this.getMonth())%12+12)%12;
	return Datepicker.strData[this.language].monthNames[month]
};
Date.prototype.getOppositeDate=function(){return this.hijriDate};
HijriDate.prototype.language='en';
HijriDate.prototype.getDateString=function(){
	var tds=',&nbsp;'+this.getDate()+'&nbsp;'+this.getMonthName()+'&nbsp'+this.getFullYear()+'H';
	tds=this.language=='en'?HijriDate.weekdayNames[this.getDay()]+tds:Datepicker.strData[this.language].weekdayNames[this.getDay()]+tds;
	return tds
};
HijriDate.prototype.getMonthName=function(month){
	month=(HijriDate.parseInt(month,this.getMonth())%12+12)%12;
	return this.language=='en'?HijriDate.monthNames[month]:Datepicker.strData[this.language].hMonthNames[month]
};
HijriDate.prototype.getOppositeDate=function(){return this.gregorianDate};
Datepicker.prototype.onPicked=null;
Datepicker.themes=['amber','aqua','cyan','grey','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','sand','yellow','black','blue','blue-grey','brown','dark-grey','deep-orange','deep-purple','green','indigo','pink','purple','red','teal'];
Datepicker.strData={
	en:{
		eraSuffix:["H","BH","AD","BC"],
		monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
		weekdayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		weekdayShortNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
	},
	id:{
		eraSuffix:["H","SH","M","SM"],
		monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
		weekdayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
		weekdayShortNames:["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
		hMonthNames:["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
	}
};
