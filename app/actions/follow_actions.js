import {
  CHANGELOG_FOLLOWED,
  CHANGELOG_UNFOLLOWED,
  ANALYTICS_FOLLOWED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import segment from '../lib/segment'

export default {
  follow(changelog_id) {
    Dispatcher.dispatch({
      type: CHANGELOG_FOLLOWED
    })

    segment.track(ANALYTICS_FOLLOWED, {
      type: 'changelog',
      id: changelog_id
    })

    api.post(`changelogs/${changelog_id}/follow`)
  },

  unfollow(changelog_id) {
    Dispatcher.dispatch({
      type: CHANGELOG_UNFOLLOWED
    })

    api.post(`changelogs/${changelog_id}/unfollow`)
  }

}
