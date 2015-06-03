import { PROFILE_FETCHED } from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetch(userId) {
    api.get(`users/${userId}/profile`).then(profile => {
      Dispatcher.dispatch({
        type: PROFILE_FETCHED,
        profile: profile
      })
    })
  },

  updateBlurb(userId, blurb) {
    api.post(`users/${userId}/profile`, {
      blurb: blurb
    })
  }

}
