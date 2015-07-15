import {
  MEMBERSHIP_UPDATE_FAILED,
  MEMBERSHIP_UPDATED,
  MEMBERSHIP_UPDATING,
  PENDING_MEMBERSHIP_UPDATED,
  MEMBERSHIP_DELETED,
} from '../constants'

import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  delete(changelogId, userId) {
    Dispatcher.dispatch({
      type: MEMBERSHIP_DELETED,
      userId: userId
    })
    api.delete(`changelogs/${changelogId}/members/${userId}`)
  },
  update(changelogId, userId, change) {
    const action = {
      type: MEMBERSHIP_UPDATING,
      changelogId: changelogId,
      userId: userId,
      change: change
    }

    Dispatcher.dispatch(action)

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
      let d = {...change, email: userId}
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
