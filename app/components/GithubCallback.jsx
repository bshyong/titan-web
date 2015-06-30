import GithubOnboardingActions from '../actions/github_onboarding_actions'
import React from 'react'

export default class GithubCallback extends React.Component {
  static willTransitionTo(transition, params, query) {
    GithubOnboardingActions.confirmGithubAuth(query)
  }

  render() {
    return (
      <div>
        Redirecting...
      </div>
    )
  }
}
