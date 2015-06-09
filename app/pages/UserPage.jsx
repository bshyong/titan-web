import ApplicationNavbar from '../components/application_navbar.jsx'
import ProfileStore from '../stores/profile_store.js'
import RouterContainer from '../lib/router_container'
import ProfileActions from '../actions/profile_actions.js'
import FollowingActions from '../actions/follow_actions.js'
import UserProfile from '../components/User/UserProfile.jsx'
import React from 'react'

export default class UserPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetch(params.userId)
    ProfileActions.fetchStories(params.userId)
    FollowingActions.fetchFollowing(params.userId)
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
