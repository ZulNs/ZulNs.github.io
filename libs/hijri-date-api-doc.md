# Hijri-Date API Documentation

## Overview


## Download
- [hijri-date.js](https://ZulNs.github.io/libs/hijri-date.js)

## Public Constructors
- **`HijriDate()`**

  Initializes this `HijriDate` instance to the current time.

- **`HijriDate(time)`**

  Initializes this `HijriDate` instance using the specified millisecond value.

- **`HijriDate(year, month, date, hour, minute, second, millisecond)`**

  Initializes this `HijriDate` instance using to the specified date and time in the default `TimeZone`.

## Public Methods
- **`getDate()`**

  Returns the day of the month (1-30) for the specified date according to local time.

- **`getDateString()`**

  Returns the string represented the specified date according to local time e.g. `"Thulatha, 17 Ramadhan 1435 H"`.

- **`getDay()`**

  Returns the day of the week (0-6) for the specified date according to local time.
  
- **`getDayName(day)`**

  Returns the string of day name in the  day of the week (`"Ahad"` for `day = 0` - `"Sabt"` for `day = 6`). If the `day` argument is omitted, then the string of day name for the specified date according to local time would returned.

- **`getDayShortName(day)`**

  Returns the string of short name of day in the day of the week (`"Ahd"` for `day = 0` - `"Sab"` for `day = 6`). If the `day` argument is omitted then the string of short name of day for the specified date according to local time would returned.

- **`getDaysInMonth()`**

  Returns the number of days (29/30) in the specified month of the specified date according to local time.

- **`getFullDateString()`**

  Returns the string represented the specified date and time according to local time e.g. `"Thulatha, 17 Ramadhan 1435 H, 14:11:05.000"`.

- **`getFullYear()`**

  Returns the year (4 digits for 4-digit years) of the specified date according to local time.

- **`getFullYearString()`**

  Returns the string of year (4 digits for 4-digit years) ended with `"AH"` (After Hijri) symbol (for positive number of year) or `"BH"` (Before Hijri) symbol (for zero and negative number of year) of the specified date according to local time.

- **`getGregorianDate()`**

  Returns the instance of `Date` class for the specified date according to local time.

- **`getHours()`**

  Returns the hour (0-23) in the specified date according to local time.

- **`getJavaWeekday()`**

  Returns the day of the week by confidence of Java tribe in Indonesia (0-4) for the specified date according to local time.

- **`getJavaWeekdayName(day)`**

  Returns the sting of day name of day of the week by confidence of Java tribe in Indonesia (`"Legi"` for `day = 0` - `"Kliwon"` for `day = 4`). If `day` is omitted, then the string of day name for the specified date according to local time would returned.

- **`getMilliseconds()`**

  Returns the milliseconds (0-999) in the specified date according to local time.

- **`getMinutes()`**

  Returns the minutes (0-59) in the specified date according to local time.

- **`getMonth()`**

  Returns the month (0-11) in the specified date according to local time.

- **`getMonthName(month)`**

  Returns the string of month name (`"Muharram"` for `month = 0` - `"Dhul-Hijja"` for `month = 11`). If `month` is omitted, then the string of month name for the specified time according to local time was returned.

- **`getMonthShortName(month)`**

  Returns the string of short name of month (`"Muh"` for `month = 0` - `"DhH"` for `month = 11`). If `month` is omitted, then the string of short name of the month for the specified time according to local time was returned.

- **`getSeconds()`**

  Returns the seconds (0-59) in the specified date according to local time.

- **`getTime()`**

  Returns the numeric value of the specified date as the number of milliseconds since Syawwal 22, 1389 H, 06:00:00.000 UTC (this moment is coincide with January 1, 1970, 00:00:00.000 UTC for compatibility of time value with JavaScript standard `Date` object). Negative for prior times.

- **`getTimeString()`**

  Returns the string represented the specified time according to local time e.g. `"14:11:05.000"`.

- **`setDate(day)`**

  Sets the day of the month for a specified date according to local time.

- **`setFullYear(year)`**

  Sets the full year (e.g. 4 digits for 4-digit years) for a specified date according to local time.

- **`setHours(hours)`**

  Sets the hours for a specified date according to local time.

- **`setMilliseconds(milliseconds)`**

  Sets the milliseconds for a specified date according to local time.

- **`setMinutes(minutes)`**

  Sets the minutes for a specified date according to local time.

- **`setMonth(month)`**

  Sets the month for a specified date according to local time.

- **`setSeconds(seconds)`**

  Sets the seconds for a specified date according to local time.

- **`setTime(time)`**

  Sets the `HijriDate` object to the time represented by a number of milliseconds since Syawwal 22, 1389 H, 06:00:00.000 UTC, allowing for negative numbers for times prior.

- **`toString()`**

  Similar to `getFullDateString()` method which returns the string represented the specified date and time according to local time e.g. `"Thulatha, 17 Ramadhan 1435 H, 14:11:05.000"`.

- **`valueOf()`**

  Similar to `getTime()` method which returns the numeric value of the specified date as the number of milliseconds since Syawwal 22, 1389 H, 06:00:00.000 UTC (this moment is coincide with January 1, 1970, 00:00:00.000 UTC for compatibility of time value with JavaScript standard `Date` object). Negative for prior times.

## Public Methods of Extended Date Class
By using this `HijriDate` class, the standard `Date` class will be extended with the following public methods:

- **`getDateString()`**

  Returns the string represented the specified date according to local time e.g. `"Tuesday, July 14, 2014 AD"`.

- **`getDayName(day)`**

  Returns the string of day name in the  day of the week (`"Sunday"` for `day = 0` - `"Saturday"` for `day = 6`). If the `day` argument is omitted, then the string of day name for the specified date according to local time would returned.

- **`getDayShortName(day)`**

  Returns the string of short name of day in the day of the week (`"Sun"` for `day = 0` - `"Sat"` for `day = 6`). If the `day` argument is omitted then the string of short name of day for the specified date according to local time would returned.

- **`getDaysInMonth()`**

  Returns the number of days (28/29/30/31) in the specified month of the specified date according to local time.

- **`getFullDateString()`**

  Returns the string represented the specified date and time according to local time e.g. `"Thulatha, 17 Ramadhan 1435 H, 14:11:05.000"`.

- **`getFullYearString()`**

  Returns the string of year (4 digits for 4-digit years) ended with `"AD"` (Anno Domini) symbol (for positive number of year) or `"BC"` (Before the Century) symbol (for zero and negative number of year) of the specified date according to local time.

- **`getHijriDate()`**

  Returns the instance of `HijriDate` class for the specified date according to local time.

- **`getJavaWeekday()`**

  Returns the day of the week by confidence of Java tribe in Indonesia (0-4) for the specified date according to local time.

- **`getJavaWeekdayName(day)`**

  Returns the sting of day name of day of the week by confidence of Java tribe in Indonesia (`"Legi"` for `day = 0` - `"Kliwon"` for `day = 4`). If `day` is omitted, then the string of day name for the specified date according to local time would returned.

- **`getMonthName(month)`**

  Returns the string of month name (`"January"` for `month = 0` - `"December"` for `month = 11`). If `month` is omitted, then the string of month name for the specified time according to local time was returned.

- **`getMonthShortName(month)`**

  Returns the string of short name of month (`"Jan"` for `month = 0` - `"Dec"` for `month = 11`). If `month` is omitted, then the string of short name of the month for the specified time according to local time was returned.

- **`getTimeString()`**

  Returns the string represented the specified time according to local time e.g. `"14:11:05.000"`.

&nbsp;

&nbsp;

---
#### Made By ZulNs
##### @Yogyakarta, February 2016
---
