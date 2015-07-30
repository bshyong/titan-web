import {
  ATTACHMENT_FAILED,
  ATTACHMENT_SUCCEEDED,
  ATTACHMENT_UPLOADED,
  ATTACHMENT_UPLOADING,
} from 'constants'

export default function attachments(state = {}, action) {
  switch (action.type) {
    case ATTACHMENT_UPLOADED:
      return {
        ...state,
        [action.id]: (state[action.id] || 1) - 1,
      }
    case ATTACHMENT_UPLOADING:
      return {
        ...state,
        [action.id]: (state[action.id] || 0) + 1,
      }
    case ATTACHMENT_SUCCEEDED:
      return state
    case ATTACHMENT_FAILED:
      // FIXME: (pletcher) We've never had good error handling here
      return {
        ...state,
        // the upload has finished; it just failed
        [action.id]: (state[action.id] || 1) - 1,
      }
    default:
      return state
  }
}
