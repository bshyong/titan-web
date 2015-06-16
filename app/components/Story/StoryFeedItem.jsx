import {List} from 'immutable'
import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import Emoji from '../../ui/Icon.jsx'
import Icon from '../../ui/Icon.jsx'
import React from 'react'
import Stack from '../../ui/Stack.jsx'
import Table from '../../ui/Table.jsx'

export default class StoryFeedItem extends React.Component {
  render() {
    const { story } = this.props
    return (
      <div className="flex">
        {this.renderChangelogLogo(story)}
        <div className="flex-none mr2">
          <Badge badge={story.emoji} size="1.5rem" />
        </div>
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

  renderChangelogLogo(story) {
    let size = 20
    const style = {
      width: size,
      height: size,
      outline: 'none'
    }
    if (story.changelog_logo !== null) {
      return (
        <div className="bg-silver rounded" style={style}>
          <img className="block rounded mr2" src={story.changelog_logo} style={style} />
        </div>
      )
    } else {
      return (
        <div className="px1"></div>
      )
    }

  }

  renderContributors() {
    const { story, story: { contributors } } = this.props

    return (
      <div className="flex-none sm-show ml2">
        <Stack items={List(contributors).map(user => <Avatar user={user} size={24} />)} align="right" />
      </div>
    )
  }
}

StoryFeedItem.propTypes = {
  story: React.PropTypes.object.isRequired
}
