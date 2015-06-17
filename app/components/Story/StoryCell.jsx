import {List} from 'immutable'
import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import Emoji from '../../ui/Icon.jsx'
import Icon from '../../ui/Icon.jsx'
import React from 'react'
import Stack from '../../ui/Stack.jsx'
import Table from '../../ui/Table.jsx'

export default class StoryCell extends React.Component {
  render() {
    const { story } = this.props
    return (
      <div className="flex">
        {this.renderChangelog(story)}
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

  renderChangelog(story) {
    let size = 24
    if (this.props.showChangelog && story.changelog_logo !=null) {
      return (
        <div className="flex-none mx-auto">
          <img className="mr1 ml1 block rounded" src={story.changelog_logo} size={size} style={{width: size, height: size, outline: 'none'}} />
          <div className="gray h6">
            {story.changelog_name}
          </div>
          <div className="gray h6 sm-col-8">
            {story.changelog_tagline}
          </div>
        </div>
      )
    } 
  }

  renderContributors() {
    const { story, story: { contributors } } = this.props
    if (this.props.hideContributors !== true) {
      return (
        <div className="flex-none sm-show ml2">
          <Stack items={List(contributors).map(user => <Avatar user={user} size={24} />)} align="right" />
        </div>
      )
    }
  }
}

StoryCell.propTypes = {
  story: React.PropTypes.object.isRequired,
  hideContributors: React.PropTypes.bool
}
