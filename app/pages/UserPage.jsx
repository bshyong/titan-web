import {connect} from 'redux/react'
import {fetchFollowing} from 'actions/changelogActions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import * as changelogActions from 'actions/changelogActions'
import ProfileActions from 'actions/profile_actions.js'
import React from 'react'
import RouterContainer from 'lib/router_container'
import UserProfile from 'components/User/UserProfile.jsx'
import fetchData from 'decorators/fetchData'

@fetchData(params => {
  ProfileActions.fetch(params.userId)
  ProfileActions.fetchStories(params.userId)

  return changelogActions.clearCurrent()
})
@connect(() => ({}))
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
