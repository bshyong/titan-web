import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetch(username) {
    api.get(`users/${username}/profile`).then(resp => {
      Dispatcher.dispatch({
        type: 'USER_FETCHED',
        user: resp
      })
    })
  },

  update_blurb(username, blurb) {
    api.post(`users/${username}/profile`, {username: username, blurb: blurb})
  }

}
