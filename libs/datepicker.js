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
	var	self=this,gdate=new Date(),hdate=new HijriDate(),pgdate=new Date(),phdate=new HijriDate(),dispDate,pickDate,
	tzOffset=Date.parse('01 Jan 1970'),isAttached=false,oldTheme,gridAni='zoom',isRTL=false,
	aboutElm,aboutTitleElm,aboutDateElm,aboutCloseBtnElm,
	createElm=function(tagName,className,innerHTML){
		var el=document.createElement(tagName);if(className)el.className=className;if(innerHTML)el.innerHTML=innerHTML;return el
	},
	addEvt=function(el,ev,cb){
		if(window.addEventListener)el.addEventListener(ev,cb);else if(el.attachEvent)el.attachEvent('on'+ev,cb);else el['on'+ev]=cb
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
		var str='svg{stroke:currentColor;fill:currentColor;stroke-width:1}'+
			'.w3-button{background-color:transparent}'+
			'.zulns-datepicker .w3-button{padding:5px 12px}'+
			'.zulns-datepicker .w3-cell{width:14.2857%;padding:4px 0px}'+
			'.right-to-left .w3-cell{float:right!important}'+
			'.unbreakable{overflow:hidden;white-space:nowrap}';
		stl=createElm('style',null,str);stl.id='ZulNsDatepickerStyle';stl.type='text/css';document.body.appendChild(stl);return true
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
		cont.style.cssText='width:440px;height:300px;cursor:default;';
		aboutCloseBtnElm.id='ZulNsAboutCloseButton';aboutTitleElm.id='ZulNsAboutTitle';aboutDateElm.id='ZulNsAboutDate';
		info.appendChild(aboutTitleElm);info.appendChild(zulns);info.appendChild(aboutDateElm);
		cont.appendChild(info);cont.appendChild(aboutCloseBtnElm);aboutElm.appendChild(cont);document.body.appendChild(aboutElm);
		addEvt(aboutCloseBtnElm,'click',function(){
			aboutElm.style.display='none';aboutTitleElm.innerHTML='';aboutDateElm.innerHTML='';
			if(typeof aboutElm.callback=='function')aboutElm.callback();aboutElm.callback=null
		});return true
	},
	createPicker=function(){
		var closeBtnElm=createElm('button','w3-button w3-ripple w3-display-topright','<svg width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z"/></svg>'),
			prevYearBtnElm=createElm('button','w3-button w3-ripple w3-display-left','<svg width="18" height="19"><path d="M6 7L3 13L6 19L8 19L5 13L8 7Z M13 7L10 13L13 19L15 19L12 13L15 7Z"/></svg>'),
			nextYearBtnElm=createElm('button','w3-button w3-ripple w3-display-right','<svg width="18" height="19"><path d="M4 7L7 13L4 19L6 19L9 13L6 7Z M11 7L14 13L11 19L13 19L16 13L13 7Z"/></svg>'),
			prevMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomleft','<svg width="18" height="19"><path d="M10 7L7 13L10 19L12 19L9 13L12 7Z"/></svg>'),
			nextMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomright','<svg width="18" height="19"><path d="M7 7L10 13L7 19L9 19L12 13L9 7Z"/></svg>');
		dpickElm.style.minWidth=MIN_WIDTH+'px';dpickElm.style.maxWidth=MAX_WIDTH+'px';dpickElm.style.width=width+'px';
		headerElm.style.cssText='height:104px;';
		yearValElm.style.cssText='cursor:default;';monthValElm.style.cssText='margin-bottom:3px;cursor:default;';
		wdayTitleElm.style.cssText='padding:2px 4px;margin-bottom:4px;cursor:default;';
		headerElm.appendChild(yearValElm);headerElm.appendChild(monthValElm);headerElm.appendChild(closeBtnElm);
		headerElm.appendChild(prevYearBtnElm);headerElm.appendChild(nextYearBtnElm);headerElm.appendChild(prevMonthBtnElm);
		headerElm.appendChild(nextMonthBtnElm);gridsElm.appendChild(wdayTitleElm);dpickElm.appendChild(headerElm);
		dpickElm.appendChild(gridsElm);
		addEvt(closeBtnElm,'click',onHideMe);addEvt(prevYearBtnElm,'click',onDecYear);
		addEvt(nextYearBtnElm,'click',onIncYear);addEvt(prevMonthBtnElm,'click',onDecMonth);
		addEvt(nextMonthBtnElm,'click',onIncMonth);updHeader();createWdayTitle()
	},
	updHeader=function(){
		yearValElm.innerHTML=Datepicker.getDigit(lang,dispDate.getYearString());
		monthValElm.innerHTML=dispDate.getMonthName()
	},
	createWdayTitle=function(){
		for(var i=firstDay;i<7+firstDay;i++){
			var day=createElm('div','w3-cell',dispDate.getWeekdayShortName(i));
			if(i%7==5)day.className+=' w3-text-teal';
			if(i%7==0)day.className+=' w3-text-red';
			wdayTitleElm.appendChild(day)
		}
	},
	recreateWdayTitle=function(){while(wdayTitleElm.firstChild)wdayTitleElm.removeChild(wdayTitleElm.firstChild);createWdayTitle()},
	createDates=function(){
		var dispTm=dispDate.getTime(),ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		var pcdr=dispDate.getDaysInMonth(),pndr=(7-(ppdr+pcdr)%7)%7;dispDate.setDate(1-ppdr);
		var pdate=dispDate.getDate(),pdim=dispDate.getDaysInMonth(),isFri=(13-firstDay)%7,isSun=(8-firstDay)%7,gridCtr=0,ttc;
		dispDate.setDate(1);
		for(var i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){
				var row=createElm('div','w3-cell-row');row.style.cssText='padding:0px 4px;margin-bottom:0px;';gridsElm.appendChild(row)
			}
			var grid=createElm('button','w3-cell w3-btn w3-center w3-transparent w3-animate-'+gridAni,Datepicker.getDigit(lang,pdate)),
				ttc=dispDate.getTime()+(pdate-1)*864e5;
			grid.setAttribute('val',pdate);
			row.appendChild(grid);ttc=dispDate.getTime()+(pdate-1)*864e5;
			if(getCurTime()==ttc||ttc==26586e6)grid.className+=' w3-'+theme;
			else{
				if(i%7==isFri)grid.className+=' w3-text-teal';
				else if(i%7==isSun)grid.className+=' w3-text-red'
			}
			if(i<=ppdr||ppdr+pcdr<i)grid.disabled=true
			else{
				grid.className+=' w3-ripple date';
				if(i%7==isFri)grid.className+=' w3-hover-teal';
				else if(i%7==isSun)grid.className+=' w3-hover-red';
				else grid.className+=' w3-hover-dark-grey';
				addEvt(grid,'click',onPick)
			}
			pdate++;
			if(pdate>pdim){
				pdate=1;dispDate.setMonth(dispDate.getMonth()+1);pdim=dispDate.getDaysInMonth()
			}
			gridCtr=++gridCtr%7
		}
		var row=createElm('div','w3-container');row.style.marginTop='4px';gridsElm.appendChild(row);dispDate.setTime(dispTm)
	},
	deleteDates=function(){while (gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1])},
	scrollToFix=function(){
		var dw=document.body.offsetWidth,vw=window.innerWidth,vh=window.innerHeight,rect=dpickElm.getBoundingClientRect(),hsSpc=dw>vw?20:0,
			scrollX=rect.left<0?rect.left:0,scrollY=rect.bottom-rect.top>vh?rect.top:rect.bottom>vh-hsSpc?rect.bottom-vh+hsSpc:0;
		window.scrollBy(scrollX,scrollY)
	},
	updPicker=function(){updHeader();if(getShowing()){deleteDates();createDates()}},
	onHideMe=function(){hideMe()},
	onDecYear=function(){gridAni='right';return isRTL?incYear():decYear()},
	onIncYear=function(){gridAni='left';return isRTL?decYear():incYear()},
	onDecMonth=function(){gridAni='right';return isRTL?incMonth():decMonth()},
	onIncMonth=function(){gridAni='left';return isRTL?decMonth():incMonth()},
	onPick=function(ev){
		ev=ev||window.event;
		var el=ev.target||ev.srcElement;
		pickDate.setTime(dispDate.getTime());pickDate.setDate(el.getAttribute('val'));getOppsPDate().setTime(pickDate.getTime());hideMe();
		if(pickDate.getTime()==26586e6){
			aboutTitleElm.innerHTML='Hijri/Gregorian&nbsp;Datepicker';
			aboutDateElm.innerHTML='Gorontalo,&nbsp;25&nbsp;January&nbsp;2019';
			aboutElm.style.display='block'
		}
		if(typeof self.onPicked=='function')self.onPicked()
	},
	decYear=function(){dispDate.setFullYear(dispDate.getFullYear()-1);updPicker()},
	incYear=function(){dispDate.setFullYear(dispDate.getFullYear()+1);updPicker()},
	decMonth=function(){dispDate.setMonth(dispDate.getMonth()-1);updPicker()},
	incMonth=function(){dispDate.setMonth(dispDate.getMonth()+1);updPicker()},
	hideMe=function(){if(!getShowing())return false;dpickElm.className+=' w3-hide';deleteDates();return true},
	getShowing=function(){return dpickElm.className.indexOf('w3-hide')==-1},
	getOppsDate=function(){return isHijr?gdate:hdate},
	getOppsPDate=function(){return isHijr?pgdate:phdate},
	getFixTime=function(time){time-=tzOffset;return time-time%864e5+36e5+tzOffset},
	getCurTime=function(){return getFixTime(Date.now())},
	newTheme=function(){
		var dt=Datepicker.themes,i;oldTheme=theme;do i=Math.floor(Math.random()*dt.length);while(dt[i]==theme);theme=dt[i]
	},
	applyTheme=function(){
		headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'))+'w3-'+theme;
		if(getShowing()){
			var el=gridsElm.querySelector('.w3-'+oldTheme);
			if(el)el.className=el.className.replace('w3-'+oldTheme,'w3-'+theme)
		}
	};
	this.attachTo=function(el){if(el.appendChild&&!isAttached){el.appendChild(dpickElm);isAttached=true;return true}return false};
	this.getElement=function(){return dpickElm};
	this.getOppositePickedDate=function(){return getOppsPDate()};
	this.getPickedDate=function(){return pickDate};
	this.hide=function(){return hideMe()};
	this.pick=function(){return this.show()};
	this.resetDate=function(y,m){
		var t=dispDate.getTime();
		dispDate.setFullYear(HijriDate.parseInt(y,dispDate.getFullYear()));
		dispDate.setMonth(HijriDate.parseInt(m,dispDate.getMonth()));
		if(dispDate.getTime()!=t){gridAni='zoom';updPicker();return true}
		return false
	};
	this.setFirstDayOfWeek=function(f){
		f=HijriDate.parseInt(f,firstDay);
		if(f!=firstDay){
			firstDay=f;recreateWdayTitle();
			if(getShowing()){deleteDates();gridAni='zoom';createDates()}
			return true
		}return false
	};
	this.setFullYear=function(y){return this.resetDate(y)};
	this.setHijriMode=function(h){
		if(typeof h=='boolean'&&h!=isHijr){
			var ct=getCurTime(),dt=dispDate.getTime(),dif=ct-dt,td=dif>=0&&parseInt(dif/864e5)<dispDate.getDaysInMonth();
			dispDate=getOppsDate();pickDate=getOppsPDate();isHijr=h;dispDate.setTime(dt);
			if(td){dispDate.setTime(getCurTime());dispDate.setDate(1)}
			else{
				var d=dispDate.getDate();dispDate.setDate(1);
				if(d>15)dispDate.setMonth(dispDate.getMonth()+1);
			}
			gridAni='zoom';updPicker();return true
		}return false
	};
	this.setLanguage=function(l){
		if(typeof l=='string'){
			l=l.toLowerCase();
			if(typeof Datepicker.language[l]=='object'&&l!=lang){
				lang=gdate.language=hdate.language=pgdate.language=phdate.language=l;
				gridsElm.className=gridsElm.className.replace(' right-to-left','');
				isRTL=Datepicker.language[l].isRTL;if(isRTL)gridsElm.className+=' right-to-left';
				recreateWdayTitle();gridAni='zoom';updPicker();return true
			}
		}return false
	};
	this.setMonth=function(m){return this.resetDate(null,m)};
	this.setTheme=function(t){
		var dt=Datepicker.themes,dtl=dt.length,i=0;
		if(typeof t=='number'){
			if(0<=t&&t<dtl){oldTheme=theme;theme=dt[t]}
			else newTheme()
		}else if(typeof t=='string'){
			t=t.toLowerCase();
			for(;i<dtl;i++)if(dt[i]==t)break;
			if(i<dtl){oldTheme=theme;theme=dt[i]}
			else newTheme()
		}else{isAutoNewTheme=true;newTheme()}
		applyTheme()
	};
	this.setTime=function(t){
		var o=dispDate.getTime();
		dispDate.setTime(getFixTime(HijriDate.parseInt(t,getCurTime())));
		dispDate.setDate(1);
		if(dispDate.getTime()!=o){gridAni='zoom';updPicker();return true}
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
	dispDate=isHijr?hdate:gdate;
	pickDate=isHijr?phdate:pgdate;
	firstDay=HijriDate.parseInt(firstDay,1)%7;
	if(typeof lang=='string'){lang=lang.toLowerCase();if(typeof Datepicker.language[lang]!='object')lang='en'}
	else lang='en';
	gdate.language=hdate.language=pgdate.language=phdate.language=lang;
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
	createStyle();createAboutModal();createPicker()
}
Date.prototype.language='en';
Date.prototype.getDateString=function(){
	return Datepicker.getDigit(this.language,this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getYearString())
};
Date.prototype.getMonthName=function(m){
	m=(HijriDate.parseInt(m,this.getMonth())%12+12)%12;
	return Datepicker.language[this.language].monthNames[m]
};
Date.prototype.getWeekdayName=function(d){
	d=(HijriDate.parseInt(d,this.getDay())%7+7)%7;
	return Datepicker.language[this.language].weekdayNames[d]
};
Date.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.parseInt(d,this.getDay())%7+7)%7;
	var p=Datepicker.language[this.language],s=p.weekdayShortNames;
	return s?s[d]:p.weekdayNames[d]
};
Date.prototype.getYearString=function(y){
	y=HijriDate.parseInt(y,this.getFullYear());
	var p=Datepicker.language[this.language],e=p.eraSuffix,i=0;
	if(e){if(y<1){i++;y=1-y}y=y+' '+e[i]}else y=y.toString();return y
};
HijriDate.prototype.language='en';
HijriDate.prototype.getDateString=function(){
	return Datepicker.getDigit(this.language,this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getYearString())
};
HijriDate.prototype.getMonthName=function(m){
	m=(HijriDate.parseInt(m,this.getMonth())%12+12)%12;
	return this.language=='en'?HijriDate.monthNames[m]:Datepicker.language[this.language].hMonthNames[m]
};
HijriDate.prototype.getWeekdayName=function(d){
	d=(HijriDate.parseInt(d,this.getDay())%7+7)%7;
	if(this.language=='en')return HijriDate.weekdayNames[d]
	return Datepicker.language[this.language].weekdayNames[d]
};
HijriDate.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.parseInt(d,this.getDay())%7+7)%7;
	if(this.language=='en')return HijriDate.weekdayShortNames[d]
	var p=Datepicker.language[this.language],s=p.weekdayShortNames;
	return s?s[d]:p.weekdayNames[d]
};
HijriDate.prototype.getYearString=function(y){
	y=HijriDate.parseInt(y,this.getFullYear());
	var p=Datepicker.language[this.language],e=p.hEraSuffix,i=0;
	if(e){if(y<1){i++;y=1-y}y=y+' '+e[i]}else y=y.toString();return y
};
Datepicker.prototype.onPicked=null;
Datepicker.getDigit=function(l,d){
	if(Datepicker.language[l].digit)
		return d.toString().replace(/\d(?=[^<>]*(<|$))/g,function($0){return Datepicker.language[l].digit[$0]});
	return d
};
Datepicker.themes=['amber','aqua','black','blue','blue-grey','brown','cyan','dark-grey','deep-orange','deep-purple','green','grey','indigo','khaki','light-blue','light-green','lime','orange','pale-blue','pale-green','pale-red','pale-yellow','pink','purple','red','sand','teal','yellow'];
Datepicker.language={en:{
	isRTL:false,
	eraSuffix:["AD","BC"],
	hEraSuffix:["H","BH"],
	monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
	weekdayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	weekdayShortNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
}};
Datepicker.language['id']={
	isRTL:false,
	eraSuffix:["M","SM"],
	hEraSuffix:["H","SH"],
	monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
	weekdayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
	weekdayShortNames:["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
	hMonthNames:["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"]
};
Datepicker.language['ar']={
	isRTL:true,
	digit:["٠","١","٢","٣","٤", "٥","٦","٧","٨","٩"],
	eraSuffix:["ميلادي","قبل الميلاد"],
	hEraSuffix:["هجرة","قبل الهجرة"],
	monthNames:["يَنايِر","فِبرايِر","مارِس","أبريل","مايو","يونيو","يوليو","أغُسطُس","سِبْتَمْبِر","أکْتببِر","نوفَمْبِر","ديسَمْبِر"],
	weekdayNames:["الأحَد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
	hMonthNames:["المُحَرَّم","صَفَر ","رَبيع الاوَّل","رَبيع الآخِر","جُمادى الأولى","جُمادى الآخِرة","رَجَب","شَعبان","رَمَضان","شَوّال","ذو القَعدة","ذو الحِجّة"]
};
