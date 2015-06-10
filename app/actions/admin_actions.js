import {
  ADMIN_DATA_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  AdminDataFetched() {
    Dispatcher.dispatch({
      type: ADMIN_DATA_FETCHED
    })
    api.get(`admin`).then(resp => {
      Dispatcher.dispatch({
        type: ADMIN_DATA_FETCHED,
        changelogs: resp
      })
    })
  }
}
