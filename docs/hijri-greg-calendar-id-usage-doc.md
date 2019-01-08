# Indonesian Hijri / Gregorian Calendar

## Requirements
- [hijri-date-id.js](../libs/hijri-date-id.js) which allows the use of [`HijriDate()`](hijri-date-api-doc.md) class
- [calendar-id.js](../libs/calendar-id.js) for generate this calendar
- [calendar-id.css](../libs/calendar-id.css) for styling this calendar

## Getting Started

### Embedding the Calendar into a Web Page
Simply put this code snippet to anywhere you want in the body of your html file:

Offline mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="../libs/calendar-id.css" />
<script type="text/javascript" src="../libs/hijri-date-id.js"></script>
<script type="text/javascript" src="../libs/calendar-id.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

Or online mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="https://ZulNs.github.io/libs/calendar-id.css" />
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date-id.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar-id.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

&nbsp;

&nbsp;

---
#### Made By ZulNs
##### @Gorontalo, 30 April 2017
---
