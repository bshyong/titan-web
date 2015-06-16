import {List} from 'immutable'
import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import Emoji from '../../ui/Icon.jsx'
import Icon from '../../ui/Icon.jsx'
import paramsFor from '../../lib/paramsFor'
import React from 'react'
import Stack from '../../ui/Stack.jsx'
import StoryCell from './StoryCell.jsx'
import Table from '../../ui/Table.jsx'
import UpvoteToggler from '../../components/UpvoteToggler.jsx'

export default class StoryFeedItem extends React.Component {
  render() {
    const { story } = this.props
    console.log(story)
    return (
      <Table.Cell key={story.id} image={<UpvoteToggler story={story} hearted={story.viewer_has_hearted} />} to="story" params={paramsFor.story({slug: story.changelog_slug}, story)}>
        <StoryCell story={story} />
      </Table.Cell>
    )
  }

  renderChangelogLogo(story) {
    let size = 16
    const style = {
      width: size,
      height: size,
      outline: 'none'
    }
    if (story.changelog_logo !== null) {
      return (
        <div className="bg-silver rounded mr2" style={style}>
          <img className="block rounded" src={story.changelog_logo} style={style} />
        </div>
      )
    } else {
      return (
        <div className="mr3"></div>
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
