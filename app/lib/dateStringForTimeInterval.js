import moment from '../config/moment'

export default (date, interval) => {
  switch(interval) {
    case 'month':
      return moment(date).format('MMMM YYYY')
    case 'day':
      return date.calendar()
    case 'week':
      const start_date = moment(date)
      const end_date = moment(date).add(1, 'weeks')
      return `${start_date.format('MMMM D, YYYY')} - ${end_date.format('MMMM D, YYYY')}`
    default:
      return date.format('MMMM D, YYYY')
  }
}
