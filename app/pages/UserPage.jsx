import ApplicationNavbar from '../components/application_navbar.jsx'
import ChangelogActions from '../actions/changelog_actions'
import FollowingActions from '../actions/follow_actions.js'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import RouterContainer from '../lib/router_container'
import UserProfile from '../components/User/UserProfile.jsx'

export default class UserPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetch(params.userId)
    ProfileActions.fetchStories(params.userId)
    FollowingActions.fetchFollowing(params.userId)
    ChangelogActions.clearCurrent()
  }

  static get defaultProps() {
    return {
      userId: RouterContainer.get().getCurrentParams().userId
    }
  }

  render() {
    return <div>
      <ApplicationNavbar />
      <UserProfile />
    </div>
  }
}
