import {
  SIGNUP_PAGE_FORM_CHANGED
} from 'constants'

const initialState = {
  Form: null
}

export default function signupPage(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_PAGE_FORM_CHANGED:
      return { Form: action.Form }
    default:
      return state
  }
}
