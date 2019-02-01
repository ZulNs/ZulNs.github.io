/**
 *
 * @description JavaScript Hijri Date Function
 * @version 2.0
 * 
 * @author (c) ZulNs, Yogyakarta, December 2013
 * revised to version 2.0: Gorontalo, 18 January 2019
 * 
 * @namespace HijriDate
 */
function HijriDate(){
	var time=Date.now(),
		tzom=Date.parse('01 Jan 1970'),
		tzo=parseInt(parseInt(tzom/1000)/60),
		tzs=Date(1970,0,1),
		utc={yyy:0,mmm:0,ddd:0,day:0,hh:0,mm:0,ss:0,ms:0},
		loc={yyy:0,mmm:0,ddd:0,day:0,hh:0,mm:0,ss:0,ms:0};
	tzs=tzs.substring(tzs.lastIndexOf('GMT'));
	if(arguments.length==0){
		updateDate(utc,time);
		updateDate(loc,time-tzom)
	}else if(arguments.length==1){
		time=HijriDate.parseInt(arguments[0],time);
		updateDate(utc,time);
		updateDate(loc,time-tzom)
	}else{
		loc.yyy=HijriDate.parseInt(arguments[0],1);
		loc.mmm=HijriDate.parseInt(arguments[1],0);
		loc.ddd=HijriDate.parseInt(arguments[2],1);
		loc.hh=HijriDate.parseInt(arguments[3],0);
		loc.mm=HijriDate.parseInt(arguments[4],0);
		loc.ss=HijriDate.parseInt(arguments[5],0);
		loc.ms=HijriDate.parseInt(arguments[6],0);
		updateLocTime()
	}
	//
	// Public Getter Methods
	//
	this.getDate=function(){return loc.ddd};
	this.getDay=function(){return loc.day};
	this.getFullYear=function(){return loc.yyy};
	this.getHours=function(){return loc.hh};
	this.getMilliseconds=function(){return loc.ms};
	this.getMinutes=function(){return loc.mm};
	this.getMonth=function(){return loc.mmm};
	this.getSeconds=function(){return loc.ss};
	this.getTime=function(){return time};
	this.getTimezoneOffset=function(){return tzo};
	this.getUTCDate=function(){return utc.ddd};
	this.getUTCDay=function(){return utc.day};
	this.getUTCFullYear=function(){return utc.yyy};
	this.getUTCHours=function(){return utc.hh};
	this.getUTCMilliseconds=function(){return utc.ms};
	this.getUTCMinutes=function(){return utc.mm};
	this.getUTCMonth=function(){return utc.mmm};
	this.getUTCSeconds=function(){return utc.ss};
	//
	// Public Setter Methods
	//
	this.setDate=function(dt){loc.ddd=HijriDate.parseInt(dt,loc.ddd);updateLocTime()};
	this.setFullYear=function(yr){loc.yyy=HijriDate.parseInt(yr,loc.yyy);updateLocTime()};
	this.setHours=function(hr){loc.hh=HijriDate.parseInt(hr,loc.hh);updateLocTime()};
	this.setMilliseconds=function(ms){loc.ms=HijriDate.parseInt(ms,loc.ms);updateLocTime()};
	this.setMinutes=function(min){loc.mm=HijriDate.parseInt(min,loc.mm);updateLocTime()};
	this.setMonth=function(mon){loc.mmm=HijriDate.parseInt(mon,loc.mmm);updateLocTime()};
	this.setSeconds=function(sec){loc.ss=HijriDate.parseInt(sec,loc.ss);updateLocTime()};
	this.setTime=function(tm){time=HijriDate.parseInt(tm,time);updateDate(utc,time);updateDate(loc,time-tzom)};
	this.setUTCDate=function(dt){utc.ddd=HijriDate.parseInt(dt,utc.ddd);updateUtcTime()};
	this.setUTCFullYear=function(yr){utc.yyy=HijriDate.parseInt(yr,utc.yyy);updateUtcTime()};
	this.setUTCHours=function(hr){utc.hh=HijriDate.parseInt(hr,utc.hh);updateUtcTime()};
	this.setUTCMilliseconds=function(ms){utc.ms=HijriDate.parseInt(ms,utc.ms);updateUtcTime()};
	this.setUTCMinutes=function(min){utc.mm=HijriDate.parseInt(min,utc.mm);updateUtcTime()};
	this.setUTCMonth=function(mon){utc.mmm=HijriDate.parseInt(mon,utc.mmm);updateUtcTime()};
	this.setUTCSeconds=function(sec){utc.ss=HijriDate.parseInt(sec,utc.ss);updateUtcTime()};
	//
	// Public Conversion Getter Methods
	//
	this.toDateString=function(){return HijriDate.weekdayShortNames[loc.day]+' '+HijriDate.monthShortNames[loc.mmm]+' '+HijriDate.toDigit(loc.ddd,2)+' '+HijriDate.toDigit(loc.yyy,4)};
	this.toISOString=function(){return HijriDate.toDigit(utc.yyy,utc.yyy<0?6:4)+'-'+HijriDate.toDigit(utc.mmm+1,2)+'-'+HijriDate.toDigit(utc.ddd,2)+'T'+getUtcTimeStr()+'.'+HijriDate.toDigit(utc.ms,3)+'Z'};
	this.toJSON=function(){return this.toISOString()};
	this.toString=function(){return this.toDateString()+' '+this.toTimeString()};
	this.toTimeString=function(){return getLocTimeStr()+' '+tzs};
	this.toUTCString=function(){return HijriDate.weekdayShortNames[utc.day]+', '+HijriDate.toDigit(utc.ddd,2)+' '+HijriDate.monthShortNames[utc.mmm]+' '+HijriDate.toDigit(utc.yyy,4)+' '+getUtcTimeStr()+' GMT'};
	this.valueOf=function(){return time};
	//
	// Public Exclusive Getter Methods
	//
	this.getDaysInMonth=function(){return HijriDate.daysInMonth((loc.yyy-1)*12+loc.mmm)};
	this.getUTCDaysInMonth=function(){return HijriDate.daysInMonth((utc.yyy-1)*12+utc.mmm)};
	//
	// Private Methods
	//
	function getUtcTimeStr(){return HijriDate.toDigit(utc.hh,2)+':'+HijriDate.toDigit(utc.mm,2)+':'+HijriDate.toDigit(utc.ss,2)}
	function getLocTimeStr(){return HijriDate.toDigit(loc.hh,2)+':'+HijriDate.toDigit(loc.mm,2)+':'+HijriDate.toDigit(loc.ss,2)}
	function updateUtcTime(){updateTime(utc);updateDate(utc,time);updateDate(loc,time-tzom)}
	function updateLocTime(){updateTime(loc);updateDate(loc,time);time+=tzom;updateDate(utc,time)}
	function updateTime(reg){
		var trueMonth=(reg.yyy-1)*12+reg.mmm;
		time=HijriDate.dayCount(trueMonth);
		time+=reg.ddd-1;
		time*=864e5;
		time+=reg.hh*36e5;
		time+=reg.mm*6e4;
		time+=reg.ss*1e3;
		time+=reg.ms;
		time+=HijriDate.constInterval
	}
	function updateDate(reg,timeVal){
		timeVal-=HijriDate.constInterval;
		var timePortion=timeVal%864e5,
			dayCount=parseInt(timeVal/864e5),
			trueMonth=parseInt(dayCount/HijriDate.moonCycle);
		if(timeVal<0){
			if(timePortion<0){dayCount--;timePortion+=864e5}
			if (dayCount<HijriDate.dayCount(trueMonth))trueMonth--
		}
		reg.ddd=1+dayCount-HijriDate.dayCount(trueMonth);
		if(reg.ddd>HijriDate.daysInMonth(trueMonth))reg.ddd-=HijriDate.daysInMonth(trueMonth++);
		reg.yyy=Math.floor(trueMonth/12)+1;
		reg.mmm=(trueMonth%12+12)%12;//this handle both neg and pos value
		reg.ms=timePortion%1e3;
		timePortion=parseInt(timePortion/1e3);
		reg.ss=timePortion%60;
		timePortion=parseInt(timePortion/60);
		reg.mm=timePortion%60;
		timePortion=parseInt(timePortion/60);
		reg.hh=timePortion%24;
		reg.day=((dayCount+5)%7+7)%7
	}return this.toString()
}
//
// Static Members
//
HijriDate.moonCycle=29.5305882;
HijriDate.constInterval=-42521587200000;//Value of time interval in milliseconds from January 1, 1970AD, 00:00:00 AM to July 19, 622AD, 00:00:00 AM 
HijriDate.monthNames=["Muharram","Safar","Rabi'ul-Awwal","Rabi'ul-Akhir","Jumadal-Ula","Jumadal-Akhir","Rajab","Sha'ban","Ramadan","Syawwal","Dhul-Qa'da","Dhul-Hijja"];
HijriDate.monthShortNames=["Muh","Saf","RAw","RAk","JAw","JAk","Raj","Sha","Ram","Sya","DhQ","DhH"];
HijriDate.weekdayNames=["Ahad","Ithnin","Thulatha","Arba'a","Khams","Jumu'ah","Sabt"];
HijriDate.weekdayShortNames=["Ahd","Ith","Thu","Arb","Kha","Jum","Sab"];
//
// Static Methods
//
HijriDate.daysInMonth=function(m){return HijriDate.dayCount(m+1)-HijriDate.dayCount(m)};
HijriDate.dayCount=function(m){
	if(m>=0) return parseInt(m*HijriDate.moonCycle);
	var r=(parseInt(m/360)-1)*360;//30 years cycle
	return parseInt(r*HijriDate.moonCycle)-parseInt((r-m)*HijriDate.moonCycle)
};
HijriDate.parseInt=function(n,d){n=parseInt(n);return isNaN(n)?d:n};
HijriDate.toDigit=function(n,d){var s=Math.abs(n).toString();if(s.length<d)s=('00000000'+s).slice(-d);if(n<0)s='-'+s;return s};
//
// Public Exclusive Getter Methods for Date Objects
//
Date.prototype.getDaysInMonth=function(){
	var y=this.getFullYear(),isLeapYear=(y%100!=0)&&(y%4==0)||(y%400==0),daysInMonth=[31,isLeapYear?29:28,31,30,31,30,31,31,30,31,30,31];
	return daysInMonth[this.getMonth()]
};
Date.prototype.getUTCDaysInMonth=function(){
	var y=this.getUTCFullYear(),isLeapYear=(y%100!=0)&&(y%4==0)||(y%400==0),daysInMonth=[31,isLeapYear?29:28,31,30,31,30,31,31,30,31,30,31];
	return daysInMonth[this.getUTCMonth()]
};
