import {
  CHANGELOG_GROUPS_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  fetchAll(changelog_id) {
    api.get(`changelogs/${changelog_id}/groups`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_GROUPS_FETCHED,
          groups: resp
        })
      })
  },
}
