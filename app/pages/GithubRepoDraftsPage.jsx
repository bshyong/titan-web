import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import connectToStores from '../lib/connectToStores.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import ApplicationNavbar from '../components/application_navbar.jsx'
import GithubOnboardingActions from '../actions/github_onboarding_actions'
import GithubOnboardingStore from '../stores/github_onboarding_store'
import Link from '../components/Link.jsx'

@connectToStores(GithubOnboardingStore)
export default class GithubRepoDraftsPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    const user = SessionStore.user
    if (!user){ SessionActions.signin() }
  }

  static getPropsFromStores(props) {
    return {
      drafts: GithubOnboardingStore.drafts,
      draftsFetching: GithubOnboardingStore.fetchingDrafts
    }
  }

  componentDidMount() {
    const { drafts } = this.props
    if (drafts.isEmpty()) {
      // try to fetch them from server
    }
  }

  render() {
    const { draftsFetching } = this.props

    return <div>
      <ApplicationNavbar />
      <div className="container">
        { draftsFetching ? this.renderLoadingState() : this.renderDraftStoryForms() }
      </div>
    </div>
  }

  renderLoadingState() {
    const { draftsFetching } = this.props

    return (
      <div className="p3">
        <h2>Loading drafts..</h2>
        <LoadingBar loading={draftsFetching} />
      </div>
    )
  }

  renderDraftStoryForms() {
    const { drafts } = this.props

    if (drafts.isEmpty()) { return this.renderEmptyState() }

    return (
      <div className="p3">
        <h2>Drafts</h2>
        {drafts.map((d) => {
          return <div><h3>{d.title}</h3><p>{d.body}</p></div>
        })}
      </div>
    )
  }

  renderEmptyState() {
    return (
      <div className="p3">
        <h2>No drafts</h2>
        <div>
          <Link to="githubRepos">Click here to generate drafts from a Github repo</Link>
        </div>
      </div>
    )
  }
}
