import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetch(userId) {
    api.get(`users/${userId}/profile`).then(resp => {
      Dispatcher.dispatch({
        type: 'USER_FETCHED',
        user: resp
      })
    })
  },

  updateBlurb(userId, blurb) {
    api.post(`users/${userId}/profile`, {
      blurb: blurb
    })
  }

}
