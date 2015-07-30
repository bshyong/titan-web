import c from '../constants'

const initialState = {
  fetching: false,
}

export default function invitation(state=initialState, action) {
  switch (action.type) {
    case c.INVITATION_FETCHING:
      return {
        ...state,
        fetching: true,
        invitation: null,
      }

    case c.INVITATION_FETCHED:
      return {
        ...state,
        fetching: false,
        invitation: action.resp,
      }

    default:
      return state
  }
}
