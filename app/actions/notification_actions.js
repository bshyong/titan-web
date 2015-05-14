import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  fetchAll() {
    api.get(`user/activity`).then(resp => {
      Dispatcher.dispatch({
        type: 'READ_RECEIPTS_FETCHED',
        readReceipts: resp
      })
    })
  }
}
