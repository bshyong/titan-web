import moment from 'moment'

moment.locale('en', {
  calendar : {
    lastDay : '[Yesterday]',
    sameDay : '[Today]',
    nextDay : '[Tomorrow]',
    lastWeek : 'dddd',
    nextWeek : 'dddd [at]',
    sameElse : 'LL'
  },
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s:  "seconds",
      m:  "a minute",
      mm: "%dm",
      h:  "an hour",
      hh: "%dh",
      d:  "a day",
      dd: "%dd",
      M:  "a month",
      MM: "%dm",
      y:  "a year",
      yy: "%dy"
  }
})
