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

    api.post(`changelogs/${changelog_id}/follow`)
  },

  unfollow(changelog_id) {
    Dispatcher.dispatch({
      type: 'CHANGELOG_UNFOLLOWED'
    })

    api.post(`changelogs/${changelog_id}/unfollow`)
  }

}
