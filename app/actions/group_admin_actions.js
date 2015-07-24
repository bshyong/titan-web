import c from 'constants'

export function fetchMembers(changelogId) {
  return {
    types: [c.GROUP_MEMBERS_FETCHING, c.GROUP_MEMBERS_FETCHED, c.GROUP_MEMBERS_FETCH_FAILED],
    promise: api => api.get(`changelogs/${changelogId}/admin/followers`),
  }
}
