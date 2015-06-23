import {
  CHANGELOG_CURRENT_CLEARED,
  CHANGELOG_DESTROYED,
  CHANGELOG_FETCHED,
  CHANGELOG_MEMBERSHIPS_FETCHED,
  CHANGELOG_UPDATE_FAILED,
  CHANGELOG_UPDATED,
  CHANGELOG_UPDATING,
  CHANGELOGS_ALL_FETCHED,
} from '../constants'
import {List} from 'immutable'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import paramsFor from '../lib/paramsFor'
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

  select(changelog_id, callback) {
    api.get(`changelogs/${changelog_id}`).
      then(resp => {
        if (callback) {
          callback(resp)
        }
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
      })
  },

  change(changelog){
    Dispatcher.dispatch({
      type: CHANGELOG_CHANGED,
      changelog: changelog
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
    Dispatcher.dispatch({
      type: CHANGELOG_UPDATING,
      changelogId: id,
      params: params
    })

    api.put(`changelogs/${id}`, params).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_UPDATED,
          changelog: resp
        })
      }).catch(errors => {
        Dispatcher.dispatch({
          type: CHANGELOG_UPDATE_FAILED,
          changelogId: id,
          params: params,
          errors: errors
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
