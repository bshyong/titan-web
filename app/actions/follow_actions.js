import {
  ANALYTICS_FOLLOWED,
  CHANGELOG_FOLLOWED,
  CHANGELOG_UNFOLLOWED,
  FOLLOWINGS_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import segment from '../lib/segment'

export default {

  fetchFollowing(userId) {
    api.get(`users/${userId}/following`).then((changelogs) => {
      Dispatcher.dispatch({
        type: FOLLOWINGS_FETCHED,
        changelogs: changelogs
      })
    })
  },

  follow(changelogId) {
    Dispatcher.dispatch({
      type: CHANGELOG_FOLLOWED
    })

    segment.track(ANALYTICS_FOLLOWED, {
      type: 'changelog',
      id: changelogId
    })

    api.post(`changelogs/${changelogId}/follow`)
  },

  unfollow(changelog_id) {
    Dispatcher.dispatch({
      type: CHANGELOG_UNFOLLOWED
    })

    api.post(`changelogs/${changelog_id}/unfollow`)
  }

}
