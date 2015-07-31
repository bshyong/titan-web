import {
  PASSWORD_RESET_TOKEN_CONFIRMED,
  PASSWORD_RESET_TOKEN_FAILED,
  PASSWORD_RESET_TOKEN_REQUESTED,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'

export default function passwordResetForm(state = {}, action) {
  switch (action.type) {
    case PASSWORD_RESET_TOKEN_CONFIRMED:
      return {
        ...state,
        email: action.email,
        confirmation: `An email has been sent to ${action.email}.`,
        confirmationType: 'bg-blue',
      }

    case PASSWORD_RESET_TOKEN_FAILED:
      return {
        ...state,
        confirmation: '',
      }

    case PASSWORD_RESET_TOKEN_REQUESTED:
      return {
        ...state,
        email: action.email,
        confirmation: `Just a sec — we're sending an email to ${action.email}.`,
        confirmationType: 'bg-orange',
      }

    case SIGNIN_SCRIM_INITIALIZED:
    case SIGNIN_SCRIM_SHOWN:
      return {
        ...state,
        confirmation: null,
      }

    default:
      return state
  }
}
