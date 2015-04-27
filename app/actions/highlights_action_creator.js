import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import SessionStore from 'stores/session_store'

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

}