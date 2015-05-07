import moment from 'moment'

moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : 'dddd',
        nextWeek : 'dddd [at]',
        sameElse : 'LL'
    }
})
