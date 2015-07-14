import c from 'constants'

export function fetchFollowing(userId) {
  return {
    types: [c.FOLLOWINGS_FETCHING, c.FOLLOWINGS_FETCHED, c.FOLLOWINGS_FETCH_FAILED],
    promise: api => api.get(`users/${userId}/following`),
  }
}

export function fetchMembered() {
  return {
    types: [c.CHANGELOGS_MEMBERED_FETCHING, c.CHANGELOGS_MEMBERED_FETCHED, c.CHANGELOGS_MEMBERED_FETCH_FAILED],
    promise: api => api.get(`user/changelogs`),
  }
}
