import {connect} from 'redux/react'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import StoryCell from './Story/StoryCell.jsx'
import Table from 'ui/Table.jsx'

@connect(state => ({
  user: state.currentUser,
  stories: state.feed.stories,
  page: state.feed.page,
}))
export default class StoryFeed extends React.Component {
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
