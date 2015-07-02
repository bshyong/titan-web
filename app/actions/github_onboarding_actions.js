import {
  GITHUB_DRAFTS_LOADED,
  GITHUB_DRAFTS_LOADING,
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
  GITHUB_DRAFT_DELETED,
  GITHUB_UNAUTHED_ERROR,
  USER_SIGNIN,
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import Router from '../lib/router_container'
import SessionActions from '../actions/SessionActions'

export default {

  fetchRepos(refetch) {
    Dispatcher.dispatch({
      type: GITHUB_REPOS_FETCHING
    })
    api.get(`github/repos?refetch=${refetch || ''}`).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_REPOS_FETCHED,
        repos: resp
      })
    }).catch(errors => {
      Dispatcher.dispatch({
        type: GITHUB_UNAUTHED_ERROR,
        error: errors.error
      })
    })
  },

  createDraftsFromRepo(repoId, changelogId) {
    Router.get().transitionTo('githubDrafts', {changelogId: changelogId})
    Dispatcher.dispatch({
      type: GITHUB_DRAFTS_LOADING
    })
    api.post(`github/repos/${repoId}/create_drafts`, {changelog_id: changelogId}).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_DRAFTS_LOADED,
        drafts: resp
      })
    }).catch(errors => {
      Dispatcher.dispatch({
        type: GITHUB_UNAUTHED_ERROR,
        error: errors.error
      })
    })
  },

  fetchDrafts(changelogId) {
    Dispatcher.dispatch({
      type: GITHUB_DRAFTS_LOADING
    })
    api.get(`changelogs/${changelogId}/drafts`).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_DRAFTS_LOADED,
        drafts: resp
      })
    })
  },

  deleteDraft(changelogId, draftId) {
    api.delete(`changelogs/${changelogId}/drafts/${draftId}`).then(resp => {})
  },

  deleteAllDrafts(changelogId) {
    api.delete(`changelogs/${changelogId}/drafts/destroy_all`).then(resp => {})
  },

  confirmGithubAuth(query) {
    api.post(`auth/github/confirm`, query).then(resp => {
      SessionActions.signinFromToken(resp.token)
      window.location.href = query.return_url
    })
  }
}
