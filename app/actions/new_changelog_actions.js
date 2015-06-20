import {
  ANALYTICS_CHANGELOG_CREATED,
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CREATING,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
  CHANGELOG_FORM_FOCUSED,
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

  focusField(field) {
    Dispatcher.dispatch({
      type: CHANGELOG_FORM_FOCUSED,
      field: field
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
