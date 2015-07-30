import c from '../constants'

export function fetchInvitation(inviteToken) {
  return {
    types: [c.INVITATION_FETCHING, c.INVITATION_FETCHED, c.INVITATION_FETCH_FAILED],
    promise: api => api.get(`invitations/${inviteToken}`),
  }
}

export function resetInvitation(changelogId, inviteToken) {
  return {
    types: [c.INVITATION_RESETTING, c.INVITATION_RESET, c.INVITATION_RESET_FAILED],
    promise: api => api.put(`${changelogId}/invitations/${inviteToken}/reset`),
  }
}
