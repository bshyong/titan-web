import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'
import SessionStore from 'stores/session_store'
import RouterContainer from 'lib/router_container'

export default {

  fetchAll(changelog_id, params) {
    api.get(`changelogs/${changelog_id}/highlights`).then(resp => {
      Dispatcher.dispatch({
        type: 'HIGHLIGHTS_FETCHED',
        highlights: resp
      })
    })
  },

  ignore(highlight) {
    Dispatcher.dispatch({
      type: 'HIGHLIGHT_IGNORED',
      highlight: highlight
    })

    api.post(`${highlight.url}/archive`)
  },

  use(highlight) {
    Dispatcher.dispatch({
      type: 'HIGHLIGHT_USED',
      highlight: highlight
    })
    api.post(`${highlight.url}/used`)

    RouterContainer.get().transitionTo('new', {changelogId: 'assembly'})
  }

}
