import React from 'react'
import AppNavbar from 'components/App/AppNavbar.jsx'
import StoryActions from '../actions/story_actions'
import StoryFeed from '../components/StoryFeed.jsx'

export default class FeedPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchFeed(1, 25)
  }

  render() {
    return <div>
      <ApplicationNavbar />
      <div className="container">
        <h1 className="caps border-bottom center py2 mt4 mb4">The <span className="blue">Long</span> Log</h1>
        <StoryFeed />
      </div>
    </div>
  }
}
