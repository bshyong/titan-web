import {List} from 'immutable'
import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import Emoji from '../../ui/Icon.jsx'
import Icon from '../../ui/Icon.jsx'
import React from 'react'
import Stack from '../../ui/Stack.jsx'
import Table from '../../ui/Table.jsx'
import Logo from '../Logo.jsx'

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
    const { story, story: { contributors } } = this.props

    if (this.props.slim) {
      return
    }

    return (
      <div className="flex-none sm-show ml2">
        <Stack items={List(contributors).map(user => <Avatar user={user} size={24} />)} align="right" />
      </div>
    )
  }
}

StoryCell.propTypes = {
  story: React.PropTypes.object.isRequired,
  slim: React.PropTypes.bool.isRequired,
}

StoryCell.defaultProps = {
  slim: false,
}
