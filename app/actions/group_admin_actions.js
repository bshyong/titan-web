import c from 'constants'
import api from 'lib/api'

export function fetchMembers(changelogId, page, per) {
  return dispatch => {
    dispatch({type: c.GROUP_MEMBERS_FETCHING})
    api.get(`changelogs/${changelogId}/admin/followers?page=${page}&per=${per}`).
      then(resp => {
        dispatch({
          type: c.GROUP_MEMBERS_FETCHED,
          members: resp,
          per: per,
          page: page
        })
      })
  }
}
