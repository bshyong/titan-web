import ClickablePaginator from '../ui/ClickablePaginator.jsx'
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
          <ClickablePaginator>
          {stories.sortBy(s => s.created_at).reverse().map(story => {
            return (
              <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: story.changelog.slug}, story)} image={<Logo changelog={story.changelog} size="1.5rem" />}>
                <StoryCell story={story} slim={true} />
              </Table.Cell>
            )
          })}
          </ClickablePaginator>
        </Table>
      )
    }
  }
}
