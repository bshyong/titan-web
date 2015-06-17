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
        <div className="flex-none sm-col-4">
          {this.renderScore(story)}
          {this.renderChangelog(story)}
          {this.renderBadge(story)}
        </div>

        <h4 className="flex-auto">
          {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
        </h4>
        {this.renderContributors()}
        <div className="flex-none sm-show ml2">
          {this.renderComments(story)}
        </div>
      </div>
    )
  }

  renderBadge(story) {
    if (this.props.hideBadge !== true) {
      return (
        <div className="flex-none mr2">
          <Badge badge={story.emoji} size="1.5rem" />
        </div>
      )
    }
  }

  renderChangelog(story) {
    let size = 24
    if (this.props.showChangelog && story.changelog_logo !=null) {
      return (
        <div className="flex-none mx-auto">
          <img className="mr1 ml1 block rounded" src={story.changelog_logo} size={16} style={{width: size, height: size, outline: 'none'}} />
          <div className="gray h6">
            {story.changelog_name}
          </div>
          <div className="gray h6 sm-col-8">
            {story.changelog_tagline}
          </div>
        </div>
      )
    } else {
      return (
        <div className="mr2 block" size={16} style={{width: size, height: size, outline: 'none'}} />
      )
    }

  }

  renderScore(story) {
    if (this.props.showScore) {
      return (
        <div className="gray flex mr1">
          {story.hearts_count}
        </div>
      )
    }
  }

  renderComments(story) {
    if (!this.props.hideZeroComments || story.live_comments_count > 0 ) {
      return (
        <div className="h5 gray mxn1 flex">
          <div className="px1 no-underline">
            <span className=" silver"><Icon icon="comment" /></span>
            {' '}
            {story.live_comments_count}
          </div>
        </div>
      )
    }
  }

  renderContributors() {
    const { showContributors, story, story: { contributors } } = this.props
    if (showContributors) {
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
  showContributors: React.PropTypes.bool,
  hideZeroComments: React.PropTypes.bool,
  showScore: React.PropTypes.bool,
  showChangelog: React.PropTypes.bool,
  hideBadge: React.PropTypes.bool
}
