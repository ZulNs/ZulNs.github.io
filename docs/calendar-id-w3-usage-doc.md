# Indonesian Hijri / Gregorian Calendar using W3CSS

## Requirements
- [hijri-date-id.js](../libs/hijri-date-id.js) which allows the use of [`HijriDate()`](hijri-date-api-doc.md) class
- [calendar-id-w3.js](../libs/calendar-id-w3.js) a library to generate this calendar,
- [w3.css](../libs/w3css/w3.css) for styling

## Getting Started

### Embedding the Calendar into a Web Page
Simply put this code snippet to anywhere you want in the body of your html file:

Offline mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="../libs/w3css/w3.css" />
<script type="text/javascript" src="../libs/hijri-date-id.js"></script>
<script type="text/javascript" src="../libs/calendar-id-w3.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

Or online mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="https://ZulNs.github.io/libs/w3css/w3.css" />
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date-id.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar-id-w3.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

Every time a new load to this calendar, or a pressed to the Refresh menu button
that adjusts to the current time and date, a new color theme is applied at once.
To disable this default behaviour simply add this code:

```javascript
cal.setThemeAutoChanged(false);
```

To reenable:

```javascript
cal.setThemeAutoChanged(true);
```

To set up a desired color theme:

```javascript
cal.setTheme('desired-color');
```

The color themes are consist of:
- amber
- aqua
- cyan
- grey
- khaki
- light-blue
- light-green
- lime
- orange
- pale-blue
- pale-green
- pale-red
- pale-yellow
- sand
- white
- yellow
- black
- blue
- blue-grey
- brown
- dark-grey
- deep-orange
- deep-purple
- green
- indigo
- light-green
- pink
- purple
- red
- teal

For example, to set-up a calendar with deep-orange color theme and auto change theme is disabled:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="https://ZulNs.github.io/libs/w3css/w3.css" />
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date-id.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar-id-w3.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    cal.setTheme('deep-orange');
    cal.setThemeAutoChanged(false);
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

&nbsp;

&nbsp;

---
#### Designed By ZulNs
##### @Gorontalo, 11 January 2019
---
