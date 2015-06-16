import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryFeedItem from '../components/Story/StoryFeedItem.jsx'
import FeedStoryStore from '../stores/feed_story_store'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'

@connectToStores(FeedStoryStore)
export default class StoryFeed extends React.Component {

  constructor(props) {
    super(props)
  }

  static getPropsFromStores(props) {
    return {
      user: SessionStore.user,
      stories: FeedStoryStore.stories,
      page: FeedStoryStore.page
    }
  }

  render() {
    const { page, user } = this.props
    let username = user.username
    console.log(page)
    let nextPage = () =>
      StoryActions.fetchUserFirehoseFeed(username, page + 1, 25)

    return (
      <div className="container">
        <h2>Story Feed</h2>
        <div className="sm-col-8">
          {this.renderStories()}
          <ScrollPaginator page={page} onScrollBottom={nextPage} />
        </div>
      </div>
    )
  }

  renderStories() {
    const { stories } = this.props
    if (stories !== null) {
      return (
        stories.sortBy(s => s.created_at).reverse().map(story => {
          return (
            <div className="py1">
              <StoryFeedItem story={story} />
            </div>
          )
        })
      )
    }
  }
}
