import {
  HIGHLIGHTS_FETCHED,
  HIGHLIGHT_IGNORED,
  HIGHLIGHT_USED
} from '../constants'
import {List} from 'immutable'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import SessionStore from '../stores/session_store'
import RouterContainer from '../lib/router_container'

export default {

  fetchAll(changelog_id, page=1, per=25) {
    api.get(`changelogs/${changelog_id}/highlights?page=${page}&per=${per}`).then(resp => {
      var highlights = List(resp)

      Dispatcher.dispatch({
        type: HIGHLIGHTS_FETCHED,
        highlights: highlights,
        page: page,
        moreAvailable: highlights.size == per
      })
    })
  },

  ignore(highlight) {
    Dispatcher.dispatch({
      type: HIGHLIGHT_IGNORED,
      highlight: highlight
    })

    // calling .substr() to remove the initial `/`
    api.post(`${highlight.url.substr(1)}/archive`)
  },

  use(highlight) {
    Dispatcher.dispatch({
      type: HIGHLIGHT_USED,
      highlight: highlight
    })

    // calling .substr() to remove the initial `/`
    api.post(`${highlight.url.substr(1)}/used`)

    RouterContainer.get().transitionTo('new', {changelogId: 'assembly'}, {highlight: highlight.id})
  }

}
