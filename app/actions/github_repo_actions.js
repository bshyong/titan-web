import {
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
  GITHUB_REPO_DRAFTS_CREATED,
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetchAll() {
    api.get(`github/repos`).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_REPOS_FETCHING,
        repos: resp
      })
    })
  }

  createDraftsFromRepo(repoName) {
    api.post(`github/repos/${repoName}/select`).then(resp => {
      Dispatcher.dispatch({
        type: GITHUB_REPO_DRAFTS_CREATED
        resp: resp
      })
    })
  }
}
