import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'
import Button from './ui/button.js.jsx'
import Avatar from './ui/avatar.jsx'
import ApplicationNavbar from './application_navbar.jsx'
import BlurbBox from './ui/blurb_box.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import EmojiPicker from './ui/emoji_picker.jsx'
import ProfileStore from '../stores/profile_store.js'
import ProfileActions from '../actions/profile_actions.js'
import React from 'react'

import Table from './ui/table.jsx'
import StoryTableCell from './StoryTableCell.jsx'

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

          <div className="flex flex-center">
            <div className="mx-auto">

              {this.renderProfileBadges()}

            </div>
          </div>
        </div>

        <div className="bg-smoke p3 center">
          {this.renderBadges()}
        </div>


        <div className="container">
          <h2>Recent stories</h2>
          <Table>
            {this.renderStories()}
          </Table>
        </div>

      </div>
    )
  }

  renderProfileBadges() {
    return (
      <div className="flex flex-justify bg-white border pill px2">
        <div className="flex-auto center px2 py1">
          👍
        </div>
        <div className="flex-auto center px2 py1 border-left">
          🍰
        </div>
        <div className="flex-auto center px2 py1 border-left">
          ⛺️
        </div>
      </div>
    )
  }

  renderBadges() {
    const emojis = this.props.user.emoji_scores
    return (
      <div className="clearfix mxn2">
        {Map(emojis).map((count, emoji) =>
          <div className="col col-6 sm-col-1 px2 mb2">
            <div className="border border-white rounded p1 center">
              <div>{emoji}</div>
              {count}
            </div>
          </div>
        )}
      </div>
    )
  }

  renderStories() {
    const stories = this.props.user.stories_participated
    return (
      <Table>
        <Table.Separator label="Recent stories" />
        {
          List(stories)
            .sortBy(story => story.hearts_count)
            .reverse()
            .map(story => <StoryTableCell story={story} />)
        }
      </Table>
    )
  }
}
