import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'

export default {

  fetchAll(changelog_id) {
    api.get(`changelogs/${changelog_id}/followers`).then(resp => {
      Dispatcher.dispatch({
        type: 'CHANGELOG_FOLLOWERS_FETCHED',
        followers: resp
      })
    })
  },

  follow(changelog_id) {
    Dispatcher.dispatch({
      type: 'CHANGELOG_FOLLOWED'
    })

    analytics.track('Followed Changelog', {
      changelog: changelog_id
    })

    api.post(`changelogs/${changelog_id}/follow`)
  },

  unfollow(changelog_id) {
    Dispatcher.dispatch({
      type: 'CHANGELOG_UNFOLLOWED'
    })

    analytics.track('Unfollowed Changelog', {
      changelog: changelog_id
    })

    api.post(`changelogs/${changelog_id}/unfollow`)
  }

}
