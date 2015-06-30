import {
  GITHUB_DRAFTS_LOADED,
  GITHUB_DRAFTS_LOADING,
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
  GITHUB_DRAFT_DELETED,
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import Router from '../lib/router_container'

export default {

  fetchRepos() {
    Dispatcher.dispatch({
      type: GITHUB_REPOS_FETCHING
    })
    api.get(`github/repos`).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_REPOS_FETCHED,
        repos: resp
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
  }
}
