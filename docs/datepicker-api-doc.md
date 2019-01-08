# Datepicker API Documentation

## Overview
This datepicker widget can be used to display **Gregorian** or **Hijri** date, and of course as the converter between the two calendar system, it can also be used as datepicker for both systems. It's full customizable for above both calendar system interchange, first day of week (**Monday** or **Sunday**), auto hide datepicker on select a date, auto select the date when **month** or **year** value was changed. This customization can be applied on the fly (at run time) also of course in the way programmatically (at design time). This widget has a *month bar* which has a drop down list to select the desired month between 12 available month names for the concerned calendar system. There are two buttons associated with the sequence of the month which serve to lower and raise its sequence by one step. This widget also has a *year bar* which its value can be directly edited. Similar to the *month bar*, the *year bar* also has two buttons associated with its value which serve to decrement and increment that value by one. Only difference that *year bar* has another extra four buttons which change the year value respectively decrement by 100, decrement by 10, increment by 10, and increment by 100. Those extra buttons can be displayed or hidden on the fly at will of the user.

## Download
- [datepicker.js](../libs/datepicker.js)

## Requirements
- [hijri-date.js](../../Hijri-Date-Function/libs/hijri-date.js) which allows the use of [`HijriDate()`](../../Hijri-Date-Function/docs/hijri-date-api-doc.md) class
- [datepicker.css](../libs/datepicker.css) for styling this widget

## Public Constructor
**`Datepicker(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate, year, month, date)`**

### Arguments:
- **`isHijriMode`**, sets the datepicker calendar mode

  **`true`** : Hijri calendar mode

  **`false`** : Gregorian calendar mode

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

  Returns `true` when the datepicker was in Hijri calendar mode or `false` for Gregorian calendar mode.

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

  ```javascript
  var datepicker = new Datepicker();
  datepicker.callback = function() {
      // do stuff
  };
  ```

- **`onHide`**

  Assign this property to a function that do some processes when the datepicker was hidden/closed.

  For example, this destroys the widget when it was closed:

  ```javascript
  var datepicker = new Datepicker();
  datepicker.onHide = function() {
      datepicker.destroy();
  };
  ```

## Getting Started

### Embedding the Datepicker Widget on a Web Page
Generally, you'll need to include these three files on any page to use the datepicker widget:

Offline mode:

```html
<link rel="stylesheet" href="../libs/datepicker.css" />
<script type="text/javascript" src="../libs/hijri-date.js"></script>
<script type="text/javascript" src="../libs/datepicker.js"></script>
```

Or online mode:

```html
<link rel="stylesheet" href="https://ZulNs.github.io/libs/datepicker.css" />
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/datepicker.js"></script>
```

For the following code examples, please insert them at anywhere you want within the document's body below the above code.

### Embedding the Widget as a Calendar
#### Code example:

```html
<input id="show-button" type="button" onclick="showMe();" value="Show Calendar" />
<div id="calendar"></div>
<script type="text/javascript">
    var showBtn = document.getElementById('show-button'),
        calendar = new Datepicker();
    document.getElementById('calendar').appendChild(calendar.getElement());
    showMe();

    calendar.onHide = function() {
        showBtn.style.display = 'block'
    };

    function showMe() {
        showBtn.style.display = 'none';
        calendar.show();
    }
</script>
```

#### Result:

See result at [CodePen](https://codepen.io/zulns/full/pgMdMY)

&nbsp;

### Embedding the Widget as a Datepicker
#### Code example:

```html
<input id="picked-text" type="text" style="width: 274px;" />
<input id="pick-button" type="button" onclick="pickADate();" value="pick" />
<div id="datepicker"></div>
<script type="text/javascript">
    var pickedTxt = document.getElementById('picked-text'),
        pickBtn = document.getElementById('pick-button'),
        datepicker = new Datepicker();
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
```

#### Result:

See result at [CodePen](https://codepen.io/zulns/full/vLopwV)

&nbsp;

### Side by Side Gregorian - Hijri Calendar Converter
#### Code example:

```html
<div id="calendar-converter"></div>
<script type="text/javascript">
    var cal1 = new Datepicker(false, 1, false, true),
        cal2 = new Datepicker(true, 0, false, true),
        cal1Mode = cal1.isHijriMode(),
        cal2Mode = cal2.isHijriMode();
    document.getElementById('calendar-converter').appendChild(cal1.getElement());
    document.getElementById('calendar-converter').appendChild(cal2.getElement());
    cal1.setDisplayStyle('inline-block');
    cal2.setDisplayStyle('inline-block');
    cal2.getElement().style.marginLeft = '20px';
    cal1.getElement().style.verticalAlign = 'top';
    cal2.getElement().style.verticalAlign = 'top';
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
```

#### Result:

See result at [CodePen](https://codepen.io/zulns/full/dGxJxK)

&nbsp;

&nbsp;

---
#### Made By ZulNs
##### @Yogyakarta, January 2016
---
