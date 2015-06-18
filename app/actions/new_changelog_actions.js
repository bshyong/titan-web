import {
  ANALYTICS_CHANGELOG_CREATED,
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
  CHANGELOG_CREATING,
} from '../constants'
import {List} from 'immutable'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import segment from '../lib/segment'

export default {

  create(name, tagline, slug, user_id, website, membersOnly, successCallback=(() => {})) {
    Dispatcher.dispatch({
      type: CHANGELOG_CREATING,
      changelog: resp
    })

    api.post(`changelogs`, {name: name, tagline: tagline, slug: slug, user_id: user_id, homepage: website, is_members_only: membersOnly}).
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

  formChange(field, value) {
    Dispatcher.dispatch({
      type: CHANGELOG_FORM_CHANGED,
      field: field,
      value: value
    })
  }

}
