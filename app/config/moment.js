import moment from 'moment'

moment.locale('en-short', {
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
      s:  "now",
      m:  "~1m",
      mm: "%dm",
      h:  "~1h",
      hh: "%dh",
      d:  "~1d",
      dd: "%dd",
      M:  "~1mo",
      MM: "%dm",
      y:  "~1y",
      yy: "%dy"
  }
})

moment.locale('en', {
  calendar : {
    lastDay : '[Yesterday]',
    sameDay : '[Today]',
    nextDay : '[Tomorrow]',
    lastWeek : 'dddd',
    nextWeek : 'dddd [at]',
    sameElse : 'LL'
  },
})

moment.createFromInputFallback = function(config) {
  // https://github.com/moment/moment/issues/1407
  config._d = new Date(config._i)
}

export default moment
