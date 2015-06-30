import {
  IMPORT_FAILED,
  IMPORT_STARTED,
  IMPORT_STARTING,
} from 'constants'
import Dispatcher from 'lib/dispatcher'

export default function changelogImport(state = {}, action) {
  switch (action.type) {
  case IMPORT_STARTING:
    return {
      errors: null,
      updating: true,
      successful: null,
    }
  case IMPORT_STARTED:
    // TODO: remove once reduxed
    Dispatcher.dispatch({
      type: IMPORT_STARTED,
      changelog: action.resp
    })

    return {
      updating: false,
      updateSuccessful: true
    }
  case IMPORT_FAILED:
    return {
      updating: false,
      updateSuccessful: false,
      errors: action.errors
    }
  default:
    return state
  }
}
