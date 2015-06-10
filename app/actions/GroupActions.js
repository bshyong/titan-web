import {
  CHANGELOG_GROUPS_FETCHED,
  GROUP_DONE,
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

  done(id, date = new Date()) {
    api.put(`groups/${id}`, {done_at: date})
    Dispatcher.dispatch({type: GROUP_DONE, groupId: id})
  }
}
