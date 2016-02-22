# Calendar API Documentation

## Overview
This calendar widget can be used to display **Gregorian** or **Hijri** date, and of course as the converter between the two calendar system, it can also be used as datepicker for both systems. It's full customizable for above both calendar system interchange, first day of week (**Monday** or **Sunday**), auto hide calendar on select a date, auto select the date when **month** or **year** value was changed. This customization can be applied on the fly (at run time) also of course in the way programmatically (at design time). This widget has *month bar* which has drop down list to select the desired month between 12 available month names for the concerned calendar system. There are two buttons associated with the sequence of the month which serve to lower and raise its sequence by one step. This widget also has *year bar* which its value can be directly edited. Similar to the *month bar*, the *year bar* also has two buttons associated with its value which serve to decrement and increment that value by one. Only difference that *year bar* has four extra buttons which change the year value respectively decrement by 100, decrement by 10, increment by 10, and increment by 100. Those extra buttons can be displayed or hidden on the fly at will of the user.

## Download
- [calendar.js](https://ZulNs.github.io/libs/calendar.js)

## Requirements
- [hijri-date.js](https://ZulNs.github.io/libs/hijri-date.js) which allows the use of `HijriDate()` class
- [calendar.css](https://ZulNs.github.io/libs/calendar.css) for styling this widget

## Public Constructor
**`Calendar(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate, year, month, date)`**

### Arguments:
- **`isHijriMode`**, sets the calendar mode

  **`true`** : Hijri Calendar mode

  **`false`** : Gregorian Calendar mode

  Default : **`false`**

- **`firstDayOfWeek`**, sets the first day of week

  **`0`** : Sunday

  **`1`** : Monday

  Default : **`1`**

- **`isAutoHide`**

  **`true`** : hides the widget when a date was selected

  **`false`** : doesn't hide the widget when a date was selected

  Default : **`true`**

- **`isAutoSelectedDate`**

  **`true`** : auto select a date when the month or year value was changed

  **`false`** : doesn't select a date when the month or year value was changed

  Default : **`false`**

- **`year`**, **`month`**, and **`date`**

  Those arguments are the same as arguments used in JavaScript standard `Date()` class or custom `HijriDate()` class, except `year` argument is using `FullYear` instead. When those are omitted, the current date will be used.

## Public Methods
- **`changeAutoHide()`**

  Toggles the widget auto hide on select the date.

- **`changeAutoSelectedDate()`**

  Toggles auto select a date when the month or year value changed.

- **`changeDateMode()`**

  Toggles calendar mode from Gregorian to Hijri or vice versa.

- **`changeFirstDayOfWeek()`**

  Toggles first day of week from Monday to Sunday or vice versa.

- **`destroy()`**

  Destroys the widget object and releases it from memory.

- **`disableCallback(state)`**

  Disable the calling permission to a function which is pointed by `callback` property while `state = true`, or enable it while `state = false`. This *internal calling permission flag* was in the enabled state since object creation.

- **`firstDayOfWeek()`**

  Returns `1` if Sunday as first day of week or `0` for Monday.

- **`getDate()`**

  Returns the selected date as `Date()` or `HijriDate()` object depend on current calendar mode.

- **`getElement()`**

  Returns the widget `div` element.

- **`getTime()`**

  Returns the long value of time in milliseconds which represents the selected date.

- **`hide()`**

  Hides the widget.

- **`isAutoHide()`**

  Returns `true` if the widget was in auto hide on select the date, `false` if wasn't.

- **`isAutoSelectedDate()`**

  Returns `true` if the widget was in auto select the date when the month or year value was changed, `false` if wasn't.

- **`isHidden()`**

  Returns `true` if the widget state was hidden, `false` if wasn't.

- **`isHijriMode()`**

  Returns `true` when the calendar was in Hijri mode or `false` for Gregorian mode.

- **`setAbsolutePosition(pos)`**

  Sets the widget position on the page by styling the CSS property `position: absolute` while `pos = true` or `position: relative` while `pos = false` for.

- **`setDate(setYear, setMonth, setDate)`**

  Sets the selected date to a desired date.

- **`setTime(time)`**

  Sets the selected date to a desired date using long value of `time` in milliseconds.

- **`show()`**

  Shows the widget.

## Public Properties
- **`callback`**

  Assign this property to a function that do some processes when a date was selected. This function will be called as long as the *internal calling permission flag* was in the enabled state. The calling permission state can be changed through `disableCallback(disabled_state)` method.

  For example:

      var cal = new Calendar();
      cal.callback = function() {
          // do stuff
      };

- **`onHide`**

  Assign this property to a function that do some processes when the calendar was hidden/closed.

  For example, this destroys the widget when it was closed:

      var cal = new Calendar();
      cal.onHide = function() {
          cal.destroy();
      };

## Getting Started

### Using the Calendar Widget on a Web Page
Generally, you'll need to include these three files on any page to use the calendar widget:

	<link rel="stylesheet" href="https://ZulNs.github.io/libs/calendar.css"/>
	<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date.js"></script>
	<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar.js"></script>

For the following code examples, please insert them at anywhere you want within the document's body.

### Using the Widget as a Calendar
#### Code example:

	<div id="calendar"><input id="show-button" type="button" onclick="showMe();" value="Show Calendar" /></div>
	<script type="text/javascript">
		var showBtn = document.getElementById('show-button');
		var cal = new Calendar();
		document.getElementById('calendar').appendChild(cal.getElement());
		showMe();
		
		cal.onHide = function() {
			showBtn.style.display = 'block'
		};
		
		function showMe() {
			showBtn.style.display = 'none';
			cal.show();
		}
	</script>

#### Result:
To see the result you need the [HTML version](https://ZulNs.github.io/libs/calendar-api-doc.html) of this documentation.

### Using the Widget as a Datepicker
#### Code example:

	<div id="datepicker"><input id="picked-text" type="text" size="35"/><input id="pick-button" type="button" onclick="pickADate();" value="pick"/></div>
	<script type="text/javascript">
		var pickedTxt = document.getElementById('picked-text');
		var pickBtn = document.getElementById('pick-button');
		var datepicker = new Calendar();
		var datepickerElm = datepicker.getElement();
		document.getElementById('datepicker').appendChild(datepickerElm);
		datepickerElm.style.marginTop = '10px';
		
		datepicker.callback = function() {
			pickedTxt.value = datepicker.getDate().getDateString();
		};
		
		datepicker.onHide = function() {
			pickBtn.style.display = 'inline-block';
		};
		
		function pickADate() {
			pickBtn.style.display = 'none';
			datepicker.show();
		}
	</script>

#### Result:
To see the result you need the [HTML version](https://ZulNs.github.io/libs/calendar-api-doc.html) of this documentation.

### Side by Side Gregorian - Hijri Calendar Converter
#### Code example:

	<div id="calendar-converter"></div>
	<script type="text/javascript">
		var cal1 = new Calendar(false, 1, false, true);
		var cal2 = new Calendar(true, 0, false, true);
		var cal1Elm = cal1.getElement();
		var cal2Elm = cal2.getElement();
		var cal1Mode = cal1.isHijriMode();
		var cal2Mode = cal2.isHijriMode();
		document.getElementById('calendar-converter').appendChild(cal1Elm);
		document.getElementById('calendar-converter').appendChild(cal2Elm);
		cal1Elm.style.display = 'inline-block';
		cal2Elm.style.display = 'inline-block';
		cal2Elm.style.marginLeft = '20px';
		cal1.show();
		cal2.show();
		
		cal1.callback = function() {
			if (cal1Mode !== cal1.isHijriMode()) {
				cal2.disableCallback(true);
				cal2.changeDateMode();
				cal2.disableCallback(false);
				cal1Mode = cal1.isHijriMode();
				cal2Mode = cal2.isHijriMode();
			}
			else
				cal2.setTime(cal1.getTime());
		};
		
		cal2.callback = function() {
			if (cal2Mode !== cal2.isHijriMode()) {
				cal1.disableCallback(true);
				cal1.changeDateMode();
				cal1.disableCallback(false);
				cal1Mode = cal1.isHijriMode();
				cal2Mode = cal2.isHijriMode();
			}
			else
				cal1.setTime(cal2.getTime());
		};
		
		cal1.onHide = function() {
			cal1.show();
		};
		
		cal1.onHide = function() {
			cal1.show();
		};
	</script>

#### Result:
To see the result you need the [HTML version](https://ZulNs.github.io/libs/calendar-api-doc.html) of this documentation.

---
#### Made By ZulNs
##### @Yogyakarta, January 2016
---
