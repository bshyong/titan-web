import moment from 'moment'

const defaults = {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd [at]',
    sameElse: 'LL',
  },
}

moment.locale('en-short', {
  ...defaults,
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "now",
    m: "~1m",
    mm: "%dm",
    h: "~1h",
    hh: "%dh",
    d: "~1d",
    dd: "%dd",
    M: "~1mo",
    MM: "%dm",
    y: "~1y",
    yy: "%dy",
  },
})

moment.locale('en', {
  ...defaults,
})

moment.locale('admin', {
  ...defaults,
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "now",
    m: "min",
    mm: "%d min",
    h: "1 hr",
    hh: "%d hrs",
    d: "1 day",
    dd: "%d days",
    M: "1 mo",
    MM: "%d mos",
    y: "1 yr",
    yy: "%d yrs",
  },
})

moment.createFromInputFallback = function(config) {
  // https://github.com/moment/moment/issues/1407
  config._d = new Date(config._i)
}

export default moment
