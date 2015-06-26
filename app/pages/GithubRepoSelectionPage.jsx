import ApplicationNavbar from '../components/application_navbar.jsx'
import GithubRepoActions from '../actions/github_repo_actions'
import GithubReposStore from '../stores/github_repos_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

export default class GithubRepoSelectionPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    const user = SessionStore.user
    if (user){ GithubRepoActions.fetchAll() }
    else { SessionActions.signin() }
  }

  render() {
    const user = SessionStore.user
    return <div>
      <ApplicationNavbar />
      <div className="container">
        { true ? this.renderAuthedState() : this.renderUnauthedState() }
      </div>
    </div>
  }

  renderAuthedState() {
    return (
      <div>
        <h3>Choose a repo</h3>
        {GithubReposStore.repos.map(r => {return r})}
      </div>
    )
  }

  renderUnauthedState() {

  }
}
