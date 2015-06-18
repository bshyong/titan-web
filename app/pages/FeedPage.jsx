import React from 'react'
import RouterContainer from '../lib/router_container'
import ApplicationNavbar from '../components/application_navbar.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryFeed from '../components/StoryFeed.jsx'

export default class FeedPage extends React.Component {

  static willTransitionTo(transition, params, query) {
    let user = SessionStore.user
    if (user !== null) {
      let username = user.username
      StoryActions.fetchUserFirehoseFeed(username, 1, 25)
    }
  }

  render() {
    if (!SessionStore.isSignedIn()) {
      SessionActions.signin()
      return (<div/>)
    } else {
      return <div>
        <ApplicationNavbar />
        <div className="container">
          <h1 className="caps border-bottom center py2 mt4 mb4">The <span className="blue">Long</span> Log</h1>
          <StoryFeed />
        </div>
      </div>
    }
  }
}
