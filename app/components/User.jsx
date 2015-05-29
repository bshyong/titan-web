import ApplicationNavbar from './application_navbar.jsx'
import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import BlurbBox from './blurb_box.jsx'
import Button from '../ui/Button.jsx'
import EmojiPicker from './EmojiPicker.jsx'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import paramsFor from '../lib/paramsFor'
import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'

@connectToStores(ProfileStore)
export default class ProfilePage extends React.Component {

  static getPropsFromStores() {
    return {
      user: ProfileStore.user
    }
  }

  render() {
    const { user } = this.props

    if (!user) {
      return <div />
    }

    return (
      <div>
        <div className="flex flex-column flex-center p3 bg-white">
          <div className="mb2">
            <Avatar user={user} size={16 * 8} />
          </div>
          <div className="center mb2">
            <h3 className="mt0 mb0">{user.username}</h3>
            <p className="gray mb0">{user.blurb}</p>
          </div>
        </div>

        <div className="container">
          {this.renderBadges()}
        </div>

        <div className="container">
          {this.renderStories()}
        </div>
      </div>
    )
  }

  renderBadges() {
    const stickerSheet = List(this.props.user.sticker_sheet).sortBy(s => -s.count)

    let stickerCount = 0
    stickerSheet.forEach(s => stickerCount += s.count)

    return (
      <Table>
        <Table.Separator label={`Stickers (${stickerCount})`} />
        <div className="flex flex-wrap">
          {stickerSheet.map(s => {
            const {sticker, count} = s
            return (
              <div className="p2 center" key={sticker.id}>
                <div className="mb1">
                  <Badge badge={sticker} size="3rem" />
                </div>
                {count}
              </div>
            )
          })}
        </div>
      </Table>
    )
  }

  renderStories() {
    const stories = this.props.user.stories
    return (
      <Table>
        <Table.Separator label="Recent changes" />
        {
          List(stories)
            .sortBy(story => story.created_at)
            .reverse()
            .map(story => (
              <Table.Cell key={story.id} image={<UpvoteToggler story={story} hearted={story.viewer_has_hearted} />} to="story" params={paramsFor.story({id: story.changelog}, story)}>
                <StoryCell story={story} />
              </Table.Cell>
            ))
        }
      </Table>
    )
  }
}
