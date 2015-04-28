import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import SessionStore from 'stores/session_store'
import RouterContainer from 'lib/router_container'

export default {

  fetchAll(changelog_id, params) {
    request({
      url: `${API_URL}/changelogs/${changelog_id}/highlights`,
      method: 'get',
      error: (err) => {},
      success: (resp) => {
        Dispatcher.dispatch({
          type: 'HIGHLIGHTS_FETCHED',
          highlights: resp
        })
      }
    })
  },

  ignore(highlight) {
    Dispatcher.dispatch({
      type: 'HIGHLIGHT_IGNORED',
      highlight: highlight
    })

    request({
      url: `${API_URL}/${highlight.url}/archive`,
      method: 'POST'
    })
  },

  use(highlight) {
    Dispatcher.dispatch({
      type: 'HIGHLIGHT_USED',
      highlight: highlight
    })
    RouterContainer.get().transitionTo('new', {changelogId: 'assembly'})
  }

}
