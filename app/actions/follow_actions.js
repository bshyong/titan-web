import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'

export default {

  fetchAll(changelog) {
    api.get(`${changelog.url}/followers`).then(resp => {
      Dispatcher.dispatch({
        type: 'CHANGELOG_FOLLOWERS_FETCHED',
        followers: resp
      })
    })
  },

  follow(changelog) {
    Dispatcher.dispatch({
      type: 'CHANGELOG_FOLLOWED'
    })

    api.post(`${changelog.url}/follow`)
  },

  unfollow(changelog) {
    Dispatcher.dispatch({
      type: 'CHANGELOG_UNFOLLOWED'
    })

    api.post(`${changelog.url}/unfollow`)
  }

}
