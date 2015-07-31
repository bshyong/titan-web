import React from 'react'
import {fetchFeed} from 'actions/storyActions'
import StoryFeed from '../components/StoryFeed.jsx'
import fetchData from 'decorators/fetchData'

@fetchData(() => fetchFeed(1, 25))
export default class FeedPage extends React.Component {
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
