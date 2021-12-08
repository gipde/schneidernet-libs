;(function (g, f) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? f(exports, require('os'), require('tty'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'os', 'tty'], f)
    : ((g = typeof globalThis !== 'undefined' ? globalThis : g || self),
      f((g.tools = {}), g.require$$0, g.require$$1))
})(this, function (exports, require$$0, require$$1) {
  'use strict'
  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e }
  }
  var require$$0__default = /*#__PURE__*/ _interopDefaultLegacy(require$$0)
  var require$$1__default = /*#__PURE__*/ _interopDefaultLegacy(require$$1)
  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN
    }

    var number = Number(dirtyNumber)

    if (isNaN(number)) {
      return number
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number)
  }
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(
        required +
          ' argument' +
          (required > 1 ? 's' : '') +
          ' required, but only ' +
          args.length +
          ' present',
      )
    }
  }
  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */

  function toDate(argument) {
    requiredArgs(1, arguments)
    var argStr = Object.prototype.toString.call(argument) // Clone the date

    if (
      argument instanceof Date ||
      (typeof argument === 'object' && argStr === '[object Date]')
    ) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime())
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument)
    } else {
      if (
        (typeof argument === 'string' || argStr === '[object String]') &&
        typeof console !== 'undefined'
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule",
        ) // eslint-disable-next-line no-console

        console.warn(new Error().stack)
      }

      return new Date(NaN)
    }
  }
  /**
   * @name addMilliseconds
   * @category Millisecond Helpers
   * @summary Add the specified number of milliseconds to the given date.
   *
   * @description
   * Add the specified number of milliseconds to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the milliseconds added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
   * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:30.750
   */

  function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments)
    var timestamp = toDate(dirtyDate).getTime()
    var amount = toInteger(dirtyAmount)
    return new Date(timestamp + amount)
  }
  /**
   * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
   * They usually appear for dates that denote time before the timezones were introduced
   * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
   * and GMT+01:00:00 after that date)
   *
   * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
   * which would lead to incorrect calculations.
   *
   * This function returns the timezone offset in milliseconds that takes seconds in account.
   */
  function getTimezoneOffsetInMilliseconds(date) {
    var utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ),
    )
    utcDate.setUTCFullYear(date.getFullYear())
    return date.getTime() - utcDate.getTime()
  }
  /**
   * @name startOfDay
   * @category Day Helpers
   * @summary Return the start of a day for the given date.
   *
   * @description
   * Return the start of a day for the given date.
   * The result will be in the local timezone.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the original date
   * @returns {Date} the start of a day
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // The start of a day for 2 September 2014 11:55:00:
   * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 00:00:00
   */

  function startOfDay(dirtyDate) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    date.setHours(0, 0, 0, 0)
    return date
  }
  var MILLISECONDS_IN_DAY$1 = 86400000
  /**
   * @name differenceInCalendarDays
   * @category Day Helpers
   * @summary Get the number of calendar days between the given dates.
   *
   * @description
   * Get the number of calendar days between the given dates. This means that the times are removed
   * from the dates and then the difference in days is calculated.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar days
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many calendar days are between
   * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
   * const result = differenceInCalendarDays(
   *   new Date(2012, 6, 2, 0, 0),
   *   new Date(2011, 6, 2, 23, 0)
   * )
   * //=> 366
   * // How many calendar days are between
   * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
   * const result = differenceInCalendarDays(
   *   new Date(2011, 6, 3, 0, 1),
   *   new Date(2011, 6, 2, 23, 59)
   * )
   * //=> 1
   */

  function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments)
    var startOfDayLeft = startOfDay(dirtyDateLeft)
    var startOfDayRight = startOfDay(dirtyDateRight)
    var timestampLeft =
      startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft)
    var timestampRight =
      startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight) // Round the number of days to the nearest integer
    // because the number of milliseconds in a day is not constant
    // (e.g. it's different in the day of the daylight saving time clock shift)

    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY$1)
  }
  /**
   * @name isDate
   * @category Common Helpers
   * @summary Is the given value a date?
   *
   * @description
   * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {*} value - the value to check
   * @returns {boolean} true if the given value is a date
   * @throws {TypeError} 1 arguments required
   *
   * @example
   * // For a valid date:
   * const result = isDate(new Date())
   * //=> true
   *
   * @example
   * // For an invalid date:
   * const result = isDate(new Date(NaN))
   * //=> true
   *
   * @example
   * // For some value:
   * const result = isDate('2014-02-31')
   * //=> false
   *
   * @example
   * // For an object:
   * const result = isDate({})
   * //=> false
   */

  function isDate(value) {
    requiredArgs(1, arguments)
    return (
      value instanceof Date ||
      (typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Date]')
    )
  }
  /**
   * @name isValid
   * @category Common Helpers
   * @summary Is the given date valid?
   *
   * @description
   * Returns false if argument is Invalid Date and true otherwise.
   * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
   * Invalid Date is a Date, whose time value is NaN.
   *
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - Now `isValid` doesn't throw an exception
   *   if the first argument is not an instance of Date.
   *   Instead, argument is converted beforehand using `toDate`.
   *
   *   Examples:
   *
   *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
   *   |---------------------------|---------------|---------------|
   *   | `new Date()`              | `true`        | `true`        |
   *   | `new Date('2016-01-01')`  | `true`        | `true`        |
   *   | `new Date('')`            | `false`       | `false`       |
   *   | `new Date(1488370835081)` | `true`        | `true`        |
   *   | `new Date(NaN)`           | `false`       | `false`       |
   *   | `'2016-01-01'`            | `TypeError`   | `false`       |
   *   | `''`                      | `TypeError`   | `false`       |
   *   | `1488370835081`           | `TypeError`   | `true`        |
   *   | `NaN`                     | `TypeError`   | `false`       |
   *
   *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
   *   that try to coerce arguments to the expected type
   *   (which is also the case with other *date-fns* functions).
   *
   * @param {*} date - the date to check
   * @returns {Boolean} the date is valid
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // For the valid date:
   * const result = isValid(new Date(2014, 1, 31))
   * //=> true
   *
   * @example
   * // For the value, convertable into a date:
   * const result = isValid(1393804800000)
   * //=> true
   *
   * @example
   * // For the invalid date:
   * const result = isValid(new Date(''))
   * //=> false
   */

  function isValid(dirtyDate) {
    requiredArgs(1, arguments)

    if (!isDate(dirtyDate) && typeof dirtyDate !== 'number') {
      return false
    }

    var date = toDate(dirtyDate)
    return !isNaN(Number(date))
  } // for accurate equality comparisons of UTC timestamps that end up
  // having the same representation in local time, e.g. one hour before
  // DST ends vs. the instant that DST ends.

  function compareLocalAsc(dateLeft, dateRight) {
    var diff =
      dateLeft.getFullYear() - dateRight.getFullYear() ||
      dateLeft.getMonth() - dateRight.getMonth() ||
      dateLeft.getDate() - dateRight.getDate() ||
      dateLeft.getHours() - dateRight.getHours() ||
      dateLeft.getMinutes() - dateRight.getMinutes() ||
      dateLeft.getSeconds() - dateRight.getSeconds() ||
      dateLeft.getMilliseconds() - dateRight.getMilliseconds()

    if (diff < 0) {
      return -1
    } else if (diff > 0) {
      return 1 // Return 0 if diff is 0; return NaN if diff is NaN
    } else {
      return diff
    }
  }
  /**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.floor(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full days according to the local timezone
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
//=> 92
 */

  function differenceInDays(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments)
    var dateLeft = toDate(dirtyDateLeft)
    var dateRight = toDate(dirtyDateRight)
    var sign = compareLocalAsc(dateLeft, dateRight)
    var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight))
    dateLeft.setDate(dateLeft.getDate() - sign * difference) // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
    // If so, result must be decreased by 1 in absolute value

    var isLastDayNotFull = Number(compareLocalAsc(dateLeft, dateRight) === -sign)
    var result = sign * (difference - isLastDayNotFull) // Prevent negative zero

    return result === 0 ? 0 : result
  }
  var formatDistanceLocale$1 = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds',
    },
    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds',
    },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes',
    },
    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes',
    },
    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours',
    },
    xHours: {
      one: '1 hour',
      other: '{{count}} hours',
    },
    xDays: {
      one: '1 day',
      other: '{{count}} days',
    },
    aboutXWeeks: {
      one: 'about 1 week',
      other: 'about {{count}} weeks',
    },
    xWeeks: {
      one: '1 week',
      other: '{{count}} weeks',
    },
    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months',
    },
    xMonths: {
      one: '1 month',
      other: '{{count}} months',
    },
    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years',
    },
    xYears: {
      one: '1 year',
      other: '{{count}} years',
    },
    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years',
    },
    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years',
    },
  }

  var formatDistance$2 = function (token, count, options) {
    var result
    var tokenValue = formatDistanceLocale$1[token]

    if (typeof tokenValue === 'string') {
      result = tokenValue
    } else if (count === 1) {
      result = tokenValue.one
    } else {
      result = tokenValue.other.replace('{{count}}', count.toString())
    }

    if (options !== null && options !== void 0 && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return 'in ' + result
      } else {
        return result + ' ago'
      }
    }

    return result
  }

  var formatDistance$3 = formatDistance$2
  function buildFormatLongFn(args) {
    return function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
      // TODO: Remove String()
      var width = options.width ? String(options.width) : args.defaultWidth
      var format = args.formats[width] || args.formats[args.defaultWidth]
      return format
    }
  }
  var dateFormats$1 = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy',
  }
  var timeFormats$1 = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a',
  }
  var dateTimeFormats$1 = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}',
  }
  var formatLong$2 = {
    date: buildFormatLongFn({
      formats: dateFormats$1,
      defaultWidth: 'full',
    }),
    time: buildFormatLongFn({
      formats: timeFormats$1,
      defaultWidth: 'full',
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats$1,
      defaultWidth: 'full',
    }),
  }
  var formatLong$3 = formatLong$2
  var formatRelativeLocale$1 = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P',
  }

  var formatRelative$2 = function (token, _date, _baseDate, _options) {
    return formatRelativeLocale$1[token]
  }

  var formatRelative$3 = formatRelative$2
  function buildLocalizeFn(args) {
    return function (dirtyIndex, dirtyOptions) {
      var options = dirtyOptions || {}
      var context = options.context ? String(options.context) : 'standalone'
      var valuesArray

      if (context === 'formatting' && args.formattingValues) {
        var defaultWidth = args.defaultFormattingWidth || args.defaultWidth
        var width = options.width ? String(options.width) : defaultWidth
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth]
      } else {
        var _defaultWidth = args.defaultWidth

        var _width = options.width ? String(options.width) : args.defaultWidth

        valuesArray = args.values[_width] || args.values[_defaultWidth]
      }

      var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!

      return valuesArray[index]
    }
  }
  var eraValues$1 = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini'],
  }
  var quarterValues$1 = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  } // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.

  var monthValues$1 = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    wide: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }
  var dayValues$1 = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  }
  var dayPeriodValues$1 = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
  }
  var formattingDayPeriodValues$1 = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
  }

  var ordinalNumber$1 = function (dirtyNumber, _options) {
    var number = Number(dirtyNumber) // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`.
    //
    // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'.

    var rem100 = number % 100

    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st'

        case 2:
          return number + 'nd'

        case 3:
          return number + 'rd'
      }
    }

    return number + 'th'
  }

  var localize$2 = {
    ordinalNumber: ordinalNumber$1,
    era: buildLocalizeFn({
      values: eraValues$1,
      defaultWidth: 'wide',
    }),
    quarter: buildLocalizeFn({
      values: quarterValues$1,
      defaultWidth: 'wide',
      argumentCallback: function (quarter) {
        return quarter - 1
      },
    }),
    month: buildLocalizeFn({
      values: monthValues$1,
      defaultWidth: 'wide',
    }),
    day: buildLocalizeFn({
      values: dayValues$1,
      defaultWidth: 'wide',
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues$1,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues$1,
      defaultFormattingWidth: 'wide',
    }),
  }
  var localize$3 = localize$2
  function buildMatchFn(args) {
    return function (string) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      var width = options.width
      var matchPattern =
        (width && args.matchPatterns[width]) || args.matchPatterns[args.defaultMatchWidth]
      var matchResult = string.match(matchPattern)

      if (!matchResult) {
        return null
      }

      var matchedString = matchResult[0]
      var parsePatterns =
        (width && args.parsePatterns[width]) || args.parsePatterns[args.defaultParseWidth]
      var key = Array.isArray(parsePatterns)
        ? findIndex(parsePatterns, function (pattern) {
            return pattern.test(matchedString)
          })
        : findKey(parsePatterns, function (pattern) {
            return pattern.test(matchedString)
          })
      var value
      value = args.valueCallback ? args.valueCallback(key) : key
      value = options.valueCallback ? options.valueCallback(value) : value
      var rest = string.slice(matchedString.length)
      return {
        value: value,
        rest: rest,
      }
    }
  }

  function findKey(object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key
      }
    }

    return undefined
  }

  function findIndex(array, predicate) {
    for (var key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key
      }
    }

    return undefined
  }
  function buildMatchPatternFn(args) {
    return function (string) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
      var matchResult = string.match(args.matchPattern)
      if (!matchResult) return null
      var matchedString = matchResult[0]
      var parseResult = string.match(args.parsePattern)
      if (!parseResult) return null
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0]
      value = options.valueCallback ? options.valueCallback(value) : value
      var rest = string.slice(matchedString.length)
      return {
        value: value,
        rest: rest,
      }
    }
  }
  var matchOrdinalNumberPattern$1 = /^(\d+)(th|st|nd|rd)?/i
  var parseOrdinalNumberPattern$1 = /\d+/i
  var matchEraPatterns$1 = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  }
  var parseEraPatterns$1 = {
    any: [/^b/i, /^(a|c)/i],
  }
  var matchQuarterPatterns$1 = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  }
  var parseQuarterPatterns$1 = {
    any: [/1/i, /2/i, /3/i, /4/i],
  }
  var matchMonthPatterns$1 = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  }
  var parseMonthPatterns$1 = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  }
  var matchDayPatterns$1 = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  }
  var parseDayPatterns$1 = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  }
  var matchDayPeriodPatterns$1 = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  }
  var parseDayPeriodPatterns$1 = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  }
  var match$2 = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern$1,
      parsePattern: parseOrdinalNumberPattern$1,
      valueCallback: function (value) {
        return parseInt(value, 10)
      },
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns$1,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns$1,
      defaultParseWidth: 'any',
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns$1,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns$1,
      defaultParseWidth: 'any',
      valueCallback: function (index) {
        return index + 1
      },
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns$1,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns$1,
      defaultParseWidth: 'any',
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns$1,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns$1,
      defaultParseWidth: 'any',
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns$1,
      defaultMatchWidth: 'any',
      parsePatterns: parseDayPeriodPatterns$1,
      defaultParseWidth: 'any',
    }),
  }
  var match$3 = match$2
  /**
   * @type {Locale}
   * @category Locales
   * @summary English locale (United States).
   * @language English
   * @iso-639-2 eng
   * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
   * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
   */ var locale$1 = {
    code: 'en-US',
    formatDistance: formatDistance$3,
    formatLong: formatLong$3,
    formatRelative: formatRelative$3,
    localize: localize$3,
    match: match$3,
    options: {
      weekStartsOn: 0,
      /* Sunday */
      firstWeekContainsDate: 1,
    },
  }
  var defaultLocale = locale$1
  /**
   * @name subMilliseconds
   * @category Millisecond Helpers
   * @summary Subtract the specified number of milliseconds from the given date.
   *
   * @description
   * Subtract the specified number of milliseconds from the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the milliseconds subtracted
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
   * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:29.250
   */

  function subMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments)
    var amount = toInteger(dirtyAmount)
    return addMilliseconds(dirtyDate, -amount)
  }
  function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? '-' : ''
    var output = Math.abs(number).toString()

    while (output.length < targetLength) {
      output = '0' + output
    }

    return sign + output
  }
  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* |                                |
   * |  d  | Day of month                   |  D  |                                |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  m  | Minute                         |  M  | Month                          |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  y  | Year (abs)                     |  Y  |                                |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   */

  var formatters$2 = {
    // Year
    y: function (date, token) {
      // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
      // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
      // |----------|-------|----|-------|-------|-------|
      // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
      // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
      // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
      // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
      // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
      var signedYear = date.getUTCFullYear() // Returns 1 for 1 BC (which is year 0 in JavaScript)

      var year = signedYear > 0 ? signedYear : 1 - signedYear
      return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length)
    },
    // Month
    M: function (date, token) {
      var month = date.getUTCMonth()
      return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2)
    },
    // Day of the month
    d: function (date, token) {
      return addLeadingZeros(date.getUTCDate(), token.length)
    },
    // AM or PM
    a: function (date, token) {
      var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am'

      switch (token) {
        case 'a':
        case 'aa':
          return dayPeriodEnumValue.toUpperCase()

        case 'aaa':
          return dayPeriodEnumValue

        case 'aaaaa':
          return dayPeriodEnumValue[0]

        case 'aaaa':
        default:
          return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.'
      }
    },
    // Hour [1-12]
    h: function (date, token) {
      return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length)
    },
    // Hour [0-23]
    H: function (date, token) {
      return addLeadingZeros(date.getUTCHours(), token.length)
    },
    // Minute
    m: function (date, token) {
      return addLeadingZeros(date.getUTCMinutes(), token.length)
    },
    // Second
    s: function (date, token) {
      return addLeadingZeros(date.getUTCSeconds(), token.length)
    },
    // Fraction of second
    S: function (date, token) {
      var numberOfDigits = token.length
      var milliseconds = date.getUTCMilliseconds()
      var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3))
      return addLeadingZeros(fractionalSeconds, token.length)
    },
  }
  var formatters$3 = formatters$2
  var MILLISECONDS_IN_DAY = 86400000 // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376

  function getUTCDayOfYear(dirtyDate) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    var timestamp = date.getTime()
    date.setUTCMonth(0, 1)
    date.setUTCHours(0, 0, 0, 0)
    var startOfYearTimestamp = date.getTime()
    var difference = timestamp - startOfYearTimestamp
    return Math.floor(difference / MILLISECONDS_IN_DAY) + 1
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function startOfUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments)
    var weekStartsOn = 1
    var date = toDate(dirtyDate)
    var day = date.getUTCDay()
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    date.setUTCDate(date.getUTCDate() - diff)
    date.setUTCHours(0, 0, 0, 0)
    return date
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function getUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    var year = date.getUTCFullYear()
    var fourthOfJanuaryOfNextYear = new Date(0)
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4)
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0)
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear)
    var fourthOfJanuaryOfThisYear = new Date(0)
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4)
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0)
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear)

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function startOfUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments)
    var year = getUTCISOWeekYear(dirtyDate)
    var fourthOfJanuary = new Date(0)
    fourthOfJanuary.setUTCFullYear(year, 0, 4)
    fourthOfJanuary.setUTCHours(0, 0, 0, 0)
    var date = startOfUTCISOWeek(fourthOfJanuary)
    return date
  }
  var MILLISECONDS_IN_WEEK$1 = 604800000 // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376

  function getUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime() // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)

    return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function startOfUTCWeek(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments)
    var options = dirtyOptions || {}
    var locale = options.locale
    var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn)
    var weekStartsOn =
      options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn) // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    var date = toDate(dirtyDate)
    var day = date.getUTCDay()
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    date.setUTCDate(date.getUTCDate() - diff)
    date.setUTCHours(0, 0, 0, 0)
    return date
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function getUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    var year = date.getUTCFullYear()
    var options = dirtyOptions || {}
    var locale = options.locale
    var localeFirstWeekContainsDate =
      locale && locale.options && locale.options.firstWeekContainsDate
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate)
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate) // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively')
    }

    var firstWeekOfNextYear = new Date(0)
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate)
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0)
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions)
    var firstWeekOfThisYear = new Date(0)
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate)
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0)
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions)

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  } // See issue: https://github.com/date-fns/date-fns/issues/376

  function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments)
    var options = dirtyOptions || {}
    var locale = options.locale
    var localeFirstWeekContainsDate =
      locale && locale.options && locale.options.firstWeekContainsDate
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate)
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate)
    var year = getUTCWeekYear(dirtyDate, dirtyOptions)
    var firstWeek = new Date(0)
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate)
    firstWeek.setUTCHours(0, 0, 0, 0)
    var date = startOfUTCWeek(firstWeek, dirtyOptions)
    return date
  }
  var MILLISECONDS_IN_WEEK = 604800000 // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376

  function getUTCWeek(dirtyDate, options) {
    requiredArgs(1, arguments)
    var date = toDate(dirtyDate)
    var diff =
      startOfUTCWeek(date, options).getTime() -
      startOfUTCWeekYear(date, options).getTime() // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)

    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
  }
  var dayPeriodEnum = {
    am: 'am',
    pm: 'pm',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night',
  }
  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
   * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
   * |  d  | Day of month                   |  D  | Day of year                    |
   * |  e  | Local day of week              |  E  | Day of week                    |
   * |  f  |                                |  F* | Day of week in month           |
   * |  g* | Modified Julian day            |  G  | Era                            |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  i! | ISO day of week                |  I! | ISO week of year               |
   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
   * |  m  | Minute                         |  M  | Month                          |
   * |  n  |                                |  N  |                                |
   * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
   * |  p! | Long localized time            |  P! | Long localized date            |
   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
   * |  u  | Extended year                  |  U* | Cyclic year                    |
   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
   * |  w  | Local week of year             |  W* | Week of month                  |
   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
   * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   *
   * Letters marked by ! are non-standard, but implemented by date-fns:
   * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
   *   i.e. 7 for Sunday, 1 for Monday, etc.
   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
   *   `R` is supposed to be used in conjunction with `I` and `i`
   *   for universal ISO week-numbering date, whereas
   *   `Y` is supposed to be used in conjunction with `w` and `e`
   *   for week-numbering date specific to the locale.
   * - `P` is long localized date format
   * - `p` is long localized time format
   */

  var formatters = {
    // Era
    G: function (date, token, localize) {
      var era = date.getUTCFullYear() > 0 ? 1 : 0

      switch (token) {
        // AD, BC
        case 'G':
        case 'GG':
        case 'GGG':
          return localize.era(era, {
            width: 'abbreviated',
          })
        // A, B

        case 'GGGGG':
          return localize.era(era, {
            width: 'narrow',
          })
        // Anno Domini, Before Christ

        case 'GGGG':
        default:
          return localize.era(era, {
            width: 'wide',
          })
      }
    },
    // Year
    y: function (date, token, localize) {
      // Ordinal number
      if (token === 'yo') {
        var signedYear = date.getUTCFullYear() // Returns 1 for 1 BC (which is year 0 in JavaScript)

        var year = signedYear > 0 ? signedYear : 1 - signedYear
        return localize.ordinalNumber(year, {
          unit: 'year',
        })
      }

      return formatters$3.y(date, token)
    },
    // Local week-numbering year
    Y: function (date, token, localize, options) {
      var signedWeekYear = getUTCWeekYear(date, options) // Returns 1 for 1 BC (which is year 0 in JavaScript)

      var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear // Two digit year

      if (token === 'YY') {
        var twoDigitYear = weekYear % 100
        return addLeadingZeros(twoDigitYear, 2)
      } // Ordinal number

      if (token === 'Yo') {
        return localize.ordinalNumber(weekYear, {
          unit: 'year',
        })
      } // Padding

      return addLeadingZeros(weekYear, token.length)
    },
    // ISO week-numbering year
    R: function (date, token) {
      var isoWeekYear = getUTCISOWeekYear(date) // Padding

      return addLeadingZeros(isoWeekYear, token.length)
    },
    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function (date, token) {
      var year = date.getUTCFullYear()
      return addLeadingZeros(year, token.length)
    },
    // Quarter
    Q: function (date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3)

      switch (token) {
        // 1, 2, 3, 4
        case 'Q':
          return String(quarter)
        // 01, 02, 03, 04

        case 'QQ':
          return addLeadingZeros(quarter, 2)
        // 1st, 2nd, 3rd, 4th

        case 'Qo':
          return localize.ordinalNumber(quarter, {
            unit: 'quarter',
          })
        // Q1, Q2, Q3, Q4

        case 'QQQ':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'formatting',
          })
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)

        case 'QQQQQ':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'formatting',
          })
        // 1st quarter, 2nd quarter, ...

        case 'QQQQ':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone quarter
    q: function (date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3)

      switch (token) {
        // 1, 2, 3, 4
        case 'q':
          return String(quarter)
        // 01, 02, 03, 04

        case 'qq':
          return addLeadingZeros(quarter, 2)
        // 1st, 2nd, 3rd, 4th

        case 'qo':
          return localize.ordinalNumber(quarter, {
            unit: 'quarter',
          })
        // Q1, Q2, Q3, Q4

        case 'qqq':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'standalone',
          })
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)

        case 'qqqqq':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'standalone',
          })
        // 1st quarter, 2nd quarter, ...

        case 'qqqq':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // Month
    M: function (date, token, localize) {
      var month = date.getUTCMonth()

      switch (token) {
        case 'M':
        case 'MM':
          return formatters$3.M(date, token)
        // 1st, 2nd, ..., 12th

        case 'Mo':
          return localize.ordinalNumber(month + 1, {
            unit: 'month',
          })
        // Jan, Feb, ..., Dec

        case 'MMM':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'formatting',
          })
        // J, F, ..., D

        case 'MMMMM':
          return localize.month(month, {
            width: 'narrow',
            context: 'formatting',
          })
        // January, February, ..., December

        case 'MMMM':
        default:
          return localize.month(month, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone month
    L: function (date, token, localize) {
      var month = date.getUTCMonth()

      switch (token) {
        // 1, 2, ..., 12
        case 'L':
          return String(month + 1)
        // 01, 02, ..., 12

        case 'LL':
          return addLeadingZeros(month + 1, 2)
        // 1st, 2nd, ..., 12th

        case 'Lo':
          return localize.ordinalNumber(month + 1, {
            unit: 'month',
          })
        // Jan, Feb, ..., Dec

        case 'LLL':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'standalone',
          })
        // J, F, ..., D

        case 'LLLLL':
          return localize.month(month, {
            width: 'narrow',
            context: 'standalone',
          })
        // January, February, ..., December

        case 'LLLL':
        default:
          return localize.month(month, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // Local week of year
    w: function (date, token, localize, options) {
      var week = getUTCWeek(date, options)

      if (token === 'wo') {
        return localize.ordinalNumber(week, {
          unit: 'week',
        })
      }

      return addLeadingZeros(week, token.length)
    },
    // ISO week of year
    I: function (date, token, localize) {
      var isoWeek = getUTCISOWeek(date)

      if (token === 'Io') {
        return localize.ordinalNumber(isoWeek, {
          unit: 'week',
        })
      }

      return addLeadingZeros(isoWeek, token.length)
    },
    // Day of the month
    d: function (date, token, localize) {
      if (token === 'do') {
        return localize.ordinalNumber(date.getUTCDate(), {
          unit: 'date',
        })
      }

      return formatters$3.d(date, token)
    },
    // Day of year
    D: function (date, token, localize) {
      var dayOfYear = getUTCDayOfYear(date)

      if (token === 'Do') {
        return localize.ordinalNumber(dayOfYear, {
          unit: 'dayOfYear',
        })
      }

      return addLeadingZeros(dayOfYear, token.length)
    },
    // Day of week
    E: function (date, token, localize) {
      var dayOfWeek = date.getUTCDay()

      switch (token) {
        // Tue
        case 'E':
        case 'EE':
        case 'EEE':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        // T

        case 'EEEEE':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        // Tu

        case 'EEEEEE':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        // Tuesday

        case 'EEEE':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Local day of week
    e: function (date, token, localize, options) {
      var dayOfWeek = date.getUTCDay()
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7

      switch (token) {
        // Numerical value (Nth day of week with current locale or weekStartsOn)
        case 'e':
          return String(localDayOfWeek)
        // Padded numerical value

        case 'ee':
          return addLeadingZeros(localDayOfWeek, 2)
        // 1st, 2nd, ..., 7th

        case 'eo':
          return localize.ordinalNumber(localDayOfWeek, {
            unit: 'day',
          })

        case 'eee':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        // T

        case 'eeeee':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        // Tu

        case 'eeeeee':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        // Tuesday

        case 'eeee':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone local day of week
    c: function (date, token, localize, options) {
      var dayOfWeek = date.getUTCDay()
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7

      switch (token) {
        // Numerical value (same as in `e`)
        case 'c':
          return String(localDayOfWeek)
        // Padded numerical value

        case 'cc':
          return addLeadingZeros(localDayOfWeek, token.length)
        // 1st, 2nd, ..., 7th

        case 'co':
          return localize.ordinalNumber(localDayOfWeek, {
            unit: 'day',
          })

        case 'ccc':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'standalone',
          })
        // T

        case 'ccccc':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'standalone',
          })
        // Tu

        case 'cccccc':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'standalone',
          })
        // Tuesday

        case 'cccc':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // ISO day of week
    i: function (date, token, localize) {
      var dayOfWeek = date.getUTCDay()
      var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek

      switch (token) {
        // 2
        case 'i':
          return String(isoDayOfWeek)
        // 02

        case 'ii':
          return addLeadingZeros(isoDayOfWeek, token.length)
        // 2nd

        case 'io':
          return localize.ordinalNumber(isoDayOfWeek, {
            unit: 'day',
          })
        // Tue

        case 'iii':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        // T

        case 'iiiii':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        // Tu

        case 'iiiiii':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        // Tuesday

        case 'iiii':
        default:
          return localize.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // AM or PM
    a: function (date, token, localize) {
      var hours = date.getUTCHours()
      var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am'

      switch (token) {
        case 'a':
        case 'aa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })

        case 'aaa':
          return localize
            .dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting',
            })
            .toLowerCase()

        case 'aaaaa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })

        case 'aaaa':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // AM, PM, midnight, noon
    b: function (date, token, localize) {
      var hours = date.getUTCHours()
      var dayPeriodEnumValue

      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am'
      }

      switch (token) {
        case 'b':
        case 'bb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })

        case 'bbb':
          return localize
            .dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting',
            })
            .toLowerCase()

        case 'bbbbb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })

        case 'bbbb':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // in the morning, in the afternoon, in the evening, at night
    B: function (date, token, localize) {
      var hours = date.getUTCHours()
      var dayPeriodEnumValue

      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night
      }

      switch (token) {
        case 'B':
        case 'BB':
        case 'BBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })

        case 'BBBBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })

        case 'BBBB':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Hour [1-12]
    h: function (date, token, localize) {
      if (token === 'ho') {
        var hours = date.getUTCHours() % 12
        if (hours === 0) hours = 12
        return localize.ordinalNumber(hours, {
          unit: 'hour',
        })
      }

      return formatters$3.h(date, token)
    },
    // Hour [0-23]
    H: function (date, token, localize) {
      if (token === 'Ho') {
        return localize.ordinalNumber(date.getUTCHours(), {
          unit: 'hour',
        })
      }

      return formatters$3.H(date, token)
    },
    // Hour [0-11]
    K: function (date, token, localize) {
      var hours = date.getUTCHours() % 12

      if (token === 'Ko') {
        return localize.ordinalNumber(hours, {
          unit: 'hour',
        })
      }

      return addLeadingZeros(hours, token.length)
    },
    // Hour [1-24]
    k: function (date, token, localize) {
      var hours = date.getUTCHours()
      if (hours === 0) hours = 24

      if (token === 'ko') {
        return localize.ordinalNumber(hours, {
          unit: 'hour',
        })
      }

      return addLeadingZeros(hours, token.length)
    },
    // Minute
    m: function (date, token, localize) {
      if (token === 'mo') {
        return localize.ordinalNumber(date.getUTCMinutes(), {
          unit: 'minute',
        })
      }

      return formatters$3.m(date, token)
    },
    // Second
    s: function (date, token, localize) {
      if (token === 'so') {
        return localize.ordinalNumber(date.getUTCSeconds(), {
          unit: 'second',
        })
      }

      return formatters$3.s(date, token)
    },
    // Fraction of second
    S: function (date, token) {
      return formatters$3.S(date, token)
    },
    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timezoneOffset = originalDate.getTimezoneOffset()

      if (timezoneOffset === 0) {
        return 'Z'
      }

      switch (token) {
        // Hours and optional minutes
        case 'X':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)
        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XX`

        case 'XXXX':
        case 'XX':
          // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset)
        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XXX`

        case 'XXXXX':
        case 'XXX': // Hours and minutes with `:` delimiter

        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timezoneOffset = originalDate.getTimezoneOffset()

      switch (token) {
        // Hours and optional minutes
        case 'x':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)
        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xx`

        case 'xxxx':
        case 'xx':
          // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset)
        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xxx`

        case 'xxxxx':
        case 'xxx': // Hours and minutes with `:` delimiter

        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (GMT)
    O: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timezoneOffset = originalDate.getTimezoneOffset()

      switch (token) {
        // Short
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        // Long

        case 'OOOO':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (specific non-location)
    z: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timezoneOffset = originalDate.getTimezoneOffset()

      switch (token) {
        // Short
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        // Long

        case 'zzzz':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },
    // Seconds timestamp
    t: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timestamp = Math.floor(originalDate.getTime() / 1000)
      return addLeadingZeros(timestamp, token.length)
    },
    // Milliseconds timestamp
    T: function (date, token, _localize, options) {
      var originalDate = options._originalDate || date
      var timestamp = originalDate.getTime()
      return addLeadingZeros(timestamp, token.length)
    },
  }

  function formatTimezoneShort(offset, delimiter) {
    var sign = offset > 0 ? '-' : '+'
    var absOffset = Math.abs(offset)
    var hours = Math.floor(absOffset / 60)
    var minutes = absOffset % 60

    if (minutes === 0) {
      return sign + String(hours)
    }

    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2)
  }

  function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
      var sign = offset > 0 ? '-' : '+'
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2)
    }

    return formatTimezone(offset, dirtyDelimiter)
  }

  function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || ''
    var sign = offset > 0 ? '-' : '+'
    var absOffset = Math.abs(offset)
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2)
    var minutes = addLeadingZeros(absOffset % 60, 2)
    return sign + hours + delimiter + minutes
  }

  var formatters$1 = formatters
  function dateLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'P':
        return formatLong.date({
          width: 'short',
        })

      case 'PP':
        return formatLong.date({
          width: 'medium',
        })

      case 'PPP':
        return formatLong.date({
          width: 'long',
        })

      case 'PPPP':
      default:
        return formatLong.date({
          width: 'full',
        })
    }
  }

  function timeLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'p':
        return formatLong.time({
          width: 'short',
        })

      case 'pp':
        return formatLong.time({
          width: 'medium',
        })

      case 'ppp':
        return formatLong.time({
          width: 'long',
        })

      case 'pppp':
      default:
        return formatLong.time({
          width: 'full',
        })
    }
  }

  function dateTimeLongFormatter(pattern, formatLong) {
    var matchResult = pattern.match(/(P+)(p+)?/) || []
    var datePattern = matchResult[1]
    var timePattern = matchResult[2]

    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong)
    }

    var dateTimeFormat

    switch (datePattern) {
      case 'P':
        dateTimeFormat = formatLong.dateTime({
          width: 'short',
        })
        break

      case 'PP':
        dateTimeFormat = formatLong.dateTime({
          width: 'medium',
        })
        break

      case 'PPP':
        dateTimeFormat = formatLong.dateTime({
          width: 'long',
        })
        break

      case 'PPPP':
      default:
        dateTimeFormat = formatLong.dateTime({
          width: 'full',
        })
        break
    }

    return dateTimeFormat
      .replace('{{date}}', dateLongFormatter(datePattern, formatLong))
      .replace('{{time}}', timeLongFormatter(timePattern, formatLong))
  }

  var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter,
  }
  var longFormatters$1 = longFormatters
  var protectedDayOfYearTokens = ['D', 'DD']
  var protectedWeekYearTokens = ['YY', 'YYYY']
  function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1
  }
  function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1
  }
  function throwProtectedError(token, format, input) {
    if (token === 'YYYY') {
      throw new RangeError(
        'Use `yyyy` instead of `YYYY` (in `'
          .concat(format, '`) for formatting years to the input `')
          .concat(input, '`; see: https://git.io/fxCyr'),
      )
    } else if (token === 'YY') {
      throw new RangeError(
        'Use `yy` instead of `YY` (in `'
          .concat(format, '`) for formatting years to the input `')
          .concat(input, '`; see: https://git.io/fxCyr'),
      )
    } else if (token === 'D') {
      throw new RangeError(
        'Use `d` instead of `D` (in `'
          .concat(format, '`) for formatting days of the month to the input `')
          .concat(input, '`; see: https://git.io/fxCyr'),
      )
    } else if (token === 'DD') {
      throw new RangeError(
        'Use `dd` instead of `DD` (in `'
          .concat(format, '`) for formatting days of the month to the input `')
          .concat(input, '`; see: https://git.io/fxCyr'),
      )
    }
  } // - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
  //   (one of the certain letters followed by `o`)
  // - (\w)\1* matches any sequences of the same letter
  // - '' matches two quote characters in a row
  // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
  //   except a single quote symbol, which ends the sequence.
  //   Two quote characters do not end the sequence.
  //   If there is no matching single quote
  //   then the sequence will continue until the end of the string.
  // - . matches any single character unmatched by previous parts of the RegExps

  var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g // This RegExp catches symbols escaped by quotes, and also
  // sequences of symbols P, p, and the combinations like `PPPPPPPppppp`

  var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g
  var escapedStringRegExp = /^'([^]*?)'?$/
  var doubleQuoteRegExp = /''/g
  var unescapedLatinCharacterRegExp = /[a-zA-Z]/
  /**
   * @name format
   * @category Common Helpers
   * @summary Format the date.
   *
   * @description
   * Return the formatted date string in the given format. The result may vary by locale.
   *
   * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
   * > See: https://git.io/fxCyr
   *
   * The characters wrapped between two single quotes characters (') are escaped.
   * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
   * (see the last example)
   *
   * Format of the string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   * with a few additions (see note 7 below the table).
   *
   * Accepted patterns:
   * | Unit                            | Pattern | Result examples                   | Notes |
   * |---------------------------------|---------|-----------------------------------|-------|
   * | Era                             | G..GGG  | AD, BC                            |       |
   * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
   * |                                 | GGGGG   | A, B                              |       |
   * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
   * |                                 | yy      | 44, 01, 00, 17                    | 5     |
   * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
   * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
   * |                                 | yyyyy   | ...                               | 3,5   |
   * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
   * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
   * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
   * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
   * |                                 | YYYYY   | ...                               | 3,5   |
   * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
   * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
   * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
   * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
   * |                                 | RRRRR   | ...                               | 3,5,7 |
   * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
   * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
   * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
   * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
   * |                                 | uuuuu   | ...                               | 3,5   |
   * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
   * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | QQ      | 01, 02, 03, 04                    |       |
   * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
   * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
   * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | qq      | 01, 02, 03, 04                    |       |
   * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
   * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
   * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | MM      | 01, 02, ..., 12                   |       |
   * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 | MMMM    | January, February, ..., December  | 2     |
   * |                                 | MMMMM   | J, F, ..., D                      |       |
   * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
   * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | LL      | 01, 02, ..., 12                   |       |
   * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
   * |                                 | LLLL    | January, February, ..., December  | 2     |
   * |                                 | LLLLL   | J, F, ..., D                      |       |
   * | Local week of year              | w       | 1, 2, ..., 53                     |       |
   * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | ww      | 01, 02, ..., 53                   |       |
   * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
   * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | II      | 01, 02, ..., 53                   | 7     |
   * | Day of month                    | d       | 1, 2, ..., 31                     |       |
   * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
   * |                                 | dd      | 01, 02, ..., 31                   |       |
   * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
   * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
   * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
   * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
   * |                                 | DDDD    | ...                               | 3     |
   * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
   * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
   * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
   * |                                 | ii      | 01, 02, ..., 07                   | 7     |
   * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
   * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
   * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
   * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
   * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
   * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | ee      | 02, 03, ..., 01                   |       |
   * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
   * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
   * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | cc      | 02, 03, ..., 01                   |       |
   * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
   * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
   * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
   * | AM, PM                          | a..aa   | AM, PM                            |       |
   * |                                 | aaa     | am, pm                            |       |
   * |                                 | aaaa    | a.m., p.m.                        | 2     |
   * |                                 | aaaaa   | a, p                              |       |
   * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
   * |                                 | bbb     | am, pm, noon, midnight            |       |
   * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
   * |                                 | bbbbb   | a, p, n, mi                       |       |
   * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
   * |                                 | BBBB    | at night, in the morning, ...     | 2     |
   * |                                 | BBBBB   | at night, in the morning, ...     |       |
   * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
   * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
   * |                                 | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
   * |                                 | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
   * |                                 | KK      | 01, 02, ..., 11, 00               |       |
   * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
   * |                                 | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          | m       | 0, 1, ..., 59                     |       |
   * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | mm      | 00, 01, ..., 59                   |       |
   * | Second                          | s       | 0, 1, ..., 59                     |       |
   * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | ss      | 00, 01, ..., 59                   |       |
   * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
   * |                                 | SS      | 00, 01, ..., 99                   |       |
   * |                                 | SSS     | 000, 001, ..., 999                |       |
   * |                                 | SSSS    | ...                               | 3     |
   * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
   * |                                 | XX      | -0800, +0530, Z                   |       |
   * |                                 | XXX     | -08:00, +05:30, Z                 |       |
   * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
   * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
   * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
   * |                                 | xx      | -0800, +0530, +0000               |       |
   * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
   * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
   * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
   * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
   * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
   * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
   * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
   * | Seconds timestamp               | t       | 512969520                         | 7     |
   * |                                 | tt      | ...                               | 3,7   |
   * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
   * |                                 | TT      | ...                               | 3,7   |
   * | Long localized date             | P       | 04/29/1453                        | 7     |
   * |                                 | PP      | Apr 29, 1453                      | 7     |
   * |                                 | PPP     | April 29th, 1453                  | 7     |
   * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
   * | Long localized time             | p       | 12:00 AM                          | 7     |
   * |                                 | pp      | 12:00:00 AM                       | 7     |
   * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
   * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
   * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
   * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
   * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
   * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
   * Notes:
   * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
   *    are the same as "stand-alone" units, but are different in some languages.
   *    "Formatting" units are declined according to the rules of the language
   *    in the context of a date. "Stand-alone" units are always nominative singular:
   *
   *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
   *
   *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
   *
   * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
   *    the single quote characters (see below).
   *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
   *    the output will be the same as default pattern for this unit, usually
   *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
   *    are marked with "2" in the last column of the table.
   *
   *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
   *
   * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
   *    The output will be padded with zeros to match the length of the pattern.
   *
   *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
   *
   * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   * 5. The main difference between `y` and `u` patterns are B.C. years:
   *
   *    | Year | `y` | `u` |
   *    |------|-----|-----|
   *    | AC 1 |   1 |   1 |
   *    | BC 1 |   1 |   0 |
   *    | BC 2 |   2 |  -1 |
   *
   *    Also `yy` always returns the last two digits of a year,
   *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
   *
   *    | Year | `yy` | `uu` |
   *    |------|------|------|
   *    | 1    |   01 |   01 |
   *    | 14   |   14 |   14 |
   *    | 376  |   76 |  376 |
   *    | 1453 |   53 | 1453 |
   *
   *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
   *    except local week-numbering years are dependent on `options.weekStartsOn`
   *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
   *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
   *
   * 6. Specific non-location timezones are currently unavailable in `date-fns`,
   *    so right now these tokens fall back to GMT timezones.
   *
   * 7. These patterns are not in the Unicode Technical Standard #35:
   *    - `i`: ISO day of week
   *    - `I`: ISO week of year
   *    - `R`: ISO week-numbering year
   *    - `t`: seconds timestamp
   *    - `T`: milliseconds timestamp
   *    - `o`: ordinal number modifier
   *    - `P`: long localized date
   *    - `p`: long localized time
   *
   * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
   *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://git.io/fxCyr
   *
   * 9. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
   *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://git.io/fxCyr
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - The second argument is now required for the sake of explicitness.
   *
   *   ```javascript
   *   // Before v2.0.0
   *   format(new Date(2016, 0, 1))
   *
   *   // v2.0.0 onward
   *   format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
   *   ```
   *
   * - New format string API for `format` function
   *   which is based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
   *   See [this post](https://blog.date-fns.org/post/unicode-tokens-in-date-fns-v2-sreatyki91jg) for more details.
   *
   * - Characters are now escaped using single quote symbols (`'`) instead of square brackets.
   *
   * @param {Date|Number} date - the original date
   * @param {String} format - the string of tokens
   * @param {Object} [options] - an object with options.
   * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
   * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
   * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
   *   see: https://git.io/fxCyr
   * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
   *   see: https://git.io/fxCyr
   * @returns {String} the formatted date string
   * @throws {TypeError} 2 arguments required
   * @throws {RangeError} `date` must not be Invalid Date
   * @throws {RangeError} `options.locale` must contain `localize` property
   * @throws {RangeError} `options.locale` must contain `formatLong` property
   * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
   * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
   * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
   * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
   * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
   * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
   * @throws {RangeError} format string contains an unescaped latin alphabet character
   *
   * @example
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
   * //=> '02/11/2014'
   *
   * @example
   * // Represent 2 July 2014 in Esperanto:
   * import { eoLocale } from 'date-fns/locale/eo'
   * var result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
   *   locale: eoLocale
   * })
   * //=> '2-a de julio 2014'
   *
   * @example
   * // Escape string by single quote characters:
   * var result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
   * //=> "3 o'clock"
   */

  function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
    requiredArgs(2, arguments)
    var formatStr = String(dirtyFormatStr)
    var options = dirtyOptions || {}
    var locale = options.locale || defaultLocale
    var localeFirstWeekContainsDate =
      locale.options && locale.options.firstWeekContainsDate
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate)
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate) // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively')
    }

    var localeWeekStartsOn = locale.options && locale.options.weekStartsOn
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn)
    var weekStartsOn =
      options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn) // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    if (!locale.localize) {
      throw new RangeError('locale must contain localize property')
    }

    if (!locale.formatLong) {
      throw new RangeError('locale must contain formatLong property')
    }

    var originalDate = toDate(dirtyDate)

    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    } // Convert the date in system timezone to the same date in UTC+00:00 timezone.
    // This ensures that when UTC functions will be implemented, locales will be compatible with them.
    // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376

    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate)
    var utcDate = subMilliseconds(originalDate, timezoneOffset)
    var formatterOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale,
      _originalDate: originalDate,
    }
    var result = formatStr
      .match(longFormattingTokensRegExp)
      .map(function (substring) {
        var firstCharacter = substring[0]

        if (firstCharacter === 'p' || firstCharacter === 'P') {
          var longFormatter = longFormatters$1[firstCharacter]
          return longFormatter(substring, locale.formatLong, formatterOptions)
        }

        return substring
      })
      .join('')
      .match(formattingTokensRegExp)
      .map(function (substring) {
        // Replace two single quote characters with one single quote character
        if (substring === "''") {
          return "'"
        }

        var firstCharacter = substring[0]

        if (firstCharacter === "'") {
          return cleanEscapedString(substring)
        }

        var formatter = formatters$1[firstCharacter]

        if (formatter) {
          if (
            !options.useAdditionalWeekYearTokens &&
            isProtectedWeekYearToken(substring)
          ) {
            throwProtectedError(substring, dirtyFormatStr, dirtyDate)
          }

          if (
            !options.useAdditionalDayOfYearTokens &&
            isProtectedDayOfYearToken(substring)
          ) {
            throwProtectedError(substring, dirtyFormatStr, dirtyDate)
          }

          return formatter(utcDate, substring, locale.localize, formatterOptions)
        }

        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError(
            'Format string contains an unescaped latin alphabet character `' +
              firstCharacter +
              '`',
          )
        }

        return substring
      })
      .join('')
    return result
  }

  function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'")
  }
  var formatDistanceLocale = {
    lessThanXSeconds: {
      standalone: {
        one: 'weniger als 1 Sekunde',
        other: 'weniger als {{count}} Sekunden',
      },
      withPreposition: {
        one: 'weniger als 1 Sekunde',
        other: 'weniger als {{count}} Sekunden',
      },
    },
    xSeconds: {
      standalone: {
        one: '1 Sekunde',
        other: '{{count}} Sekunden',
      },
      withPreposition: {
        one: '1 Sekunde',
        other: '{{count}} Sekunden',
      },
    },
    halfAMinute: {
      standalone: 'halbe Minute',
      withPreposition: 'halben Minute',
    },
    lessThanXMinutes: {
      standalone: {
        one: 'weniger als 1 Minute',
        other: 'weniger als {{count}} Minuten',
      },
      withPreposition: {
        one: 'weniger als 1 Minute',
        other: 'weniger als {{count}} Minuten',
      },
    },
    xMinutes: {
      standalone: {
        one: '1 Minute',
        other: '{{count}} Minuten',
      },
      withPreposition: {
        one: '1 Minute',
        other: '{{count}} Minuten',
      },
    },
    aboutXHours: {
      standalone: {
        one: 'etwa 1 Stunde',
        other: 'etwa {{count}} Stunden',
      },
      withPreposition: {
        one: 'etwa 1 Stunde',
        other: 'etwa {{count}} Stunden',
      },
    },
    xHours: {
      standalone: {
        one: '1 Stunde',
        other: '{{count}} Stunden',
      },
      withPreposition: {
        one: '1 Stunde',
        other: '{{count}} Stunden',
      },
    },
    xDays: {
      standalone: {
        one: '1 Tag',
        other: '{{count}} Tage',
      },
      withPreposition: {
        one: '1 Tag',
        other: '{{count}} Tagen',
      },
    },
    aboutXWeeks: {
      standalone: {
        one: 'etwa 1 Woche',
        other: 'etwa {{count}} Wochen',
      },
      withPreposition: {
        one: 'etwa 1 Woche',
        other: 'etwa {{count}} Wochen',
      },
    },
    xWeeks: {
      standalone: {
        one: '1 Woche',
        other: '{{count}} Wochen',
      },
      withPreposition: {
        one: '1 Woche',
        other: '{{count}} Wochen',
      },
    },
    aboutXMonths: {
      standalone: {
        one: 'etwa 1 Monat',
        other: 'etwa {{count}} Monate',
      },
      withPreposition: {
        one: 'etwa 1 Monat',
        other: 'etwa {{count}} Monaten',
      },
    },
    xMonths: {
      standalone: {
        one: '1 Monat',
        other: '{{count}} Monate',
      },
      withPreposition: {
        one: '1 Monat',
        other: '{{count}} Monaten',
      },
    },
    aboutXYears: {
      standalone: {
        one: 'etwa 1 Jahr',
        other: 'etwa {{count}} Jahre',
      },
      withPreposition: {
        one: 'etwa 1 Jahr',
        other: 'etwa {{count}} Jahren',
      },
    },
    xYears: {
      standalone: {
        one: '1 Jahr',
        other: '{{count}} Jahre',
      },
      withPreposition: {
        one: '1 Jahr',
        other: '{{count}} Jahren',
      },
    },
    overXYears: {
      standalone: {
        one: 'mehr als 1 Jahr',
        other: 'mehr als {{count}} Jahre',
      },
      withPreposition: {
        one: 'mehr als 1 Jahr',
        other: 'mehr als {{count}} Jahren',
      },
    },
    almostXYears: {
      standalone: {
        one: 'fast 1 Jahr',
        other: 'fast {{count}} Jahre',
      },
      withPreposition: {
        one: 'fast 1 Jahr',
        other: 'fast {{count}} Jahren',
      },
    },
  }

  var formatDistance = function (token, count, options) {
    var result
    var tokenValue =
      options !== null && options !== void 0 && options.addSuffix
        ? formatDistanceLocale[token].withPreposition
        : formatDistanceLocale[token].standalone

    if (typeof tokenValue === 'string') {
      result = tokenValue
    } else if (count === 1) {
      result = tokenValue.one
    } else {
      result = tokenValue.other.replace('{{count}}', String(count))
    }

    if (options !== null && options !== void 0 && options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return 'in ' + result
      } else {
        return 'vor ' + result
      }
    }

    return result
  }

  var formatDistance$1 = formatDistance // DIN 5008: https://de.wikipedia.org/wiki/Datumsformat#DIN_5008
  var dateFormats = {
    full: 'EEEE, do MMMM y',
    // Montag, 7. Januar 2018
    long: 'do MMMM y',
    // 7. Januar 2018
    medium: 'do MMM y',
    // 7. Jan. 2018
    short: 'dd.MM.y', // 07.01.2018
  }
  var timeFormats = {
    full: 'HH:mm:ss zzzz',
    long: 'HH:mm:ss z',
    medium: 'HH:mm:ss',
    short: 'HH:mm',
  }
  var dateTimeFormats = {
    full: "{{date}} 'um' {{time}}",
    long: "{{date}} 'um' {{time}}",
    medium: '{{date}} {{time}}',
    short: '{{date}} {{time}}',
  }
  var formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: 'full',
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: 'full',
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: 'full',
    }),
  }
  var formatLong$1 = formatLong
  var formatRelativeLocale = {
    lastWeek: "'letzten' eeee 'um' p",
    yesterday: "'gestern um' p",
    today: "'heute um' p",
    tomorrow: "'morgen um' p",
    nextWeek: "eeee 'um' p",
    other: 'P',
  }

  var formatRelative = function (token, _date, _baseDate, _options) {
    return formatRelativeLocale[token]
  }

  var formatRelative$1 = formatRelative
  var eraValues = {
    narrow: ['v.Chr.', 'n.Chr.'],
    abbreviated: ['v.Chr.', 'n.Chr.'],
    wide: ['vor Christus', 'nach Christus'],
  }
  var quarterValues = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1. Quartal', '2. Quartal', '3. Quartal', '4. Quartal'],
  } // Note: in German, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.

  var monthValues = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: [
      'Jan',
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez',
    ],
    wide: [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ],
  } // https://st.unicode.org/cldr-apps/v#/de/Gregorian/

  var formattingMonthValues = {
    narrow: monthValues.narrow,
    abbreviated: [
      'Jan.',
      'Feb.',
      'März',
      'Apr.',
      'Mai',
      'Juni',
      'Juli',
      'Aug.',
      'Sep.',
      'Okt.',
      'Nov.',
      'Dez.',
    ],
    wide: monthValues.wide,
  }
  var dayValues = {
    narrow: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
    short: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    abbreviated: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
    wide: [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ],
  } // https://www.unicode.org/cldr/charts/32/summary/de.html#1881

  var dayPeriodValues = {
    narrow: {
      am: 'vm.',
      pm: 'nm.',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'Morgen',
      afternoon: 'Nachm.',
      evening: 'Abend',
      night: 'Nacht',
    },
    abbreviated: {
      am: 'vorm.',
      pm: 'nachm.',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'Morgen',
      afternoon: 'Nachmittag',
      evening: 'Abend',
      night: 'Nacht',
    },
    wide: {
      am: 'vormittags',
      pm: 'nachmittags',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'Morgen',
      afternoon: 'Nachmittag',
      evening: 'Abend',
      night: 'Nacht',
    },
  }
  var formattingDayPeriodValues = {
    narrow: {
      am: 'vm.',
      pm: 'nm.',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'morgens',
      afternoon: 'nachm.',
      evening: 'abends',
      night: 'nachts',
    },
    abbreviated: {
      am: 'vorm.',
      pm: 'nachm.',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'morgens',
      afternoon: 'nachmittags',
      evening: 'abends',
      night: 'nachts',
    },
    wide: {
      am: 'vormittags',
      pm: 'nachmittags',
      midnight: 'Mitternacht',
      noon: 'Mittag',
      morning: 'morgens',
      afternoon: 'nachmittags',
      evening: 'abends',
      night: 'nachts',
    },
  }

  var ordinalNumber = function (dirtyNumber) {
    var number = Number(dirtyNumber)
    return number + '.'
  }

  var localize = {
    ordinalNumber: ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: 'wide',
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: 'wide',
      argumentCallback: function (quarter) {
        return quarter - 1
      },
    }),
    month: buildLocalizeFn({
      values: monthValues,
      formattingValues: formattingMonthValues,
      defaultWidth: 'wide',
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide',
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: 'wide',
    }),
  }
  var localize$1 = localize
  var matchOrdinalNumberPattern = /^(\d+)(\.)?/i
  var parseOrdinalNumberPattern = /\d+/i
  var matchEraPatterns = {
    narrow: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
    abbreviated: /^(v\.? ?Chr\.?|n\.? ?Chr\.?)/i,
    wide: /^(vor Christus|vor unserer Zeitrechnung|nach Christus|unserer Zeitrechnung)/i,
  }
  var parseEraPatterns = {
    any: [/^v/i, /^n/i],
  }
  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](\.)? Quartal/i,
  }
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i],
  }
  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(j[aä]n|feb|mär[z]?|apr|mai|jun[i]?|jul[i]?|aug|sep|okt|nov|dez)\.?/i,
    wide: /^(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/i,
  }
  var parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^j[aä]/i,
      /^f/i,
      /^mär/i,
      /^ap/i,
      /^mai/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  }
  var matchDayPatterns = {
    narrow: /^[smdmf]/i,
    short: /^(so|mo|di|mi|do|fr|sa)/i,
    abbreviated: /^(son?|mon?|die?|mit?|don?|fre?|sam?)\.?/i,
    wide: /^(sonntag|montag|dienstag|mittwoch|donnerstag|freitag|samstag)/i,
  }
  var parseDayPatterns = {
    any: [/^so/i, /^mo/i, /^di/i, /^mi/i, /^do/i, /^f/i, /^sa/i],
  }
  var matchDayPeriodPatterns = {
    narrow: /^(vm\.?|nm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
    abbreviated: /^(vorm\.?|nachm\.?|Mitternacht|Mittag|morgens|nachm\.?|abends|nachts)/i,
    wide: /^(vormittags|nachmittags|Mitternacht|Mittag|morgens|nachmittags|abends|nachts)/i,
  }
  var parseDayPeriodPatterns = {
    any: {
      am: /^v/i,
      pm: /^n/i,
      midnight: /^Mitte/i,
      noon: /^Mitta/i,
      morning: /morgens/i,
      afternoon: /nachmittags/i,
      // will never be matched. Afternoon is matched by `pm`
      evening: /abends/i,
      night: /nachts/i, // will never be matched. Night is matched by `pm`
    },
  }
  var match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function (value) {
        return parseInt(value)
      },
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns,
      defaultParseWidth: 'any',
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: 'any',
      valueCallback: function (index) {
        return index + 1
      },
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: 'any',
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns,
      defaultParseWidth: 'any',
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: 'any',
    }),
  }
  var match$1 = match
  /**
   * @type {Locale}
   * @category Locales
   * @summary German locale.
   * @language German
   * @iso-639-2 deu
   * @author Thomas Eilmsteiner [@DeMuu]{@link https://github.com/DeMuu}
   * @author Asia [@asia-t]{@link https://github.com/asia-t}
   * @author Van Vuong Ngo [@vanvuongngo]{@link https://github.com/vanvuongngo}
   * @author RomanErnst [@pex]{@link https://github.com/pex}
   * @author Philipp Keck [@Philipp91]{@link https://github.com/Philipp91}
   */ var locale = {
    code: 'de',
    formatDistance: formatDistance$1,
    formatLong: formatLong$1,
    formatRelative: formatRelative$1,
    localize: localize$1,
    match: match$1,
    options: {
      weekStartsOn: 1,
      /* Monday */
      firstWeekContainsDate: 4,
    },
  }
  var de = locale
  function dateValidator(date) {
    return !(date === null || Number.isNaN(new Date(date).getDate()))
  }
  function dateFormat(d, formatStr) {
    return d ? format(d ?? new Date(), formatStr, { locale: de }) : '-'
  }
  function formatDayTime(d) {
    return dateFormat(d, 'Pp')
  }
  function formatDay(d) {
    return dateFormat(d, 'P')
  }
  function ageInYears(d, from) {
    if (d) {
      const diffDays = differenceInDays(d, from || new Date())
      return (diffDays / 365).toFixed(1)
    }
    return '0'
  }
  var commonjsGlobal =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : {}
  var ansiStyles$1 = { exports: {} }
  var colorName = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  } /* MIT license */

  /* eslint-disable no-mixed-operators */
  const cssKeywords = colorName

  // NOTE: conversions should only return primitive values (i.e. arrays, or
  //       values that give correct `typeof` results).
  //       do not use box values types (i.e. Number(), String(), etc.)

  const reverseKeywords = {}
  for (const key of Object.keys(cssKeywords)) {
    reverseKeywords[cssKeywords[key]] = key
  }

  const convert$1 = {
    rgb: { channels: 3, labels: 'rgb' },
    hsl: { channels: 3, labels: 'hsl' },
    hsv: { channels: 3, labels: 'hsv' },
    hwb: { channels: 3, labels: 'hwb' },
    cmyk: { channels: 4, labels: 'cmyk' },
    xyz: { channels: 3, labels: 'xyz' },
    lab: { channels: 3, labels: 'lab' },
    lch: { channels: 3, labels: 'lch' },
    hex: { channels: 1, labels: ['hex'] },
    keyword: { channels: 1, labels: ['keyword'] },
    ansi16: { channels: 1, labels: ['ansi16'] },
    ansi256: { channels: 1, labels: ['ansi256'] },
    hcg: { channels: 3, labels: ['h', 'c', 'g'] },
    apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
    gray: { channels: 1, labels: ['gray'] },
  }

  var conversions$2 = convert$1

  // Hide .channels and .labels properties
  for (const model of Object.keys(convert$1)) {
    if (!('channels' in convert$1[model])) {
      throw new Error('missing channels property: ' + model)
    }

    if (!('labels' in convert$1[model])) {
      throw new Error('missing channel labels property: ' + model)
    }

    if (convert$1[model].labels.length !== convert$1[model].channels) {
      throw new Error('channel and label counts mismatch: ' + model)
    }

    const { channels, labels } = convert$1[model]
    delete convert$1[model].channels
    delete convert$1[model].labels
    Object.defineProperty(convert$1[model], 'channels', { value: channels })
    Object.defineProperty(convert$1[model], 'labels', { value: labels })
  }

  convert$1.rgb.hsl = function (rgb) {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255
    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    const delta = max - min
    let h
    let s

    if (max === min) {
      h = 0
    } else if (r === max) {
      h = (g - b) / delta
    } else if (g === max) {
      h = 2 + (b - r) / delta
    } else if (b === max) {
      h = 4 + (r - g) / delta
    }

    h = Math.min(h * 60, 360)

    if (h < 0) {
      h += 360
    }

    const l = (min + max) / 2

    if (max === min) {
      s = 0
    } else if (l <= 0.5) {
      s = delta / (max + min)
    } else {
      s = delta / (2 - max - min)
    }

    return [h, s * 100, l * 100]
  }

  convert$1.rgb.hsv = function (rgb) {
    let rdif
    let gdif
    let bdif
    let h
    let s

    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255
    const v = Math.max(r, g, b)
    const diff = v - Math.min(r, g, b)
    const diffc = function (c) {
      return (v - c) / 6 / diff + 1 / 2
    }

    if (diff === 0) {
      h = 0
      s = 0
    } else {
      s = diff / v
      rdif = diffc(r)
      gdif = diffc(g)
      bdif = diffc(b)

      if (r === v) {
        h = bdif - gdif
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif
      }

      if (h < 0) {
        h += 1
      } else if (h > 1) {
        h -= 1
      }
    }

    return [h * 360, s * 100, v * 100]
  }

  convert$1.rgb.hwb = function (rgb) {
    const r = rgb[0]
    const g = rgb[1]
    let b = rgb[2]
    const h = convert$1.rgb.hsl(rgb)[0]
    const w = (1 / 255) * Math.min(r, Math.min(g, b))

    b = 1 - (1 / 255) * Math.max(r, Math.max(g, b))

    return [h, w * 100, b * 100]
  }

  convert$1.rgb.cmyk = function (rgb) {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255

    const k = Math.min(1 - r, 1 - g, 1 - b)
    const c = (1 - r - k) / (1 - k) || 0
    const m = (1 - g - k) / (1 - k) || 0
    const y = (1 - b - k) / (1 - k) || 0

    return [c * 100, m * 100, y * 100, k * 100]
  }

  function comparativeDistance(x, y) {
    /*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
    return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2
  }

  convert$1.rgb.keyword = function (rgb) {
    const reversed = reverseKeywords[rgb]
    if (reversed) {
      return reversed
    }

    let currentClosestDistance = Infinity
    let currentClosestKeyword

    for (const keyword of Object.keys(cssKeywords)) {
      const value = cssKeywords[keyword]

      // Compute comparative distance
      const distance = comparativeDistance(rgb, value)

      // Check if its less, if so set as closest
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance
        currentClosestKeyword = keyword
      }
    }

    return currentClosestKeyword
  }

  convert$1.keyword.rgb = function (keyword) {
    return cssKeywords[keyword]
  }

  convert$1.rgb.xyz = function (rgb) {
    let r = rgb[0] / 255
    let g = rgb[1] / 255
    let b = rgb[2] / 255

    // Assume sRGB
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92

    const x = r * 0.4124 + g * 0.3576 + b * 0.1805
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505

    return [x * 100, y * 100, z * 100]
  }

  convert$1.rgb.lab = function (rgb) {
    const xyz = convert$1.rgb.xyz(rgb)
    let x = xyz[0]
    let y = xyz[1]
    let z = xyz[2]

    x /= 95.047
    y /= 100
    z /= 108.883

    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116

    const l = 116 * y - 16
    const a = 500 * (x - y)
    const b = 200 * (y - z)

    return [l, a, b]
  }

  convert$1.hsl.rgb = function (hsl) {
    const h = hsl[0] / 360
    const s = hsl[1] / 100
    const l = hsl[2] / 100
    let t2
    let t3
    let val

    if (s === 0) {
      val = l * 255
      return [val, val, val]
    }

    if (l < 0.5) {
      t2 = l * (1 + s)
    } else {
      t2 = l + s - l * s
    }

    const t1 = 2 * l - t2

    const rgb = [0, 0, 0]
    for (let i = 0; i < 3; i++) {
      t3 = h + (1 / 3) * -(i - 1)
      if (t3 < 0) {
        t3++
      }

      if (t3 > 1) {
        t3--
      }

      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3
      } else if (2 * t3 < 1) {
        val = t2
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
      } else {
        val = t1
      }

      rgb[i] = val * 255
    }

    return rgb
  }

  convert$1.hsl.hsv = function (hsl) {
    const h = hsl[0]
    let s = hsl[1] / 100
    let l = hsl[2] / 100
    let smin = s
    const lmin = Math.max(l, 0.01)

    l *= 2
    s *= l <= 1 ? l : 2 - l
    smin *= lmin <= 1 ? lmin : 2 - lmin
    const v = (l + s) / 2
    const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)

    return [h, sv * 100, v * 100]
  }

  convert$1.hsv.rgb = function (hsv) {
    const h = hsv[0] / 60
    const s = hsv[1] / 100
    let v = hsv[2] / 100
    const hi = Math.floor(h) % 6

    const f = h - Math.floor(h)
    const p = 255 * v * (1 - s)
    const q = 255 * v * (1 - s * f)
    const t = 255 * v * (1 - s * (1 - f))
    v *= 255

    switch (hi) {
      case 0:
        return [v, t, p]
      case 1:
        return [q, v, p]
      case 2:
        return [p, v, t]
      case 3:
        return [p, q, v]
      case 4:
        return [t, p, v]
      case 5:
        return [v, p, q]
    }
  }

  convert$1.hsv.hsl = function (hsv) {
    const h = hsv[0]
    const s = hsv[1] / 100
    const v = hsv[2] / 100
    const vmin = Math.max(v, 0.01)
    let sl
    let l

    l = (2 - s) * v
    const lmin = (2 - s) * vmin
    sl = s * vmin
    sl /= lmin <= 1 ? lmin : 2 - lmin
    sl = sl || 0
    l /= 2

    return [h, sl * 100, l * 100]
  }

  // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
  convert$1.hwb.rgb = function (hwb) {
    const h = hwb[0] / 360
    let wh = hwb[1] / 100
    let bl = hwb[2] / 100
    const ratio = wh + bl
    let f

    // Wh + bl cant be > 1
    if (ratio > 1) {
      wh /= ratio
      bl /= ratio
    }

    const i = Math.floor(6 * h)
    const v = 1 - bl
    f = 6 * h - i

    if ((i & 0x01) !== 0) {
      f = 1 - f
    }

    const n = wh + f * (v - wh) // Linear interpolation

    let r
    let g
    let b
    /* eslint-disable max-statements-per-line,no-multi-spaces */
    switch (i) {
      default:
      case 6:
      case 0:
        r = v
        g = n
        b = wh
        break
      case 1:
        r = n
        g = v
        b = wh
        break
      case 2:
        r = wh
        g = v
        b = n
        break
      case 3:
        r = wh
        g = n
        b = v
        break
      case 4:
        r = n
        g = wh
        b = v
        break
      case 5:
        r = v
        g = wh
        b = n
        break
    }
    /* eslint-enable max-statements-per-line,no-multi-spaces */

    return [r * 255, g * 255, b * 255]
  }

  convert$1.cmyk.rgb = function (cmyk) {
    const c = cmyk[0] / 100
    const m = cmyk[1] / 100
    const y = cmyk[2] / 100
    const k = cmyk[3] / 100

    const r = 1 - Math.min(1, c * (1 - k) + k)
    const g = 1 - Math.min(1, m * (1 - k) + k)
    const b = 1 - Math.min(1, y * (1 - k) + k)

    return [r * 255, g * 255, b * 255]
  }

  convert$1.xyz.rgb = function (xyz) {
    const x = xyz[0] / 100
    const y = xyz[1] / 100
    const z = xyz[2] / 100
    let r
    let g
    let b

    r = x * 3.2406 + y * -1.5372 + z * -0.4986
    g = x * -0.9689 + y * 1.8758 + z * 0.0415
    b = x * 0.0557 + y * -0.204 + z * 1.057

    // Assume sRGB
    r = r > 0.0031308 ? 1.055 * r ** (1.0 / 2.4) - 0.055 : r * 12.92

    g = g > 0.0031308 ? 1.055 * g ** (1.0 / 2.4) - 0.055 : g * 12.92

    b = b > 0.0031308 ? 1.055 * b ** (1.0 / 2.4) - 0.055 : b * 12.92

    r = Math.min(Math.max(0, r), 1)
    g = Math.min(Math.max(0, g), 1)
    b = Math.min(Math.max(0, b), 1)

    return [r * 255, g * 255, b * 255]
  }

  convert$1.xyz.lab = function (xyz) {
    let x = xyz[0]
    let y = xyz[1]
    let z = xyz[2]

    x /= 95.047
    y /= 100
    z /= 108.883

    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116

    const l = 116 * y - 16
    const a = 500 * (x - y)
    const b = 200 * (y - z)

    return [l, a, b]
  }

  convert$1.lab.xyz = function (lab) {
    const l = lab[0]
    const a = lab[1]
    const b = lab[2]
    let x
    let y
    let z

    y = (l + 16) / 116
    x = a / 500 + y
    z = y - b / 200

    const y2 = y ** 3
    const x2 = x ** 3
    const z2 = z ** 3
    y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787
    x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787
    z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787

    x *= 95.047
    y *= 100
    z *= 108.883

    return [x, y, z]
  }

  convert$1.lab.lch = function (lab) {
    const l = lab[0]
    const a = lab[1]
    const b = lab[2]
    let h

    const hr = Math.atan2(b, a)
    h = (hr * 360) / 2 / Math.PI

    if (h < 0) {
      h += 360
    }

    const c = Math.sqrt(a * a + b * b)

    return [l, c, h]
  }

  convert$1.lch.lab = function (lch) {
    const l = lch[0]
    const c = lch[1]
    const h = lch[2]

    const hr = (h / 360) * 2 * Math.PI
    const a = c * Math.cos(hr)
    const b = c * Math.sin(hr)

    return [l, a, b]
  }

  convert$1.rgb.ansi16 = function (args, saturation = null) {
    const [r, g, b] = args
    let value = saturation === null ? convert$1.rgb.hsv(args)[2] : saturation // Hsv -> ansi16 optimization

    value = Math.round(value / 50)

    if (value === 0) {
      return 30
    }

    let ansi =
      30 + ((Math.round(b / 255) << 2) | (Math.round(g / 255) << 1) | Math.round(r / 255))

    if (value === 2) {
      ansi += 60
    }

    return ansi
  }

  convert$1.hsv.ansi16 = function (args) {
    // Optimization here; we already know the value and don't need to get
    // it converted for us.
    return convert$1.rgb.ansi16(convert$1.hsv.rgb(args), args[2])
  }

  convert$1.rgb.ansi256 = function (args) {
    const r = args[0]
    const g = args[1]
    const b = args[2]

    // We use the extended greyscale palette here, with the exception of
    // black and white. normal palette only has 4 greyscale shades.
    if (r === g && g === b) {
      if (r < 8) {
        return 16
      }

      if (r > 248) {
        return 231
      }

      return Math.round(((r - 8) / 247) * 24) + 232
    }

    const ansi =
      16 +
      36 * Math.round((r / 255) * 5) +
      6 * Math.round((g / 255) * 5) +
      Math.round((b / 255) * 5)

    return ansi
  }

  convert$1.ansi16.rgb = function (args) {
    let color = args % 10

    // Handle greyscale
    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5
      }

      color = (color / 10.5) * 255

      return [color, color, color]
    }

    const mult = (~~(args > 50) + 1) * 0.5
    const r = (color & 1) * mult * 255
    const g = ((color >> 1) & 1) * mult * 255
    const b = ((color >> 2) & 1) * mult * 255

    return [r, g, b]
  }

  convert$1.ansi256.rgb = function (args) {
    // Handle greyscale
    if (args >= 232) {
      const c = (args - 232) * 10 + 8
      return [c, c, c]
    }

    args -= 16

    let rem
    const r = (Math.floor(args / 36) / 5) * 255
    const g = (Math.floor((rem = args % 36) / 6) / 5) * 255
    const b = ((rem % 6) / 5) * 255

    return [r, g, b]
  }

  convert$1.rgb.hex = function (args) {
    const integer =
      ((Math.round(args[0]) & 0xff) << 16) +
      ((Math.round(args[1]) & 0xff) << 8) +
      (Math.round(args[2]) & 0xff)

    const string = integer.toString(16).toUpperCase()
    return '000000'.substring(string.length) + string
  }

  convert$1.hex.rgb = function (args) {
    const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i)
    if (!match) {
      return [0, 0, 0]
    }

    let colorString = match[0]

    if (match[0].length === 3) {
      colorString = colorString
        .split('')
        .map((char) => {
          return char + char
        })
        .join('')
    }

    const integer = parseInt(colorString, 16)
    const r = (integer >> 16) & 0xff
    const g = (integer >> 8) & 0xff
    const b = integer & 0xff

    return [r, g, b]
  }

  convert$1.rgb.hcg = function (rgb) {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255
    const max = Math.max(Math.max(r, g), b)
    const min = Math.min(Math.min(r, g), b)
    const chroma = max - min
    let grayscale
    let hue

    if (chroma < 1) {
      grayscale = min / (1 - chroma)
    } else {
      grayscale = 0
    }

    if (chroma <= 0) {
      hue = 0
    } else if (max === r) {
      hue = ((g - b) / chroma) % 6
    } else if (max === g) {
      hue = 2 + (b - r) / chroma
    } else {
      hue = 4 + (r - g) / chroma
    }

    hue /= 6
    hue %= 1

    return [hue * 360, chroma * 100, grayscale * 100]
  }

  convert$1.hsl.hcg = function (hsl) {
    const s = hsl[1] / 100
    const l = hsl[2] / 100

    const c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l)

    let f = 0
    if (c < 1.0) {
      f = (l - 0.5 * c) / (1.0 - c)
    }

    return [hsl[0], c * 100, f * 100]
  }

  convert$1.hsv.hcg = function (hsv) {
    const s = hsv[1] / 100
    const v = hsv[2] / 100

    const c = s * v
    let f = 0

    if (c < 1.0) {
      f = (v - c) / (1 - c)
    }

    return [hsv[0], c * 100, f * 100]
  }

  convert$1.hcg.rgb = function (hcg) {
    const h = hcg[0] / 360
    const c = hcg[1] / 100
    const g = hcg[2] / 100

    if (c === 0.0) {
      return [g * 255, g * 255, g * 255]
    }

    const pure = [0, 0, 0]
    const hi = (h % 1) * 6
    const v = hi % 1
    const w = 1 - v
    let mg = 0

    /* eslint-disable max-statements-per-line */
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1
        pure[1] = v
        pure[2] = 0
        break
      case 1:
        pure[0] = w
        pure[1] = 1
        pure[2] = 0
        break
      case 2:
        pure[0] = 0
        pure[1] = 1
        pure[2] = v
        break
      case 3:
        pure[0] = 0
        pure[1] = w
        pure[2] = 1
        break
      case 4:
        pure[0] = v
        pure[1] = 0
        pure[2] = 1
        break
      default:
        pure[0] = 1
        pure[1] = 0
        pure[2] = w
    }
    /* eslint-enable max-statements-per-line */

    mg = (1.0 - c) * g

    return [(c * pure[0] + mg) * 255, (c * pure[1] + mg) * 255, (c * pure[2] + mg) * 255]
  }

  convert$1.hcg.hsv = function (hcg) {
    const c = hcg[1] / 100
    const g = hcg[2] / 100

    const v = c + g * (1.0 - c)
    let f = 0

    if (v > 0.0) {
      f = c / v
    }

    return [hcg[0], f * 100, v * 100]
  }

  convert$1.hcg.hsl = function (hcg) {
    const c = hcg[1] / 100
    const g = hcg[2] / 100

    const l = g * (1.0 - c) + 0.5 * c
    let s = 0

    if (l > 0.0 && l < 0.5) {
      s = c / (2 * l)
    } else if (l >= 0.5 && l < 1.0) {
      s = c / (2 * (1 - l))
    }

    return [hcg[0], s * 100, l * 100]
  }

  convert$1.hcg.hwb = function (hcg) {
    const c = hcg[1] / 100
    const g = hcg[2] / 100
    const v = c + g * (1.0 - c)
    return [hcg[0], (v - c) * 100, (1 - v) * 100]
  }

  convert$1.hwb.hcg = function (hwb) {
    const w = hwb[1] / 100
    const b = hwb[2] / 100
    const v = 1 - b
    const c = v - w
    let g = 0

    if (c < 1) {
      g = (v - c) / (1 - c)
    }

    return [hwb[0], c * 100, g * 100]
  }

  convert$1.apple.rgb = function (apple) {
    return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255]
  }

  convert$1.rgb.apple = function (rgb) {
    return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535]
  }

  convert$1.gray.rgb = function (args) {
    return [(args[0] / 100) * 255, (args[0] / 100) * 255, (args[0] / 100) * 255]
  }

  convert$1.gray.hsl = function (args) {
    return [0, 0, args[0]]
  }

  convert$1.gray.hsv = convert$1.gray.hsl

  convert$1.gray.hwb = function (gray) {
    return [0, 100, gray[0]]
  }

  convert$1.gray.cmyk = function (gray) {
    return [0, 0, 0, gray[0]]
  }

  convert$1.gray.lab = function (gray) {
    return [gray[0], 0, 0]
  }

  convert$1.gray.hex = function (gray) {
    const val = Math.round((gray[0] / 100) * 255) & 0xff
    const integer = (val << 16) + (val << 8) + val

    const string = integer.toString(16).toUpperCase()
    return '000000'.substring(string.length) + string
  }

  convert$1.rgb.gray = function (rgb) {
    const val = (rgb[0] + rgb[1] + rgb[2]) / 3
    return [(val / 255) * 100]
  }
  const conversions$1 = conversions$2

  /*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

  function buildGraph() {
    const graph = {}
    // https://jsperf.com/object-keys-vs-for-in-with-closure/3
    const models = Object.keys(conversions$1)

    for (let len = models.length, i = 0; i < len; i++) {
      graph[models[i]] = {
        // http://jsperf.com/1-vs-infinity
        // micro-opt, but this is simple.
        distance: -1,
        parent: null,
      }
    }

    return graph
  }

  // https://en.wikipedia.org/wiki/Breadth-first_search
  function deriveBFS(fromModel) {
    const graph = buildGraph()
    const queue = [fromModel] // Unshift -> queue -> pop

    graph[fromModel].distance = 0

    while (queue.length) {
      const current = queue.pop()
      const adjacents = Object.keys(conversions$1[current])

      for (let len = adjacents.length, i = 0; i < len; i++) {
        const adjacent = adjacents[i]
        const node = graph[adjacent]

        if (node.distance === -1) {
          node.distance = graph[current].distance + 1
          node.parent = current
          queue.unshift(adjacent)
        }
      }
    }

    return graph
  }

  function link(from, to) {
    return function (args) {
      return to(from(args))
    }
  }

  function wrapConversion(toModel, graph) {
    const path = [graph[toModel].parent, toModel]
    let fn = conversions$1[graph[toModel].parent][toModel]

    let cur = graph[toModel].parent
    while (graph[cur].parent) {
      path.unshift(graph[cur].parent)
      fn = link(conversions$1[graph[cur].parent][cur], fn)
      cur = graph[cur].parent
    }

    fn.conversion = path
    return fn
  }

  var route$1 = function (fromModel) {
    const graph = deriveBFS(fromModel)
    const conversion = {}

    const models = Object.keys(graph)
    for (let len = models.length, i = 0; i < len; i++) {
      const toModel = models[i]
      const node = graph[toModel]

      if (node.parent === null) {
        // No possible conversion, or this node is the source model.
        continue
      }

      conversion[toModel] = wrapConversion(toModel, graph)
    }

    return conversion
  }
  const conversions = conversions$2
  const route = route$1

  const convert = {}

  const models = Object.keys(conversions)

  function wrapRaw(fn) {
    const wrappedFn = function (...args) {
      const arg0 = args[0]
      if (arg0 === undefined || arg0 === null) {
        return arg0
      }

      if (arg0.length > 1) {
        args = arg0
      }

      return fn(args)
    }

    // Preserve .conversion property if there is one
    if ('conversion' in fn) {
      wrappedFn.conversion = fn.conversion
    }

    return wrappedFn
  }

  function wrapRounded(fn) {
    const wrappedFn = function (...args) {
      const arg0 = args[0]

      if (arg0 === undefined || arg0 === null) {
        return arg0
      }

      if (arg0.length > 1) {
        args = arg0
      }

      const result = fn(args)

      // We're assuming the result is an array here.
      // see notice in conversions.js; don't use box types
      // in conversion functions.
      if (typeof result === 'object') {
        for (let len = result.length, i = 0; i < len; i++) {
          result[i] = Math.round(result[i])
        }
      }

      return result
    }

    // Preserve .conversion property if there is one
    if ('conversion' in fn) {
      wrappedFn.conversion = fn.conversion
    }

    return wrappedFn
  }

  models.forEach((fromModel) => {
    convert[fromModel] = {}

    Object.defineProperty(convert[fromModel], 'channels', {
      value: conversions[fromModel].channels,
    })
    Object.defineProperty(convert[fromModel], 'labels', {
      value: conversions[fromModel].labels,
    })

    const routes = route(fromModel)
    const routeModels = Object.keys(routes)

    routeModels.forEach((toModel) => {
      const fn = routes[toModel]

      convert[fromModel][toModel] = wrapRounded(fn)
      convert[fromModel][toModel].raw = wrapRaw(fn)
    })
  })

  var colorConvert = convert
  ;(function (module) {
    const wrapAnsi16 =
      (fn, offset) =>
      (...args) => {
        const code = fn(...args)
        return `\u001B[${code + offset}m`
      }

    const wrapAnsi256 =
      (fn, offset) =>
      (...args) => {
        const code = fn(...args)
        return `\u001B[${38 + offset};5;${code}m`
      }

    const wrapAnsi16m =
      (fn, offset) =>
      (...args) => {
        const rgb = fn(...args)
        return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`
      }

    const ansi2ansi = (n) => n
    const rgb2rgb = (r, g, b) => [r, g, b]

    const setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get()

          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true,
          })

          return value
        },
        enumerable: true,
        configurable: true,
      })
    }

    /** @type {typeof import('color-convert')} */
    let colorConvert$1
    const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert$1 === undefined) {
        colorConvert$1 = colorConvert
      }

      const offset = isBackground ? 10 : 0
      const styles = {}

      for (const [sourceSpace, suite] of Object.entries(colorConvert$1)) {
        const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity, offset)
        } else if (typeof suite === 'object') {
          styles[name] = wrap(suite[targetSpace], offset)
        }
      }

      return styles
    }

    function assembleStyles() {
      const codes = new Map()
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29],
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],

          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39],
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],

          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49],
        },
      }

      // Alias bright black as gray (and grey)
      styles.color.gray = styles.color.blackBright
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright
      styles.color.grey = styles.color.blackBright
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright

      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\u001B[${style[0]}m`,
            close: `\u001B[${style[1]}m`,
          }

          group[styleName] = styles[styleName]

          codes.set(style[0], style[1])
        }

        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false,
        })
      }

      Object.defineProperty(styles, 'codes', {
        value: codes,
        enumerable: false,
      })

      styles.color.close = '\u001B[39m'
      styles.bgColor.close = '\u001B[49m'

      setLazyProperty(styles.color, 'ansi', () =>
        makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false),
      )
      setLazyProperty(styles.color, 'ansi256', () =>
        makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false),
      )
      setLazyProperty(styles.color, 'ansi16m', () =>
        makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false),
      )
      setLazyProperty(styles.bgColor, 'ansi', () =>
        makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true),
      )
      setLazyProperty(styles.bgColor, 'ansi256', () =>
        makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true),
      )
      setLazyProperty(styles.bgColor, 'ansi16m', () =>
        makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true),
      )

      return styles
    }

    // Make the export immutable
    Object.defineProperty(module, 'exports', {
      enumerable: true,
      get: assembleStyles,
    })
  })(ansiStyles$1)
  var global$1 =
    typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : {} // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
    throw new Error('setTimeout has not been defined')
  }
  function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined')
  }
  var cachedSetTimeout = defaultSetTimout
  var cachedClearTimeout = defaultClearTimeout
  if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout
  }
  if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout
  }

  function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
      //normal enviroments in sane situations
      return setTimeout(fun, 0)
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
      cachedSetTimeout = setTimeout
      return setTimeout(fun, 0)
    }
    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedSetTimeout(fun, 0)
    } catch (e) {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
        return cachedSetTimeout.call(null, fun, 0)
      } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
        return cachedSetTimeout.call(this, fun, 0)
      }
    }
  }
  function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
      //normal enviroments in sane situations
      return clearTimeout(marker)
    }
    // if clearTimeout wasn't available but was latter defined
    if (
      (cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) &&
      clearTimeout
    ) {
      cachedClearTimeout = clearTimeout
      return clearTimeout(marker)
    }
    try {
      // when when somebody has screwed with setTimeout but no I.E. maddness
      return cachedClearTimeout(marker)
    } catch (e) {
      try {
        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
        return cachedClearTimeout.call(null, marker)
      } catch (e) {
        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
        return cachedClearTimeout.call(this, marker)
      }
    }
  }
  var queue = []
  var draining = false
  var currentQueue
  var queueIndex = -1

  function cleanUpNextTick() {
    if (!draining || !currentQueue) {
      return
    }
    draining = false
    if (currentQueue.length) {
      queue = currentQueue.concat(queue)
    } else {
      queueIndex = -1
    }
    if (queue.length) {
      drainQueue()
    }
  }

  function drainQueue() {
    if (draining) {
      return
    }
    var timeout = runTimeout(cleanUpNextTick)
    draining = true

    var len = queue.length
    while (len) {
      currentQueue = queue
      queue = []
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run()
        }
      }
      queueIndex = -1
      len = queue.length
    }
    currentQueue = null
    draining = false
    runClearTimeout(timeout)
  }
  function nextTick(fun) {
    var args = new Array(arguments.length - 1)
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i]
      }
    }
    queue.push(new Item(fun, args))
    if (queue.length === 1 && !draining) {
      runTimeout(drainQueue)
    }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
    this.fun = fun
    this.array = array
  }
  Item.prototype.run = function () {
    this.fun.apply(null, this.array)
  }
  var title = 'browser'
  var platform = 'browser'
  var browser = true
  var env$1 = {}
  var argv = []
  var version = '' // empty string to avoid regexp issues
  var versions = {}
  var release = {}
  var config = {}

  function noop() {}

  var on = noop
  var addListener = noop
  var once = noop
  var off = noop
  var removeListener = noop
  var removeAllListeners = noop
  var emit = noop

  function binding(name) {
    throw new Error('process.binding is not supported')
  }

  function cwd() {
    return '/'
  }
  function chdir(dir) {
    throw new Error('process.chdir is not supported')
  }
  function umask() {
    return 0
  }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {}
  var performanceNow =
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function () {
      return new Date().getTime()
    }

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 1e-3
    var seconds = Math.floor(clocktime)
    var nanoseconds = Math.floor((clocktime % 1) * 1e9)
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0]
      nanoseconds = nanoseconds - previousTimestamp[1]
      if (nanoseconds < 0) {
        seconds--
        nanoseconds += 1e9
      }
    }
    return [seconds, nanoseconds]
  }

  var startTime = new Date()
  function uptime() {
    var currentTime = new Date()
    var dif = currentTime - startTime
    return dif / 1000
  }

  var browser$1 = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env$1,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime,
  }
  var hasFlag$1 = (flag, argv = browser$1.argv) => {
    const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--'
    const position = argv.indexOf(prefix + flag)
    const terminatorPosition = argv.indexOf('--')
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition)
  }
  const os = require$$0__default['default']
  const tty = require$$1__default['default']
  const hasFlag = hasFlag$1

  const { env } = browser$1

  let forceColor
  if (
    hasFlag('no-color') ||
    hasFlag('no-colors') ||
    hasFlag('color=false') ||
    hasFlag('color=never')
  ) {
    forceColor = 0
  } else if (
    hasFlag('color') ||
    hasFlag('colors') ||
    hasFlag('color=true') ||
    hasFlag('color=always')
  ) {
    forceColor = 1
  }

  if ('FORCE_COLOR' in env) {
    if (env.FORCE_COLOR === 'true') {
      forceColor = 1
    } else if (env.FORCE_COLOR === 'false') {
      forceColor = 0
    } else {
      forceColor =
        env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3)
    }
  }

  function translateLevel(level) {
    if (level === 0) {
      return false
    }

    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3,
    }
  }

  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0
    }

    if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
      return 3
    }

    if (hasFlag('color=256')) {
      return 2
    }

    if (haveStream && !streamIsTTY && forceColor === undefined) {
      return 0
    }

    const min = forceColor || 0

    if (env.TERM === 'dumb') {
      return min
    }

    if (browser$1.platform === 'win32') {
      // Windows 10 build 10586 is the first Windows release that supports 256 colors.
      // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
      const osRelease = os.release().split('.')
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2
      }

      return 1
    }

    if ('CI' in env) {
      if (
        [
          'TRAVIS',
          'CIRCLECI',
          'APPVEYOR',
          'GITLAB_CI',
          'GITHUB_ACTIONS',
          'BUILDKITE',
        ].some((sign) => sign in env) ||
        env.CI_NAME === 'codeship'
      ) {
        return 1
      }

      return min
    }

    if ('TEAMCITY_VERSION' in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    }

    if (env.COLORTERM === 'truecolor') {
      return 3
    }

    if ('TERM_PROGRAM' in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10)

      switch (env.TERM_PROGRAM) {
        case 'iTerm.app':
          return version >= 3 ? 3 : 2
        case 'Apple_Terminal':
          return 2
        // No default
      }
    }

    if (/-256(color)?$/i.test(env.TERM)) {
      return 2
    }

    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1
    }

    if ('COLORTERM' in env) {
      return 1
    }

    return min
  }

  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY)
    return translateLevel(level)
  }

  var supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2))),
  }
  const stringReplaceAll$1 = (string, substring, replacer) => {
    let index = string.indexOf(substring)
    if (index === -1) {
      return string
    }

    const substringLength = substring.length
    let endIndex = 0
    let returnValue = ''
    do {
      returnValue += string.substr(endIndex, index - endIndex) + substring + replacer
      endIndex = index + substringLength
      index = string.indexOf(substring, endIndex)
    } while (index !== -1)

    returnValue += string.substr(endIndex)
    return returnValue
  }

  const stringEncaseCRLFWithFirstIndex$1 = (string, prefix, postfix, index) => {
    let endIndex = 0
    let returnValue = ''
    do {
      const gotCR = string[index - 1] === '\r'
      returnValue +=
        string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) +
        prefix +
        (gotCR ? '\r\n' : '\n') +
        postfix
      endIndex = index + 1
      index = string.indexOf('\n', endIndex)
    } while (index !== -1)

    returnValue += string.substr(endIndex)
    return returnValue
  }

  var util = {
    stringReplaceAll: stringReplaceAll$1,
    stringEncaseCRLFWithFirstIndex: stringEncaseCRLFWithFirstIndex$1,
  }
  const TEMPLATE_REGEX =
    /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi
  const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g
  const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/
  const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi

  const ESCAPES = new Map([
    ['n', '\n'],
    ['r', '\r'],
    ['t', '\t'],
    ['b', '\b'],
    ['f', '\f'],
    ['v', '\v'],
    ['0', '\0'],
    ['\\', '\\'],
    ['e', '\u001B'],
    ['a', '\u0007'],
  ])

  function unescape(c) {
    const u = c[0] === 'u'
    const bracket = c[1] === '{'

    if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
      return String.fromCharCode(parseInt(c.slice(1), 16))
    }

    if (u && bracket) {
      return String.fromCodePoint(parseInt(c.slice(2, -1), 16))
    }

    return ESCAPES.get(c) || c
  }

  function parseArguments(name, arguments_) {
    const results = []
    const chunks = arguments_.trim().split(/\s*,\s*/g)
    let matches

    for (const chunk of chunks) {
      const number = Number(chunk)
      if (!Number.isNaN(number)) {
        results.push(number)
      } else if ((matches = chunk.match(STRING_REGEX))) {
        results.push(
          matches[2].replace(ESCAPE_REGEX, (m, escape, character) =>
            escape ? unescape(escape) : character,
          ),
        )
      } else {
        throw new Error(
          `Invalid Chalk template style argument: ${chunk} (in style '${name}')`,
        )
      }
    }

    return results
  }

  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0

    const results = []
    let matches

    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1]

      if (matches[2]) {
        const args = parseArguments(name, matches[2])
        results.push([name].concat(args))
      } else {
        results.push([name])
      }
    }

    return results
  }

  function buildStyle(chalk, styles) {
    const enabled = {}

    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1)
      }
    }

    let current = chalk
    for (const [styleName, styles] of Object.entries(enabled)) {
      if (!Array.isArray(styles)) {
        continue
      }

      if (!(styleName in current)) {
        throw new Error(`Unknown Chalk style: ${styleName}`)
      }

      current = styles.length > 0 ? current[styleName](...styles) : current[styleName]
    }

    return current
  }

  var templates = (chalk, temporary) => {
    const styles = []
    const chunks = []
    let chunk = []

    // eslint-disable-next-line max-params
    temporary.replace(
      TEMPLATE_REGEX,
      (m, escapeCharacter, inverse, style, close, character) => {
        if (escapeCharacter) {
          chunk.push(unescape(escapeCharacter))
        } else if (style) {
          const string = chunk.join('')
          chunk = []
          chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string))
          styles.push({ inverse, styles: parseStyle(style) })
        } else if (close) {
          if (styles.length === 0) {
            throw new Error('Found extraneous } in Chalk template literal')
          }

          chunks.push(buildStyle(chalk, styles)(chunk.join('')))
          chunk = []
          styles.pop()
        } else {
          chunk.push(character)
        }
      },
    )

    chunks.push(chunk.join(''))

    if (styles.length > 0) {
      const errMessage = `Chalk template literal is missing ${
        styles.length
      } closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`
      throw new Error(errMessage)
    }

    return chunks.join('')
  }
  const ansiStyles = ansiStyles$1.exports
  const { stdout: stdoutColor, stderr: stderrColor } = supportsColor_1
  const { stringReplaceAll, stringEncaseCRLFWithFirstIndex } = util

  const { isArray } = Array

  // `supportsColor.level` → `ansiStyles.color[name]` mapping
  const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m']

  const styles = Object.create(null)

  const applyOptions = (object, options = {}) => {
    if (
      options.level &&
      !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)
    ) {
      throw new Error('The `level` option should be an integer from 0 to 3')
    }

    // Detect level if not set manually
    const colorLevel = stdoutColor ? stdoutColor.level : 0
    object.level = options.level === undefined ? colorLevel : options.level
  }

  class ChalkClass {
    constructor(options) {
      // eslint-disable-next-line no-constructor-return
      return chalkFactory(options)
    }
  }

  const chalkFactory = (options) => {
    const chalk = {}
    applyOptions(chalk, options)

    chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_)

    Object.setPrototypeOf(chalk, Chalk.prototype)
    Object.setPrototypeOf(chalk.template, chalk)

    chalk.template.constructor = () => {
      throw new Error(
        '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.',
      )
    }

    chalk.template.Instance = ChalkClass

    return chalk.template
  }

  function Chalk(options) {
    return chalkFactory(options)
  }

  for (const [styleName, style] of Object.entries(ansiStyles)) {
    styles[styleName] = {
      get() {
        const builder = createBuilder(
          this,
          createStyler(style.open, style.close, this._styler),
          this._isEmpty,
        )
        Object.defineProperty(this, styleName, { value: builder })
        return builder
      },
    }
  }

  styles.visible = {
    get() {
      const builder = createBuilder(this, this._styler, true)
      Object.defineProperty(this, 'visible', { value: builder })
      return builder
    },
  }

  const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256']

  for (const model of usedModels) {
    styles[model] = {
      get() {
        const { level } = this
        return function (...arguments_) {
          const styler = createStyler(
            ansiStyles.color[levelMapping[level]][model](...arguments_),
            ansiStyles.color.close,
            this._styler,
          )
          return createBuilder(this, styler, this._isEmpty)
        }
      },
    }
  }

  for (const model of usedModels) {
    const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1)
    styles[bgModel] = {
      get() {
        const { level } = this
        return function (...arguments_) {
          const styler = createStyler(
            ansiStyles.bgColor[levelMapping[level]][model](...arguments_),
            ansiStyles.bgColor.close,
            this._styler,
          )
          return createBuilder(this, styler, this._isEmpty)
        }
      },
    }
  }

  const proto = Object.defineProperties(() => {}, {
    ...styles,
    level: {
      enumerable: true,
      get() {
        return this._generator.level
      },
      set(level) {
        this._generator.level = level
      },
    },
  })

  const createStyler = (open, close, parent) => {
    let openAll
    let closeAll
    if (parent === undefined) {
      openAll = open
      closeAll = close
    } else {
      openAll = parent.openAll + open
      closeAll = close + parent.closeAll
    }

    return {
      open,
      close,
      openAll,
      closeAll,
      parent,
    }
  }

  const createBuilder = (self, _styler, _isEmpty) => {
    const builder = (...arguments_) => {
      if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
        // Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
        return applyStyle(builder, chalkTag(builder, ...arguments_))
      }

      // Single argument is hot path, implicit coercion is faster than anything
      // eslint-disable-next-line no-implicit-coercion
      return applyStyle(
        builder,
        arguments_.length === 1 ? '' + arguments_[0] : arguments_.join(' '),
      )
    }

    // We alter the prototype because we must return a function, but there is
    // no way to create a function with a different prototype
    Object.setPrototypeOf(builder, proto)

    builder._generator = self
    builder._styler = _styler
    builder._isEmpty = _isEmpty

    return builder
  }

  const applyStyle = (self, string) => {
    if (self.level <= 0 || !string) {
      return self._isEmpty ? '' : string
    }

    let styler = self._styler

    if (styler === undefined) {
      return string
    }

    const { openAll, closeAll } = styler
    if (string.indexOf('\u001B') !== -1) {
      while (styler !== undefined) {
        // Replace any instances already present with a re-opening code
        // otherwise only the part of the string until said closing code
        // will be colored, and the rest will simply be 'plain'.
        string = stringReplaceAll(string, styler.close, styler.open)

        styler = styler.parent
      }
    }

    // We can move both next actions out of loop, because remaining actions in loop won't have
    // any/visible effect on parts we add here. Close the styling before a linebreak and reopen
    // after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
    const lfIndex = string.indexOf('\n')
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex)
    }

    return openAll + string + closeAll
  }

  let template
  const chalkTag = (chalk, ...strings) => {
    const [firstString] = strings

    if (!isArray(firstString) || !isArray(firstString.raw)) {
      // If chalk() was called by itself or with a string,
      // return the string itself as a string.
      return strings.join(' ')
    }

    const arguments_ = strings.slice(1)
    const parts = [firstString.raw[0]]

    for (let i = 1; i < firstString.length; i++) {
      parts.push(
        String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
        String(firstString.raw[i]),
      )
    }

    if (template === undefined) {
      template = templates
    }

    return template(chalk, parts.join(''))
  }

  Object.defineProperties(Chalk.prototype, styles)

  const chalk = Chalk() // eslint-disable-line new-cap
  chalk.supportsColor = stdoutColor
  chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 }) // eslint-disable-line new-cap
  chalk.stderr.supportsColor = stderrColor

  var source = chalk
  var loglevel = { exports: {} }
  /*
   * loglevel - https://github.com/pimterry/loglevel
   *
   * Copyright (c) 2013 Tim Perry
   * Licensed under the MIT license.
   */

  ;(function (module) {
    ;(function (root, definition) {
      if (module.exports) {
        module.exports = definition()
      } else {
        root.log = definition()
      }
    })(commonjsGlobal, function () {
      // Slightly dubious tricks to cut down minimized file size
      var noop = function () {}
      var undefinedType = 'undefined'
      var isIE =
        typeof window !== undefinedType &&
        typeof window.navigator !== undefinedType &&
        /Trident\/|MSIE /.test(window.navigator.userAgent)

      var logMethods = ['trace', 'debug', 'info', 'warn', 'error']

      // Cross-browser bind equivalent that works at least back to IE6
      function bindMethod(obj, methodName) {
        var method = obj[methodName]
        if (typeof method.bind === 'function') {
          return method.bind(obj)
        } else {
          try {
            return Function.prototype.bind.call(method, obj)
          } catch (e) {
            // Missing bind shim or IE8 + Modernizr, fallback to wrapping
            return function () {
              return Function.prototype.apply.apply(method, [obj, arguments])
            }
          }
        }
      }

      // Trace() doesn't print the message in IE, so for that case we need to wrap it
      function traceForIE() {
        if (console.log) {
          if (console.log.apply) {
            console.log.apply(console, arguments)
          } else {
            // In old IE, native console methods themselves don't have apply().
            Function.prototype.apply.apply(console.log, [console, arguments])
          }
        }
        if (console.trace) console.trace()
      }

      // Build the best logging method possible for this env
      // Wherever possible we want to bind, not wrap, to preserve stack traces
      function realMethod(methodName) {
        if (methodName === 'debug') {
          methodName = 'log'
        }

        if (typeof console === undefinedType) {
          return false // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
          return traceForIE
        } else if (console[methodName] !== undefined) {
          return bindMethod(console, methodName)
        } else if (console.log !== undefined) {
          return bindMethod(console, 'log')
        } else {
          return noop
        }
      }

      // These private functions always need `this` to be set properly

      function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
          var methodName = logMethods[i]
          this[methodName] =
            i < level ? noop : this.methodFactory(methodName, level, loggerName)
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug
      }

      // In old IE versions, the console isn't present until you first open it.
      // We build realMethod() replacements here that regenerate logging methods
      function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this, level, loggerName)
            this[methodName].apply(this, arguments)
          }
        }
      }

      // By default, we use closely bound real methods wherever possible, and
      // otherwise we wait for a console to appear, and then try again.
      function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return (
          realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments)
        )
      }

      function Logger(name, defaultLevel, factory) {
        var self = this
        var currentLevel
        defaultLevel = defaultLevel == null ? 'WARN' : defaultLevel

        var storageKey = 'loglevel'
        if (typeof name === 'string') {
          storageKey += ':' + name
        } else if (typeof name === 'symbol') {
          storageKey = undefined
        }

        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase()

          if (typeof window === undefinedType || !storageKey) return

          // Use localStorage if available
          try {
            window.localStorage[storageKey] = levelName
            return
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
            window.document.cookie =
              encodeURIComponent(storageKey) + '=' + levelName + ';'
          } catch (ignore) {}
        }

        function getPersistedLevel() {
          var storedLevel

          if (typeof window === undefinedType || !storageKey) return

          try {
            storedLevel = window.localStorage[storageKey]
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie
              var location = cookie.indexOf(encodeURIComponent(storageKey) + '=')
              if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1]
              }
            } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
            storedLevel = undefined
          }

          return storedLevel
        }

        function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey) return

          // Use localStorage if available
          try {
            window.localStorage.removeItem(storageKey)
            return
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
            window.document.cookie =
              encodeURIComponent(storageKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC'
          } catch (ignore) {}
        }

        /*
         *
         * Public logger API - see https://github.com/pimterry/loglevel for details
         *
         */

        self.name = name

        self.levels = { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, SILENT: 5 }

        self.methodFactory = factory || defaultMethodFactory

        self.getLevel = function () {
          return currentLevel
        }

        self.setLevel = function (level, persist) {
          if (
            typeof level === 'string' &&
            self.levels[level.toUpperCase()] !== undefined
          ) {
            level = self.levels[level.toUpperCase()]
          }
          if (typeof level === 'number' && level >= 0 && level <= self.levels.SILENT) {
            currentLevel = level
            if (persist !== false) {
              // defaults to true
              persistLevelIfPossible(level)
            }
            replaceLoggingMethods.call(self, level, name)
            if (typeof console === undefinedType && level < self.levels.SILENT) {
              return 'No console available for logging'
            }
          } else {
            throw 'log.setLevel() called with invalid level: ' + level
          }
        }

        self.setDefaultLevel = function (level) {
          defaultLevel = level
          if (!getPersistedLevel()) {
            self.setLevel(level, false)
          }
        }

        self.resetLevel = function () {
          self.setLevel(defaultLevel, false)
          clearPersistedLevel()
        }

        self.enableAll = function (persist) {
          self.setLevel(self.levels.TRACE, persist)
        }

        self.disableAll = function (persist) {
          self.setLevel(self.levels.SILENT, persist)
        }

        // Initialize with the right level
        var initialLevel = getPersistedLevel()
        if (initialLevel == null) {
          initialLevel = defaultLevel
        }
        self.setLevel(initialLevel, false)
      }

      /*
       *
       * Top-level API
       *
       */

      var defaultLogger = new Logger()

      var _loggersByName = {}
      defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== 'symbol' && typeof name !== 'string') || name === '') {
          throw new TypeError('You must supply a name when creating a logger.')
        }

        var logger = _loggersByName[name]
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name,
            defaultLogger.getLevel(),
            defaultLogger.methodFactory,
          )
        }
        return logger
      }

      // Grab the current global log variable in case of overwrite
      var _log = typeof window !== undefinedType ? window.log : undefined
      defaultLogger.noConflict = function () {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log
        }

        return defaultLogger
      }

      defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName
      }

      // ES6 default export, for compatibility
      defaultLogger['default'] = defaultLogger

      return defaultLogger
    })
  })(loglevel)

  var log$1 = loglevel.exports
  log$1.setDefaultLevel(log$1.levels.TRACE)
  log$1.setLevel(log$1.levels.TRACE)
  // Den Level
  // Datum Uhrzeit
  // Das File angeben
  // Browser und cmdline (Node)
  // Zeit seit letztem Log
  // get Logger / vs static
  const timestamp = () => format(new Date(), 'Pp,SSS', { locale: de })
  function getPattern(lvl) {
    return `${timestamp()} ${lvl}`
  }
  function info(...msg) {
    log$1.info(getPattern('INFO '), msg.join())
  }
  function warn(...msg) {
    log$1.warn(source.yellow(getPattern('WARN '), msg))
  }
  function error(...msg) {
    log$1.error(source.redBright(getPattern('ERROR'), msg))
  }
  const err = error
  function debug(...msg) {
    log$1.debug(source.cyan(getPattern('DEBUG'), msg))
  }
  function trace(...msg) {
    log$1.trace(source.blueBright(getPattern(''), msg))
  }
  var log = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    info: info,
    warn: warn,
    debug: debug,
    trace: trace,
    error: error,
    err: err,
  })
  exports.ageInYears = ageInYears
  exports.dateValidator = dateValidator
  exports.formatDay = formatDay
  exports.formatDayTime = formatDayTime
  exports.log = log
  Object.defineProperty(exports, '__esModule', { value: true })
}) //# sourceMappingURL=tools.umd.js.map
