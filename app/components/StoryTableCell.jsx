import React from 'react'
import Avatar from './ui/avatar.jsx'
import Table from './ui/table.jsx'
import Stack from './ui/Stack.jsx'
import Icon from './ui/icon.js.jsx'
import Emoji from './ui/icon.js.jsx'
import StoryActions from '../actions/story_actions'
import paramsFor from '../lib/paramsFor'

export default class StoryTableCell extends React.Component {
  render() {
    const { story } = this.props

    const emoji = (
      <Emoji story={story} size="sm"
             hearted={story.viewer_has_hearted}
             onClick={() => StoryActions.clickHeart(story)} />
    )

    // FIXME: (@chrislloyd) urls for stories are hardcoded to asm

    return (
      <Table.Cell key={story.id} image={emoji} to="story" params={paramsFor.story({id: 'assembly'}, story)}>
        <div className="flex">
          <div className="flex-auto">
            {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
          </div>
          {this.renderContributors()}

          <div className="flex-none ml2">
            <div className="h5 gray  mxn1 flex">
              <div className="px1 no-underline">
                <span className=" silver"><Icon icon="comment" /></span>
                {' '}
                {story.live_comments_count}
              </div>
            </div>
          </div>
        </div>
      </Table.Cell>
    )
  }

  renderContributors() {
    const { story: { allContributors } } = this.props
    if (!allContributors) {
      return
    }
    return (
      <div className="flex-none sm-show ml2">
        <Stack items={allContributors.map(user => <Avatar user={user} size={24} />)} align="right" />
      </div>
    )
  }
}

StoryTableCell.propTypes = {
  story: React.PropTypes.object.isRequired
}
