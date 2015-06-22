import {
  INVITATION_FETCHING,
  INVITATION_FETCHED,
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

}
