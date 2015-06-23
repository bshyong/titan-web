import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import Emoji from '../../ui/Icon.jsx'
import Guest from '../../ui/Guest.jsx'
import Icon from '../../ui/Icon.jsx'
import React from 'react'
import Stack from '../../ui/Stack.jsx'
import Table from '../../ui/Table.jsx'
import {List} from 'immutable'

import UpvoteArrowSrc  from '../../images/upvote-arrow.svg'
import UpvotedArrowSrc  from '../../images/upvoted-arrow.svg'

export default class StoryCell extends React.Component {
  render() {
    const { story } = this.props
    return (
      <div className="flex">
        {this.renderBadge()}

        <div className="flex-auto">
          {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
        </div>

        {this.renderContributors()}

        <div className="flex-none sm-show ml2">
          <div className="h5 gray  mxn1 flex">
            <div className="px1 no-underline">
              <span className=" silver"><Icon icon="comment" /></span>
              {' '}
              {story.live_comments_count}
            </div>
            <div className="px1 no-underline flex flex-center">
              <div style={{marginRight:'0.25rem'}}>
                <img src={story.viewer_has_hearted ? UpvotedArrowSrc : UpvoteArrowSrc} height="12"  />
              </div>
              {' '}
              <div>{story.hearts_count}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBadge() {
    if (this.props.slim) {
      return
    }

    const { story } = this.props

    return (
      <div className="flex-none mr2">
        <Badge badge={story.emoji} size="1.5rem" />
      </div>
    )
  }

  renderContributors() {
    if (this.props.slim) {
      return
    }

    return (
      <div className="flex-none sm-show ml2">
        <Stack items={this.avatars()} align="right" />
      </div>
    )
  }

  avatars() {
    const { story } = this.props
    let guests = List(new Array(story.guests_count || 0)).map(() => <Guest size={24} />)

    return List(story.contributors).
      map(user => <Avatar user={user} size={24} />).
      concat(guests)
  }

}

StoryCell.propTypes = {
  story: React.PropTypes.object.isRequired,
  slim: React.PropTypes.bool.isRequired,
}

StoryCell.defaultProps = {
  slim: false,
}
