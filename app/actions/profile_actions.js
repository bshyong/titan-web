import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'

export default {

  fetch(username) {
    api.get(`users/${username}/profile`).then(resp => {
      Dispatcher.dispatch({
        type: 'USER_FETCHED',
        user: resp
      })
    })
  }
}
