import {connect} from 'redux/react'
import {fetchFollowing} from 'actions/changelogActions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import ChangelogActions from '../actions/changelog_actions'
import FollowActions from '../actions/FollowActions.js'
import ProfileActions from '../actions/profile_actions.js'
import React from 'react'
import RouterContainer from '../lib/router_container'
import statics from 'lib/statics'
import UserProfile from '../components/User/UserProfile.jsx'


@statics({
  willTransitionTo(transition, params, query) {
    ProfileActions.fetch(params.userId)
    ProfileActions.fetchStories(params.userId)
    ChangelogActions.clearCurrent()
  }
})
@connect(state => ({}))
export default class UserPage extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchFollowing(RouterContainer.get().getCurrentParams().userId))
  }

  render() {
    return <div>
      <AppNavbar />
      <UserProfile />
    </div>
  }
}
