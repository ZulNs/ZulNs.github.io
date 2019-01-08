# Gorontalo Season Calendar

## Requirements
- [hijri-date-id.js](../libs/hijri-date-id.js) which allows the use of [`HijriDate()`](hijri-date-api-doc.md) class
- [seasons-calendar-gto.js](../libs/seasons-calendar-gto.js) for generate this calendar
- [seasons-calendar-gto.css](../libs/seasons-calendar-gto.css) for styling this calendar

## Getting Started

### Embedding the Calendar into a Web Page
Simply put this code snippet to anywhere you want in the body of your html file:

Offline mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="../libs/seasons-calendar-gto.css"/>
<script type="text/javascript" src="../libs/hijri-date-id.js"></script>
<script type="text/javascript" src="../libs/seasons-calendar-gto.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

Or online mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="https://ZulNs.github.io/libs/seasons-calendar-gto.css"/>
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date-id.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/seasons-calendar-gto.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

&nbsp;

&nbsp;

---
#### Made By ZulNs
##### @Gorontalo, 30 August 2017
---
