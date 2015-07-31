import c from 'constants'
import api from 'lib/api'

export function fetchMembers(changelogId, page, per, sort, filter) {
  return dispatch => {
    dispatch({
      type: c.GROUP_MEMBERS_FETCHING,
      page: page,
    })
    api.get(`changelogs/${changelogId}/admin/followers?page=${page}&per=${per}&sort=${sort}&filter=${filter}`).
      then(resp => {
        dispatch({
          type: c.GROUP_MEMBERS_FETCHED,
          members: resp,
          per: per,
          page: page,
          sort: sort,
          filter: filter,
        })
      })
  }
}

export function fetchStats(changelogId) {
  return {
    types: [c.GROUP_STATS_FETCHING, c.GROUP_STATS_FETCHED, c.GROUP_STATS_FETCH_FAILED],
    promise: api => api.get(`changelogs/${changelogId}/admin/stats`),
  }
}
