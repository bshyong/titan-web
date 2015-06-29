import {
  GITHUB_DRAFTS_CREATED,
  GITHUB_DRAFTS_CREATING,
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
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
      type: GITHUB_DRAFTS_CREATING
    })
    api.post(`github/repos/${repoId}/create_drafts`, {changelog_id: changelogId}).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_DRAFTS_CREATED,
        drafts: resp
      })
    })
  }
}
