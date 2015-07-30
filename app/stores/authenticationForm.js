import {
  AUTHENTICATION_FORM_CHANGED,
  AUTHENTICATION_FORM_ERROR,
  AUTHENTICATION_FORM_ERROR_DISMISSED,
  AUTHENTICATION_FORM_FORM_CHANGED,
  AUTHENTICATION_FORM_HIDDEN,
  AUTHENTICATION_FORM_SHOWN
} from 'constants'
import { Map } from 'immutable'

const initialState = Map({
  closeable: true,
  error: null,
  formComponent: 'signup',
  formContent: Map({
    email: '',
    password: '',
    redirectTo: '',
    username: '',
  }),
  shown: false,
})

export default function authenticationForm(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_FORM_CHANGED:
      return state.mergeIn(['formContent'], action.formContent)
    case AUTHENTICATION_FORM_ERROR:
      return state.set('error', action.error)
    case AUTHENTICATION_FORM_ERROR_DISMISSED:
      return state.delete('error')
    case AUTHENTICATION_FORM_FORM_CHANGED:
      return state.merge(action.formState)
    case AUTHENTICATION_FORM_HIDDEN:
      return state.set('shown', false)
    case AUTHENTICATION_FORM_SHOWN:
      return state.set('shown', true)
    default:
      return state
  }
}
