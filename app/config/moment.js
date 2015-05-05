import moment from 'moment'

moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[Last] dddd',
        nextWeek : 'dddd [at]',
        sameElse : 'LL'
    }
})
