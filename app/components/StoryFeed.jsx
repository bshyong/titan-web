import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import FeedStoryStore from '../stores/feed_story_store'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'
import UpvoteToggler from './UpvoteToggler.jsx'

@connectToStores(FeedStoryStore)
export default class StoryFeed extends React.Component {

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
    let nextPage = () =>
      StoryActions.fetchUserFirehoseFeed(username, page + 1, 25)

    return (
      <div className="container">
        <h3 className="px2 md-px0 py2 caps gray h2 border-bottom">Top Posts</h3>
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
        <Table>
          <ClickablePaginator>
          {stories.sortBy(s => s.created_at).reverse().map(story => {
              return (
                <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: story.changelog_slug}, story)}>
                  <StoryCell story={story} showChangelog={true} hideContributors={true} />
                </Table.Cell>
              )
            })}
          </ClickablePaginator>
        </Table>
      )
    }
  }
}
