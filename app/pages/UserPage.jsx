import ProfileStore from '../stores/profile_store.js'
import RouterContainer from '../lib/router_container'
import ProfileActions from '../actions/profile_actions.js'
import User from '../components/User.jsx'
import React from 'react'

export default class UserPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    console.log('Getting props from store', params)
    ProfileActions.fetch(params.userId)
  }

  static get defaultProps() {
    return {
      userId: RouterContainer.get().getCurrentParams().userId
    }
  }

  render() {
    return <User />
  }
}
