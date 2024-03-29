import {
  AUTHENTICATION_FORM_CHANGED,
  AUTHENTICATION_FORM_ERROR,
  AUTHENTICATION_FORM_ERROR_DISMISSED,
  AUTHENTICATION_FORM_FORM_CHANGED,
  AUTHENTICATION_FORM_SHOWN,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import api from 'lib/api'
import SessionActions from 'actions/SessionActions'

export function change(formContent) {
  return {
    type: AUTHENTICATION_FORM_CHANGED,
    formContent: formContent,
  }
}

export function dismissError() {
  return {
    type: AUTHENTICATION_FORM_ERROR_DISMISSED,
  }
}

export function changeForm(formState) {
  return dispatch => {
    dispatch({
      type: SIGNIN_SCRIM_SHOWN,
    })

    dispatch({
      type: AUTHENTICATION_FORM_FORM_CHANGED,
      formState: formState,
    })
  }
}

export function show() {
  return {
    type: AUTHENTICATION_FORM_SHOWN,
  }
}

export function submit(path, data) {
  return (dispatch) => {
    return api.post(path, data).then(resp => {
      SessionActions.signinFromToken(resp.token)
      window.location = data.redirectTo || '/'
    }).catch(error => {
      console.log(error)
      dispatch({
        type: AUTHENTICATION_FORM_ERROR,
        error: error,
      })
    })
  }
}
