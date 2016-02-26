# Calendar API Documentation

## Overview
This calendar widget can be used to display **Gregorian** or **Hijri** date, and of course as the converter between the two calendar system, it can also be used as datepicker for both systems. It's full customizable for above both calendar system interchange, first day of week (**Monday** or **Sunday**), auto hide calendar on select a date, auto select the date when **month** or **year** value was changed. This customization can be applied on the fly (at run time) also of course in the way programmatically (at design time). This widget has a *month bar* which has a drop down list to select the desired month between 12 available month names for the concerned calendar system. There are two buttons associated with the sequence of the month which serve to lower and raise its sequence by one step. This widget also has a *year bar* which its value can be directly edited. Similar to the *month bar*, the *year bar* also has two buttons associated with its value which serve to decrement and increment that value by one. Only difference that *year bar* has another extra four buttons which change the year value respectively decrement by 100, decrement by 10, increment by 10, and increment by 100. Those extra buttons can be displayed or hidden on the fly at will of the user.

## Download
- [calendar.js](https://ZulNs.github.io/libs/calendar.js)

## Requirements
- [hijri-date.js](https://ZulNs.github.io/libs/hijri-date.js) which allows the use of [`HijriDate()`](https://ZulNs.github.io/libs/hijri-date-api-doc.md) class
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

  Returns the selected date as an instance of `Date()` or `HijriDate()` depends on the current calendar mode.

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

- **`setDate(setYear, setMonth, setDate)`**

  Sets the selected date to a desired date.

- **`setDisplayStyle(style)`**

  Sets the widget display style on the page by styling the CSS `display` property to a style which represents by `style` string argument. Default string value is `"block"`, which causes an instance of this widget takes up one row in the document page. To display more than one instance in a row, provide `"inline-block"` to this argument.

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

### Embedding the Calendar Widget on a Web Page
Generally, you'll need to include these three files on any page to use the calendar widget:

	<link rel="stylesheet" href="https://ZulNs.github.io/libs/calendar.css"/>
	<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date.js"></script>
	<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar.js"></script>

For the following code examples, please insert them at anywhere you want within the document's body below the above code.

### Embedding the Widget as a Calendar
#### Code example:

	<div id="calendar"><input id="show-button" type="button" onclick="showMe();" value="Show Calendar" /></div>
	<script type="text/javascript">
		var showBtn = document.getElementById('show-button'),
			cal = new Calendar();
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

<p data-height="268" data-theme-id="22373" data-slug-hash="pgMdMY" data-default-tab="result" data-user="zulns" class='codepen'>See the Pen <a href='http://codepen.io/zulns/pen/pgMdMY/'>Embedding  the Widget as a Calendar</a> by ZulNs (<a href='http://codepen.io/zulns'>@zulns</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="http://assets.codepen.io/assets/embed/ei.js"></script>

&nbsp;

### Embedding the Widget as a Datepicker
#### Code example:

	<div id="datepicker"><input id="picked-text" type="text" size="35"/><input id="pick-button" type="button" onclick="pickADate();" value="pick"/></div>
	<script type="text/javascript">
		var pickedTxt = document.getElementById('picked-text'),
			pickBtn = document.getElementById('pick-button'),
			datepicker = new Calendar();
		document.getElementById('datepicker').appendChild(datepicker.getElement());
		datepicker.getElement().style.marginTop = '10px';
		
		datepicker.callback = function() {
			pickedTxt.value = datepicker.getDate().getDateString();
			pickedTxt.selectionStart = 0;
			pickedTxt.selectionEnd = pickedTxt.value.length;
			pickedTxt.focus();
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

<p data-height="268" data-theme-id="22373" data-slug-hash="vLopwV" data-default-tab="result" data-user="zulns" class='codepen'>See the Pen <a href='http://codepen.io/zulns/pen/vLopwV/'>Embedding the Widget as a Datepicker</a> by ZulNs (<a href='http://codepen.io/zulns'>@zulns</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="http://assets.codepen.io/assets/embed/ei.js"></script>

&nbsp;

### Side by Side Gregorian - Hijri Calendar Converter
#### Code example:

	<div id="calendar-converter"></div>
	<script type="text/javascript">
		var cal1 = new Calendar(false, 1, false, true),
			cal2 = new Calendar(true, 0, false, true),
			cal1Mode = cal1.isHijriMode(),
			cal2Mode = cal2.isHijriMode();
		document.getElementById('calendar-converter').appendChild(cal1.getElement());
		document.getElementById('calendar-converter').appendChild(cal2.getElement());
		cal1.setDisplayStyle('inline-block');
		cal2.setDisplayStyle('inline-block');
		cal2.getElement().style.marginLeft = '20px';
		cal1.show();
		cal2.show();
		
		cal1.callback = function() {
			if (cal1Mode !== cal1.isHijriMode()) {
				cal2.disableCallback(true);
				cal2.changeDateMode();
				cal2.disableCallback(false);
				cal1Mode = cal1.isHijriMode();
				cal2Mode = cal2.isHijriMode();
			} // prevent from infinite loop when user change the calendar mode
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
			} // prevent from infinite loop when user change the calendar mode
			else
				cal1.setTime(cal2.getTime());
		};
		
		cal1.onHide = function() {
			cal1.show(); // prevent the widget from being closed
		};
		
		cal2.onHide = function() {
			cal2.show(); // prevent the widget from being closed
		};
	</script>

#### Result:

<p data-height="268" data-theme-id="22373" data-slug-hash="dGxJxK" data-default-tab="result" data-user="zulns" class='codepen'>See the Pen <a href='http://codepen.io/zulns/pen/dGxJxK/'>Side by Side Gregorian - Hijri Calendar Converter</a> by ZulNs (<a href='http://codepen.io/zulns'>@zulns</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="http://assets.codepen.io/assets/embed/ei.js"></script>

&nbsp;

&nbsp;

---
#### Made By ZulNs
##### @Yogyakarta, January 2016
---
