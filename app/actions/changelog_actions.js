import {
  CHANGELOGS_ALL_FETCHED,
  CHANGELOG_CURRENT_CLEARED,
  CHANGELOG_DESTROYED,
  CHANGELOG_FETCHED,
  CHANGELOG_MEMBERSHIPS_FETCHED,
  CHANGELOG_UPDATED,
  CHANGELOGS_ALL_FETCHED,
} from '../constants'
import {List} from 'immutable'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import segment from '../lib/segment'

export default {

  fetchAll() {
    api.get(`changelogs`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOGS_ALL_FETCHED,
          changelogs: resp
        })
      })
  },

  select(changelog_id) {
    api.get(`changelogs/${changelog_id}`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
      })
  },

  clearCurrent() {
    Dispatcher.dispatch({
      type: CHANGELOG_CURRENT_CLEARED
    })
  },

  fetchMemberships(changelogId) {
    api.get(`changelogs/${changelogId}/memberships`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_MEMBERSHIPS_FETCHED,
          memberships: List(resp)
        })
      })
  },

  update(id, params) {
    api.put(`changelogs/${id}`, params).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_UPDATED,
          changelog: resp
        })
      })
  },

  destroy(id) {
    api.delete(`changelogs/${id}`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_DESTROYED,
          changelog: resp
        })
        RouterContainer.get().transitionTo('dashboard')
      })
  }
}
