# Indonesian Hijri / Gregorian Calendar using W3CSS

## Requirements
- [hijri-date-id.js](../libs/hijri-date-id.js) which allows the use of [`HijriDate()`](hijri-date-api-doc.md) class
- [calendar-id-w3.js](../libs/calendar-id-w3.js) for generate this calendar,
  for styling you need these following CSS files:
- [w3.css](../libs/w3css/w3.css)
- [w3-theme-amber](../libs/w3css/w3-theme-amber.css)
- [w3-theme-black](../libs/w3css/w3-theme-black.css)
- [w3-theme-blue](../libs/w3css/w3-theme-blue.css)
- [w3-theme-blue-grey](../libs/w3css/w3-theme-blue-grey.css)
- [w3-theme-brown](../libs/w3css/w3-theme-brown.css)
- [w3-theme-cyan](../libs/w3css/w3-theme-cyan.css)
- [w3-theme-dark-grey](../libs/w3css/w3-theme-dark-grey.css)
- [w3-theme-deep-orange](../libs/w3css/w3-theme-deep-orange.css)
- [w3-theme-deep-purple](../libs/w3css/w3-theme-deep-purple.css)
- [w3-theme-green](../libs/w3css/w3-theme-green.css)
- [w3-theme-grey](../libs/w3css/w3-theme-grey.css)
- [w3-theme-indigo](../libs/w3css/w3-theme-indigo.css)
- [w3-theme-khaki](../libs/w3css/w3-theme-khaki.css)
- [w3-theme-light-blue](../libs/w3css/w3-theme-light-blue.css)
- [w3-theme-light-green](../libs/w3css/w3-theme-light-green.css)
- [w3-theme-lime](../libs/w3css/w3-theme-lime.css)
- [w3-theme-orange](../libs/w3css/w3-theme-orange.css)
- [w3-theme-pink](../libs/w3css/w3-theme-pink.css)
- [w3-theme-purple](../libs/w3css/w3-theme-purple.css)
- [w3-theme-red](../libs/w3css/w3-theme-red.css)
- [w3-theme-teal](../libs/w3css/w3-theme-teal.css)
- [w3-theme-w3schools](../libs/w3css/w3-theme-w3schools.css)
- [w3-theme-yellow](../libs/w3css/w3-theme-yellow.css)

## Getting Started

### Embedding the Calendar into a Web Page
Simply put this code snippet to anywhere you want in the body of your html file:

Offline mode:

```html
<div id="calendar-container"></div>
<link rel="stylesheet" href="../libs/w3css/w3.css" />
<link rel="stylesheet" href="../libs/w3css/w3-theme-indigo.css" id="currentTheme" />
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
<link rel="stylesheet" href="https://ZulNs.github.io/libs/w3css/w3-theme-indigo.css" id="currentTheme" />
<script type="text/javascript" src="https://ZulNs.github.io/libs/hijri-date-id.js"></script>
<script type="text/javascript" src="https://ZulNs.github.io/libs/calendar-id-w3.js"></script>
<script type="text/javascript">
    var cal = new Calendar();
    document.getElementById('calendar-container').appendChild(cal.getElement());
</script>
```

&nbsp;

&nbsp;

---
#### Designed By ZulNs
##### @Gorontalo, 6 January 2019
---
