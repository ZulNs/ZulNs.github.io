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
function HijriDate(year,month,date,hour,minute,second,millisecond){
	var gDate=new Date(),
		time,
		tzOffset=gDate.getTimezoneOffset(),
		tzOffsetInMillis=tzOffset*6e4,
		utc={yyy:0,mmm:0,ddd:0,day:0,hh:0,mm:0,ss:0,ms:0},
		loc={yyy:0,mmm:0,ddd:0,day:0,hh:0,mm:0,ss:0,ms:0},
		tzStr=gDate.toString();
	tzStr=tzStr.substring(tzStr.lastIndexOf('GMT'));
	if(year===undefined){
		time=gDate.getTime();
		updateDate(utc,time);
		updateDate(loc,time-tzOffsetInMillis)
	}else if(month===undefined){
		time=HijriDate.parseInt(year,0);
		updateDate(utc,time);
		updateDate(loc,time-tzOffsetInMillis)
	}else{
		loc.yyy=HijriDate.parseInt(year,1);
		loc.mmm=HijriDate.parseInt(month,0);
		loc.ddd=HijriDate.parseInt(date,1);
		loc.hh=HijriDate.parseInt(hour,0);
		loc.mm=HijriDate.parseInt(minute,0);
		loc.ss=HijriDate.parseInt(second,0);
		loc.ms=HijriDate.parseInt(millisecond,0);
		updateLocTime()
	}
	gDate.hijriDate=this;
	this.gregorianDate=gDate;
	//////////////////////////////////////////////////
	// Public Getter Methods
	//////////////////////////////////////////////////
	this.getDate=function(){return loc.ddd};
	this.getDay=function(){return loc.day};
	this.getFullYear=function(){return loc.yyy};
	this.getHours=function(){return loc.hh};
	this.getMilliseconds=function(){return loc.ms};
	this.getMinutes=function(){return loc.mm};
	this.getMonth=function(){return loc.mmm};
	this.getSeconds=function(){return loc.ss};
	this.getTime=function(){return time};
	this.getTimezoneOffset=function(){return tzOffset};
	this.getUTCDate=function(){return utc.ddd};
	this.getUTCDay=function(){return utc.day};
	this.getUTCFullYear=function(){return utc.yyy};
	this.getUTCHours=function(){return utc.hh};
	this.getUTCMilliseconds=function(){return utc.ms};
	this.getUTCMinutes=function(){return utc.mm};
	this.getUTCMonth=function(){return utc.mmm};
	this.getUTCSeconds=function(){return utc.ss};
	//////////////////////////////////////////////////
	// Public Setter Methods
	//////////////////////////////////////////////////
	this.setDate=function(dt){loc.ddd=parseInt(dt);updateLocTime()};
	this.setFullYear=function(yr){loc.yyy=parseInt(yr);updateLocTime()};
	this.setHours=function(hr){loc.hh=parseInt(hr);updateLocTime()};
	this.setMilliseconds=function(ms){loc.ms=parseInt(ms);updateLocTime()};
	this.setMinutes=function(min){loc.mm=parseInt(min);updateLocTime()};
	this.setMonth=function(mon){loc.mmm=parseInt(mon);updateLocTime()};
	this.setSeconds=function(sec){loc.ss=parseInt(sec);updateLocTime()};
	this.setTime=function(tm){time=parseInt(tm);updateDate(utc,time);updateDate(loc,time-tzOffsetInMillis)};
	this.setUTCDate=function(dt){utc.ddd=parseInt(dt);updateUtcTime()};
	this.setUTCFullYear=function(yr){utc.yyy=parseInt(yr);updateUtcTime()};
	this.setUTCHours=function(hr){utc.hh=parseInt(hr);updateUtcTime()};
	this.setUTCMilliseconds=function(ms){utc.ms=parseInt(ms);updateUtcTime()};
	this.setUTCMinutes=function(min){utc.mm=parseInt(min);updateUtcTime()};
	this.setUTCMonth=function(mon){utc.mmm=parseInt(mon);updateUtcTime()};
	this.setUTCSeconds=function(sec){utc.ss=parseInt(sec);updateUtcTime()};
	//////////////////////////////////////////////////
	// Public Conversion Getter Methods
	//////////////////////////////////////////////////
	this.toDateString=function(){return HijriDate.weekdayShortNames[loc.day]+' '+HijriDate.monthShortNames[loc.mmm]+' '+HijriDate.toDigit(loc.ddd,2)+' '+HijriDate.toDigit(loc.yyy,4)};
	this.toISOString=function(){return HijriDate.toDigit(utc.yyy,utc.yyy<0?6:4)+'-'+HijriDate.toDigit(utc.mmm+1,2)+'-'+HijriDate.toDigit(utc.ddd,2)+'T'+getUtcTimeStr()+'.'+HijriDate.toDigit(utc.ms,3)+'Z'};
	this.toJSON=function(){return this.toISOString()};
	this.toString=function(){return this.toDateString()+' '+this.toTimeString()};
	this.toTimeString=function(){return getLocTimeStr()+' '+tzStr};
	this.toUTCString=function(){return HijriDate.weekdayShortNames[utc.day]+', '+HijriDate.toDigit(utc.ddd,2)+' '+HijriDate.monthShortNames[utc.mmm]+' '+HijriDate.toDigit(utc.yyy,4)+' '+getUtcTimeStr()+' GMT'};
	this.valueOf=function(){return time};
	//////////////////////////////////////////////////
	// Public Exclusive Getter Methods
	//////////////////////////////////////////////////
	this.getDaysInMonth=function(){return HijriDate.daysInMonth((loc.yyy-1)*12+loc.mmm)};
	this.getUTCDaysInMonth=function(){return HijriDate.daysInMonth((utc.yyy-1)*12+utc.mmm)};
	//////////////////////////////////////////////////
	// Public Exclusive Methods
	//////////////////////////////////////////////////
	this.syncDates=function(){if(gDate.setTime){gDate.setTime(time);return true}return false};
	//////////////////////////////////////////////////
	// Private Methods
	//////////////////////////////////////////////////
	function getUtcTimeStr(){return HijriDate.toDigit(utc.hh,2)+':'+HijriDate.toDigit(utc.mm,2)+':'+HijriDate.toDigit(utc.ss,2)}
	function getLocTimeStr(){return HijriDate.toDigit(loc.hh,2)+':'+HijriDate.toDigit(loc.mm,2)+':'+HijriDate.toDigit(loc.ss,2)}
	function updateUtcTime(){updateTime(utc);updateDate(utc,time);updateDate(loc,time-tzOffsetInMillis)}
	function updateLocTime(){updateTime(loc);updateDate(loc,time);time+=tzOffsetInMillis;updateDate(utc,time)}
	function updateTime(region){
		var trueMonth=(region.yyy-1)*12+region.mmm;
		time=HijriDate.dayCount(trueMonth);
		time+=region.ddd-1;
		time*=864e5;
		time+=region.hh*36e5;
		time+=region.mm*6e4;
		time+=region.ss*1e3;
		time+=region.ms;
		time+=HijriDate.constInterval
	}
	function updateDate(region,timeVal){
		timeVal-=HijriDate.constInterval;
		var timePortion=timeVal%864e5,
			dayCount=parseInt(timeVal/864e5),
			trueMonth=parseInt(dayCount/HijriDate.moonCycle);
		if(timeVal<0){
			if(timePortion<0){dayCount--;timePortion+=864e5}
			if (dayCount<HijriDate.dayCount(trueMonth))trueMonth--
		}
		region.ddd=1+dayCount-HijriDate.dayCount(trueMonth);
		if(region.ddd>HijriDate.daysInMonth(trueMonth))region.ddd-=HijriDate.daysInMonth(trueMonth++);
		region.yyy=Math.floor(trueMonth/12)+1;
		region.mmm=(trueMonth%12+12)%12;//this handle both neg and pos value
		region.ms=timePortion%1e3;
		timePortion=parseInt(timePortion/1e3);
		region.ss=timePortion%60;
		timePortion=parseInt(timePortion/60);
		region.mm=timePortion%60;
		timePortion=parseInt(timePortion/60);
		region.hh=timePortion%24;
		region.day=((dayCount+5)%7+7)%7
	}
}
//////////////////////////////////////////////////
// Static Members
//////////////////////////////////////////////////
HijriDate.moonCycle=29.5305882;
HijriDate.constInterval=-42521587200000;//Value of time interval in milliseconds from January 1, 1970AD, 00:00:00 AM to July 19, 622AD, 00:00:00 AM 
HijriDate.monthNames=["Muharram","Safar","Rabi'ul-Awwal","Rabi'ul-Akhir","Jumadal-Ula","Jumadal-Akhir","Rajab","Sha'ban","Ramadan","Syawwal","Dhul-Qa'da","Dhul-Hijja"];
HijriDate.monthShortNames=["Muh","Saf","RAw","RAk","JAw","JAk","Raj","Sha","Ram","Sya","DhQ","DhH"];
HijriDate.weekdayNames=["Ahad","Ithnin","Thulatha","Arba'a","Khams","Jumu'ah","Sabt"];
HijriDate.weekdayShortNames=["Ahd","Ith","Thu","Arb","Kha","Jum","Sab"];
//////////////////////////////////////////////////
// Static Methods
//////////////////////////////////////////////////
HijriDate.daysInMonth=function(month){return HijriDate.dayCount(month+1)-HijriDate.dayCount(month)};
HijriDate.dayCount=function(month){
	if(month>=0) return parseInt(month*HijriDate.moonCycle);
	var range=(parseInt(month/360)-1)*360;//30 years cycle
	return parseInt(range*HijriDate.moonCycle)-parseInt((range-month)*HijriDate.moonCycle)
};
HijriDate.parseInt=function(num,def){num=parseInt(num);return isNaN(num)?def:num};
HijriDate.toDigit=function(num,digitCount){
	var ns=Math.abs(num).toString();
	if(ns.length<digitCount)ns=('00000000'+ns).slice(-digitCount);
	if(num<0)ns='-'+ns
	return ns;
};
//////////////////////////////////////////////////
// Public Exclusive Methods for Date Object
//////////////////////////////////////////////////
Date.prototype.hijriDate;
Date.prototype.getDaysInMonth=function(){
	var y=this.getFullYear(),isLeapYear=(y%100!=0)&&(y%4==0)||(y%400==0),daysInMonth=[31,isLeapYear?29:28,31,30,31,30,31,31,30,31,30,31];
	return daysInMonth[this.getMonth()]
};
Date.prototype.getUTCDaysInMonth=function(){
	var y=this.getUTCFullYear(),isLeapYear=(y%100!=0)&&(y%4==0)||(y%400==0),daysInMonth=[31,isLeapYear?29:28,31,30,31,30,31,31,30,31,30,31];
	return daysInMonth[this.getUTCMonth()]
};
Date.prototype.syncDates=function(){if(this.hijriDate.setTime){this.hijriDate.setTime(this.getTime());return true}return false};
