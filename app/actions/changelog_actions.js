import { CHANGELOG_FETCHED, RESOURCE_NOT_FOUND, RESOURCE_FOUND } from 'constants'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'

export default {
  select(changelog_id) {
    api.get(`changelogs/${changelog_id}`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
      })
  }
}
