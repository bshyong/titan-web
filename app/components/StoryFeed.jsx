import connectToStores from '../lib/connectToStores.jsx'
import FeedStoryStore from '../stores/feed_story_store'
import Logo from './logo.jsx'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import SessionStore from '../stores/session_store'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'

@connectToStores(FeedStoryStore)
export default class StoryFeed extends React.Component {
  static getPropsFromStores(props) {
    return {
      user: SessionStore.user,
      stories: FeedStoryStore.stories,
      page: FeedStoryStore.page,
    }
  }

  static propTypes = {
    stories: React.PropTypes.object,
  }

  render() {
    const { stories } = this.props
    if (stories !== null) {
      return (
        <Table>
          {stories.map(story => {
            const changelog = story.changelog
            return (
              <Table.Cell key={story.id} to="story" params={paramsFor.story(changelog, story)}>
                <StoryCell story={story} changelog={changelog} />
              </Table.Cell>
            )
          })}
        </Table>
      )
    }
  }
}
