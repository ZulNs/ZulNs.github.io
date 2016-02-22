# Timepicker API Documentation

## Overview
This widget can be used to display a **Realtime Analog Clock** besides as a **Timepicker**. As an timepicker, this widget can be directly draggable at both *hour hand* and *minute hand*. Drag at behind the axis of both hand which causes reverse rotation also supported. Dragging with touch devices is supported well. Toggling between 12 hours and 24 hours system can be done on the fly.

## Download
- [timepicker.js](https://ZulNs.github.io/libs/timepicker.js)

## Requirements
- [timepicker.css](https://ZulNs.github.io/libs/timepicker.css) for styling this widget

## Public Constructor
**`Timepicker(isClockMode, is24HoursSystem, hours, minutes, seconds)`**

### Arguments:
- **`isClockMode`**, sets the widget mode

  **`true`** : realtime analog clock mode

  **`false`** : timepicker mode

  Default : **`false`**

- **`is24HoursSystem`**

  **`true`** : 24 hours system will be used

  **`false`** : 12 hours system will be used

  Default : **`false`**

- **`hours`**, **`minutes`**, and **`seconds`**

  Initial time in 24 hours system format which is the clock's hands pointed at. When those are omitted, the current time will be used.

## Public Methods
- **`changeClockMode()`**

  Toggles the widget mode between a realtime analog clock and a timepicker. 

- **`changeHourSystem()`**

  Toggles the hour system which will be used, 24 hours or 12 hours system.

- **`destroy()`**

  Destroys the widget object and releases it from memory.

- **`getElement()`**

  Returns the widget div element.

- **`getHours()`**

  Returns the selected hours.

- **`getMinutes()`**

  Returns the selected minutes.

- **`getTimeString()`**

  Returns the string of the selected time, it may trailing with `"AM"` or `"PM"` if 12 hours system was used.

- **`hide()`**

  Hides the widget.

- **`is24HoursSystem()`**

  Returns `true` if 24 hours system was used or `false` for 12 hours system.

- **`isClockMode()`**

  Returns `true` if the current widget is a realtime analog clock or `false` for timepicker.

- **`isHidden()`**

  Returns `true` when the current widget was hidden or `false` if wasn't.

- **`setHours(hours)`**

  Sets the timepicker initial hours in the 24 hours system format.

- **`setMinutes(minutes)`**

  Sets the timepicker initial minutes.

- **`setSeconds(seconds)`**

  Sets the timepicker initial seconds.

## Public Property
- **`callback`**

  Assign this property to a function that do some processes when a time was selected or when the widget was closed.

  For example:

      var widget = new Timepicker();
      widget.callback = function() {
          // do stuff
      };

## Getting Started

### Using the Timepicker Widget on a Web Page
Generally, you'll need to include these both files on any page to use the widget:

	<link rel="stylesheet" href="https://ZulNs.github.io/libs/timepicker.css"/>
	<script type="text/javascript" src="https://ZulNs.github.io/libs/timepicker.js"></script>

For the following code examples, please insert them at anywhere you want within the document's body.

### Using the Widget as a Realtime Analog Clock
#### Code example:

	<div id="clock"></div>
	<script type="text/javascript">
		var clock = new Timepicker(true);
		document.getElementById('clock').appendChild(clock.getElement());
		clock.show();
		
		clock.callback = function() {
			clock.show();
		};
	</script>

#### Result:
To see the result you need the [HTML version](https://ZulNs.github.io/libs/timepicker-api-doc.html) of this documentation.

### Using the Widget as a Timepicker
#### Code example:

	<div id="timepicker"><input id="picked-text" type="text" size="32"/><input id="pick-button" type="button" onclick="pickATime();" value="pick"/></div>
	<script type="text/javascript">
		var pickedTxt = document.getElementById('picked-text');
		var pickBtn = document.getElementById('pick-button');
		var timepicker = new Timepicker();
		var timepickerElm = timepicker.getElement();
		document.getElementById('timepicker').appendChild(timepickerElm);
		timepickerElm.style.marginTop = '10px';
		
		timepicker.callback = function() {
			pickedTxt.value = timepicker.getTimeString();
			pickBtn.style.display = 'inline-block';
		};
		
		function pickATime() {
			pickBtn.style.display = 'none';
			timepicker.show();
		}
	</script>

#### Result:
To see the result you need the [HTML version](https://ZulNs.github.io/libs/timepicker-api-doc.html) of this documentation.

---
#### Made By ZulNs
##### @Yogyakarta, February 2016
---
