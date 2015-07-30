import c from 'constants'
import api from 'lib/api'
import Router from 'lib/router_container'

export function fetchFollowing(userId) {
  return {
    types: [c.FOLLOWINGS_FETCHING, c.FOLLOWINGS_FETCHED, c.FOLLOWINGS_FETCH_FAILED],
    promise: client => client.get(`users/${userId}/following`),
  }
}

export function fetchMembered() {
  return {
    types: [c.CHANGELOGS_MEMBERED_FETCHING, c.CHANGELOGS_MEMBERED_FETCHED, c.CHANGELOGS_MEMBERED_FETCH_FAILED],
    promise: client => client.get(`user/changelogs`),
  }
}

export function fetchAll() {
  return dispatch => {
    api.get(`changelogs`).
      then(resp => {
        dispatch({
          type: c.CHANGELOGS_FEATURED_FETCHED,
          changelogs: resp,
        })
      })
  }
}

export function select(changelogId, callback) {
  return dispatch => {
    api.get(`changelogs/${changelogId}`).
      then(resp => {
        if (callback) {
          callback(resp)
        }
        dispatch({
          type: c.CHANGELOG_FETCHED,
          resp: resp,
        })
      })
  }
}

export function change(changelog) {
  return {
    type: c.CHANGELOG_CHANGED,
    changelog: changelog,
  }
}

export function clearCurrent() {
  return {
    type: c.CHANGELOG_CURRENT_CLEARED,
  }
}

export function fetchMemberships(changelogId) {
  return dispatch => {
    api.get(`changelogs/${changelogId}/memberships`).
      then(resp => {
        dispatch({
          type: c.CHANGELOG_MEMBERSHIPS_FETCHED,
          resp,
        })
      })
  }
}

export function update(id, params) {
  return {
    types: [c.CHANGELOG_UPDATING, c.CHANGELOG_UPDATED, c.CHANGELOG_UPDATE_FAILED],
    promise: client => client.put(`changelogs/${id}`, params),
  }
}

export function destroy(id) {
  return dispatch => {
    api.delete(`changelogs/${id}`).
      then(resp => {
        dispatch({
          type: c.CHANGELOG_DESTROYED,
          changelog: resp,
        })
        Router.transitionTo('dashboard')
      })
  }
}
