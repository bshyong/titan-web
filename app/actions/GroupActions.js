import {
  GROUP_DONE,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  done(id, date = new Date()) {
    api.put(`groups/${id}`, {done_at: date})
    Dispatcher.dispatch({type: GROUP_DONE, groupId: id})
  }
}
