import {
  CHANGELOG_FOLLOWED,
  CHANGELOG_UNFOLLOWED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  follow(changelog_id) {
    Dispatcher.dispatch({
      type: CHANGELOG_FOLLOWED
    })

    analytics.track('Followed Changelog', {
      changelog: changelog_id
    })

    api.post(`changelogs/${changelog_id}/follow`)
  },

  unfollow(changelog_id) {
    Dispatcher.dispatch({
      type: CHANGELOG_UNFOLLOWED
    })

    analytics.track('Unfollowed Changelog', {
      changelog: changelog_id
    })

    api.post(`changelogs/${changelog_id}/unfollow`)
  }

}
