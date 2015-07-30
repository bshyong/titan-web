import {
  SIGNIN_SCRIM_HIDDEN,
  SIGNIN_SCRIM_INITIALIZED,
} from 'constants'

export function hide() {
  return {
    type: SIGNIN_SCRIM_HIDDEN,
  }
}

export function initialize(formComponent, formContent, redirectTo) {
  return {
    type: SIGNIN_SCRIM_INITIALIZED,
    formComponent: formComponent,
    formContent: formContent,
    redirectTo: typeof redirectTo === 'string' ? redirectTo : null,
  }
}
