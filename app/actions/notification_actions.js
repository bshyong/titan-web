import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING } from 'constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  fetchAll() {
    console.log('fetching')
    Dispatcher.dispatch({
      type: NOTIFICATIONS_FETCHING
    })

    api.get(`user/activity`).then(resp => {
      console.log('fetched')
      Dispatcher.dispatch({
        type: NOTIFICATIONS_FETCHED,
        notifications: resp
      })
    })
  }
}
