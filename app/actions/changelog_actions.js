import {
  CHANGELOGS_ALL_FETCHED,
  CHANGELOG_CREATE_FAILED,
  CHANGELOGS_ALL_FETCHED,
  CHANGELOG_FETCHED,
  CHANGELOG_MEMBERSHIPS_FETCHED,
  CHANGELOG_SHOW_ALL,
  CHANGELOG_TIME_CHANGED,
} from '../constants'
import {List} from 'immutable'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'

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

  fetchMemberships(changelogId) {
    api.get(`changelogs/${changelogId}/memberships`).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_MEMBERSHIPS_FETCHED,
          memberships: List(resp)
        })
      })
  },

  changeTimeInterval(timeInterval) {
    Dispatcher.dispatch({
      type: CHANGELOG_TIME_CHANGED,
      timeInterval: timeInterval
    })
  },

  changeTimeShown(timeShown) {
    Dispatcher.dispatch({
      type: CHANGELOG_SHOW_ALL,
      timeShown: timeShown
    })
  },

  create(name, tagline, slug) {
    api.post(`changelogs`, {name: name, tagline: tagline, slug: slug}).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
        RouterContainer.get().transitionTo('changelog', {changelogId: resp.slug})
      }).catch(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_CREATE_FAILED,
          errors: resp
        })
      })
  }

}
