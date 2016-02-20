# Calendar API
## Public Constructor
`Calendar(isHijriMode, firstDayOfWeek, isAutoHide, isAutoSelectedDate, year, month, date)`
### Arguments:
- **`isHijriMode`**, set calendar mode
  > **`true`** : Hijri Calendar mode
  >
  > **`false`** : Gregorian Calendar mode
  >
  > default : **`false`**
- **`firstDayOfWeek`**, set first day of week
  > **`0`** : Sunday
  >
  > **`1`** : Monday
  >
  > default : **`1`**
- **`isAutoHide`**
  > **`true`** : hide calendar when a date was selected
  >
  > **`false`** : don't hide calendar when a date was selected
  >
  > default : **`true`**
- **`isAutoSelectedDate`**
  > **`true`** : auto select a date when the month or year value was changed
  >
  > **`false`** : don't select a date when the month or year value was changed
  >
  > default : **`false`**
- **`year`**, **`month`**, and **`date`**
  > The third arguments are the same as arguments used in JavaScript standard `Date()` class or custom `HijriDate()` class, except `year` argument using `FullYear` instead.


## Public Methods
- **`changeAutoHide()`**
  > Toggles calendar auto hide on select the date.
- **`changeAutoSelectedDate()`**
  > Toggles auto select a date when the month or year value changed.
- **`changeDateMode()`**
  > Toggles calendar mode from Gregorian to Hijri or vice versa.
- **`changeFirstDayOfWeek()`**
  > Toggles first day of week from Monday to Sunday or vice versa.
- **`destroy()`**
  > Destroys the calendar object and release it from memory.
- **`disableCallback(cb)`**
  > Disable the calling to a function which pointed by `callback` property when `cb = true`, or enable when `cb = false`.
- **`firstDayOfWeek()`**
  > Returns `1` if Sunday as first day of week or `0` for Monday.
- **`getDate()`**
  > Returns the selected date as `Date()` or `HijriDate()` object depend on current calendar mode.
- **`getElement()`**
  > Returns the calendar `div` element.
- **`getTime()`**
  > Returns the long value of time in milliseconds which represents the selected date.
- **`hide()`**
  > Hides the calendar.
- **`isAutoHide()`**
  > Returns `true` if the calendar was in auto hide on select the date, `false` if wasn't.
- **`isAutoSelectedDate()`**
  > Returns `true` if the calendar was in auto select the date when the month or year value was changed, `false` if wasn't.
- **`isHidden()`**
  > Return `true` if the calendar state was hidden, `false` if wasn't.
- **`isHijriMode()`**
  > Returns `true` when the calendar was in Hijri mode or `false` in Gregorian mode.
- **`setAbsolutePosition(pos)`**
  > Sets the CSS property `position: absolute` when `pos = true` or `position: relative` when `pos = false`.
- **`setDate(setYear, setMonth, setDate)`**
  > Sets the calendar selected date to a desired date.
- **`setTime(time)`**
  > Sets the calendar selected date to a desired date using long value of `time` in milliseconds.
- **`show()`**
  > Shows the calendar.


## Public Property
- **`callback`**
  > Assign this property to a function which do some processes when a date was selected.
  >
  > For example:
  >
  >     var cal = new Calendar();
  >     cal.callback = function() {
  >         //do stuff
  >     };