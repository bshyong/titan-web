import c from 'constants'
import api from '../lib/api'

export function deleteMembership(changelogId, userId) {
  return dispatch => {
    dispatch({
      type: c.MEMBERSHIP_DELETED,
      userId: userId,
    })
    api.delete(`changelogs/${changelogId}/members/${userId}`)
  }
}

export function updateMembership(changelogId, userId, change) {
  const action = {
    type: c.MEMBERSHIP_UPDATING,
    changelogId: changelogId,
    userId: userId,
    change: change,
  }

  return dispatch => {
    dispatch(action)

    if (userId.indexOf('@') === -1) {
      api.put(`changelogs/${changelogId}/members/${userId}`, change).then(resp => {
        dispatch({
          type: c.MEMBERSHIP_UPDATED,
          changelogId: changelogId,
          userId: userId,
          membership: resp,
        })
      }).catch(errors => {
        dispatch({
          type: c.MEMBERSHIP_UPDATE_FAILED,
          changelogId: changelogId,
          userId: userId,
          errors: errors,
        })
      })
    } else {
      const d = {...change, email: userId}
      api.post(`changelogs/${changelogId}/pending_members`, d).then(resp => {
        dispatch({
          type: c.PENDING_MEMBERSHIP_UPDATED,
          changelogId: changelogId,
          userId: userId,
          membership: resp,
          created: change.is_core ? true : false,
        })
      }).catch(errors => {
        dispatch({
          type: c.MEMBERSHIP_UPDATE_FAILED,
          changelogId: changelogId,
          userId: userId,
          errors: errors,
        })
      })
    }
  }
}
