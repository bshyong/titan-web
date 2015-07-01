import ApplicationNavbar from '../components/application_navbar.jsx'
import GithubOnboardingActions from '../actions/github_onboarding_actions'
import GithubOnboardingStore from '../stores/github_onboarding_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'
import connectToStores from '../lib/connectToStores.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import Link from '../components/Link.jsx'
import Icon from '../ui/Icon.jsx'
import ChangelogStore from '../stores/changelog_store'
import Router from '../lib/router_container'

@connectToStores(GithubOnboardingStore)
export default class GithubRepoSelectionPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    const user = SessionStore.user
    if (user){ GithubOnboardingActions.fetchRepos() }
    else { SessionActions.signin() }
  }

  static getPropsFromStores(props) {
    return {
      repos: GithubOnboardingStore.repos,
      reposFetching: GithubOnboardingStore.fetchingRepos,
      changelogId: Router.get().getCurrentParams().changelogId
    }
  }

  render() {
    const user = SessionStore.user
    return <div className="container">
      { user.github_authed ? this.renderAuthedState() : this.renderUnauthedState() }
    </div>
  }

  renderAuthedState() {
    const { repos, reposFetching, changelogId } = this.props

    if (reposFetching) { return this.renderLoadingState() }

    return (
      <div className="p3">
        <h2 className="mb0">Choose a repo</h2>
        <p className="gray">We will generate drafts from your top 30 merged pull requests</p>
        {repos.map(r => {return <GithubRepo repo={r} changelogId={changelogId} key={r.id} />})}
      </div>
    )
  }

  renderLoadingState() {
    const { reposFetching } = this.props

    return (
      <div className="p3">
        <h2>Loading Github repos..</h2>
        <LoadingBar loading={reposFetching} />
      </div>
    )
  }

  renderUnauthedState() {
    return (
      <div className="p3">
        <h2>You need to connect your Github account</h2>
        <a href={`${API_URL}/auth/github?origin=${window.location.href}`}>Click to authenticate with Github</a>
      </div>
    )
  }
}

class GithubRepo extends React.Component {
  render() {
    const { repo } = this.props

    return <div className="p2 mb1 mt1 border bg-smoke-hover pointer" key={repo.id} onClick={this.handleRepoSelected.bind(this, repo)}>
      <div className="bold">{repo.name} {repo.private ? <Icon icon="lock" /> : null}</div>
      <div className="gray">{repo.url}</div>
    </div>
  }

  handleRepoSelected(repo) {
    const { changelogId } = this.props
    GithubOnboardingActions.createDraftsFromRepo(repo.id, changelogId)
  }
}

GithubRepo.proptypes = {
  repo: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    private: React.PropTypes.bool.isRequired,
    url: React.PropTypes.string.isRequired,
  }).isRequired,
}
