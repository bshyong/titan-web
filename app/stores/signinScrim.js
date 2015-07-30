import {
  SIGNIN_SCRIM_HIDDEN,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'

export default function signinScrim(state = {}, action) {
  switch (action.type) {
    case SIGNIN_SCRIM_HIDDEN:
      return {shown: false}

    case SIGNIN_SCRIM_INITIALIZED:
    case SIGNIN_SCRIM_SHOWN:
      return {shown: true}

    default:
      return state
  }
}
