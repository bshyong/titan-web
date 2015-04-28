import { CHANGELOG_FETCHED, RESOURCE_NOT_FOUND, RESOURCE_FOUND } from 'constants'

import Dispatcher from '../lib/dispatcher'
import request from 'reqwest'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

export default {
  select(changelog_id) {
    request({
      url: `${API_URL}/changelogs/${changelog_id}`,
      method: 'get',
      error: (err) => {
        if (err.status == 404) {
          Dispatcher.dispatch({ type: RESOURCE_NOT_FOUND })
        }
      },
      success: (resp) => {
        Dispatcher.dispatch({ type: RESOURCE_FOUND })
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
      }
    })
  }
}
