import {
  PROFILE_FETCHED,
  PROFILE_UPDATED,
  PROFILE_UPDATING,
  PROFILE_UPDATE_FAILED
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {

  fetch(userId=null) {
    let url = `user/profile`
    if (userId) {
      url = `users/${userId}/profile`
    }
    api.get(url).then(profile => {
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
  },

  update(change) {
    Dispatcher.dispatch({
      type: PROFILE_UPDATING
    })

    api.put(`user/profile`, change).then(resp => {
      Dispatcher.dispatch({
        type: PROFILE_UPDATED,
        user: resp
      })
    }).catch(resp => {
      Dispatcher.dispatch({
        type: PROFILE_UPDATE_FAILED,
        errors: resp
      })
    })
  }
}
