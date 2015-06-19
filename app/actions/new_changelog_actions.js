import {
  ANALYTICS_CHANGELOG_CREATED,
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
  CHANGELOG_CREATING,
  MEMBERSHIP_UPDATED
} from '../constants'
import {List} from 'immutable'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import segment from '../lib/segment'
import NewChangelogStore from '../stores/new_changelog_store'

export default {
  create(successCallback=(() => {})) {
    const changelog = NewChangelogStore.changelog

    Dispatcher.dispatch({
      type: CHANGELOG_CREATING
    })

    api.post(`changelogs`, changelog).
      then(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_FETCHED,
          changelog: resp
        })
        segment.track(ANALYTICS_CHANGELOG_CREATED, {
          changelogId: resp.slug
        })

        successCallback()
      }).catch(resp => {
        Dispatcher.dispatch({
          type: CHANGELOG_CREATE_FAILED,
          errors: resp
        })
      })
  },

  fetchMemberships() {
    const changelog = NewChangelogStore.changelog
    api.get('changelogs/${changelogId}/memberships').
      then(resp => {
        Dispatcher.dispatch({
          type: MEMBERSHIP_UPDATED,
          memberships: Map(resp)
        })
      })
  },

  formChange(field, value) {
    Dispatcher.dispatch({
      type: CHANGELOG_FORM_CHANGED,
      field: field,
      value: value
    })
  }

}
