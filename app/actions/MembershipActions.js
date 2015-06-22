import {
  MEMBERSHIP_UPDATE_FAILED,
  MEMBERSHIP_UPDATED,
  MEMBERSHIP_UPDATING,
  PENDING_MEMBERSHIP_UPDATED
} from '../constants'

import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  update(changelogId, userId, change) {
    Dispatcher.dispatch({
      type: MEMBERSHIP_UPDATING,
      changelogId: changelogId,
      userId: userId,
      change: change
    })

    if (userId.indexOf('@') === -1) {
      api.put(`changelogs/${changelogId}/members/${userId}`, change).then(resp => {
        Dispatcher.dispatch({
          type: MEMBERSHIP_UPDATED,
          changelogId: changelogId,
          userId: userId,
          membership: resp
        })
      }).catch(errors => {
        Dispatcher.dispatch({
          type: MEMBERSHIP_UPDATE_FAILED,
          changelogId: changelogId,
          userId: userId,
          errors: errors
        })
      })
    } else {
      console.log(userId)
      let d = {email: userId}
      api.post(`changelogs/${changelogId}/pending_members`, d).then(resp => {
        Dispatcher.dispatch({
          type: PENDING_MEMBERSHIP_UPDATED,
          changelogId: changelogId,
          userId: userId,
          membership: resp,
          created: change.is_core ? true : false
        })
      }).catch(errors => {
        Dispatcher.dispatch({
          type: MEMBERSHIP_UPDATE_FAILED,
          changelogId: changelogId,
          userId: userId,
          errors: errors
        })
      })
    }
  }
}
