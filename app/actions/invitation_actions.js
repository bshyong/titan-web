import {
  INVITATION_FETCHING,
  INVITATION_FETCHED,
  INVITATION_RESET,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetchInvitation(inviteToken) {
    Dispatcher.dispatch({
      type: INVITATION_FETCHING
    })

    api.get(`invitations/${inviteToken}`).then((resp) => {
      Dispatcher.dispatch({
        type: INVITATION_FETCHED,
        invitation: resp
      })
    })
  },

  resetInvitation(changelogId, inviteToken) {
    api.put(`${changelogId}/invitations/${inviteToken}/reset/`).then((resp) => {
      Dispatcher.dispatch({
        type: INVITATION_RESET,
        hash: resp.hash
      })
    })
  },

}
