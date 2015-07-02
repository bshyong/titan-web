import * as c from '../constants'
import Dispatcher from 'lib/dispatcher'
import { Map, List } from 'immutable'

const initialState = {
  canCreate: false,
  fields: Map({name: '', slug: '', is_members_only: false}),
  memberships: List()
}

export default function newChangelog(state = initialState, action) {
  switch(action.type) {
    case c.CHANGELOG_FETCHED:
      // TODO: remove once reduxed
      Dispatcher.dispatch(action)

      return initialState

    case c.CHANGELOG_CREATING:
      return {
        ...state,
        errors: null,
        updating: true,
        successful: null,
        isDirty: false
      }
    case c.CHANGELOG_CREATE_FAILED:
      return {
        ...state,
        updating: false,
        updateSuccessful: false,
        errors: action.errors
      }
    case c.CHANGELOG_FORM_CHANGED:
      let fields = state.fields.set(action.field, action.value)
      if (action.field === 'name') {
        fields = fields.set('slug', sanitizeSlug(action.value))
      }
      return {
        ...state,
        fields: fields,
        isDirty: true,
        canCreate: isValid(fields)
      }

    default:
      return state
  }
}

function present(val) {
  return val && val !== ''
}

function isValid(fields) {
  return present(fields.get('name')) && present(fields.get('slug'))
}

function sanitizeSlug(value) {
  value = value.toLowerCase()

  var from = "åàáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  var to   = "aaaaaeeeeiiiioooouuuunc------"
  for (var i=0, l=from.length ; i<l ; i++) {
    value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  value = value.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')

  return value
}
