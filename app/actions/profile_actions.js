import {
  PROFILE_FETCHED,
  PROFILE_STORIES_FETCHED,
  PROFILE_UPDATED,
  PROFILE_UPDATE_FAILED,
  PROFILE_UPDATING,
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
        profile: profile,
      })
    })
  },

  fetchStories(userId, page=1, per=10) {
    api.get(`users/${userId}/stories?page=${page}&per=${per}`).then(stories => {
      Dispatcher.dispatch({
        type: PROFILE_STORIES_FETCHED,
        stories: stories,
        page: page,
        moreAvailable: stories.length === per
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
