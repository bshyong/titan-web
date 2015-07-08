import Avatar from 'ui/Avatar.jsx'
import Badge from 'components/Badge.jsx'
import Guest from 'ui/Guest.jsx'
import Icon from 'ui/Icon.jsx'
import React from 'react'
import Stack from 'ui/Stack.jsx'
import {List, Range} from 'immutable'

export default class StoryCell extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.shape({
      is_members_only: React.PropTypes.bool.isRequired,
    }),
    story: React.PropTypes.object.isRequired,
  }

  render() {
    const { story, changelog } = this.props
    return (
      <div className="flex">
        <div className="flex-none mr2">
          <Badge badge={story.emoji} size="1.5rem" />
        </div>

        <div className="flex-auto">
          <div className={changelog ? 'bold' : ''}>{story.team_member_only && !changelog.is_members_only ? <Icon icon="lock" /> : null} {story.title}</div>
          {this.renderChangelog()}
        </div>

        <div className="flex-none sm-show ml2">
          <Stack items={this.avatars()} align="right" />
        </div>

        <div className="flex-none sm-show ml2">
          <div className="h5 gray  mxn1 flex">
            <div className="px1 no-underline">
              <span className=" silver"><Icon icon="comment" /></span>
              {' '}
              {story.live_comments_count}
            </div>
            <div className="px1 no-underline flex flex-center">
              <div style={{marginRight: '0.25rem'}}>
                <Icon icon="heart" color={story.viewer_has_hearted ? "orange" : "silver"} />
              </div>
              {' '}
              <div>{story.hearts_count}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderChangelog() {
    const { changelog } = this.props
    if (!changelog) {
      return
    }
    return (
      <div className="h6">
        <span className="gray">in</span>
        {' '}
        {changelog.name}
        {' '}
        <span className="gray">&mdash; {changelog.tagline}</span>
      </div>
    )
  }

  avatars() {
    const { story } = this.props
    const guests = new Range(0, story.guests_count || 0).map(() => <Guest size={24} />)

    return new List(story.contributors).
      map(user => <Avatar user={user} size={24} />).
      concat(guests)
  }

}
