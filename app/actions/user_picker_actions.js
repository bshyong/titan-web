import {
  USER_PICKER_SET_HIGHLIGHT_INDEX,
  USER_PICKER_USERS_FETCHED
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  fetchUsers(s) {
    api.get(`users/search?s=${s}`).then((users) => {
      Dispatcher.dispatch({
        type: USER_PICKER_USERS_FETCHED,
        users: users
      })
    })
  },

  setHighlightIndex(i) {
    Dispatcher.dispatch({
      type: USER_PICKER_SET_HIGHLIGHT_INDEX,
      index: i
    })
  }
}
