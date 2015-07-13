import {
  SIGNUP_PAGE_FORM_CHANGED
} from 'constants'

export function changeForm(Form) {
  return {
    type: SIGNUP_PAGE_FORM_CHANGED,
    Form: Form
  }
}
