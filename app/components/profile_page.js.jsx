import {Link} from 'react-router'
import {List, Set} from 'immutable'
import Button from './ui/button.js.jsx'
import Avatar from './ui/avatar.jsx'
import ApplicationNavbar from './application_navbar.jsx'
import BlurbBox from './ui/blurb_box.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import EmojiPicker from './ui/emoji_picker.jsx'
import ProfileStore from '../stores/profile_store.js'
import ProfileActions from '../actions/profile_actions.js'
import React from 'react'

@connectToStores(ProfileStore)
export default class ProfilePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetch(params.username)
  }

  static getPropsFromStores() {
    return {
      user: ProfileStore.user
    }
  }

  render_score_pair(emoji, score) {
    if (score > 0) {
      return (
        <span className="px1">
          {emoji}
          {score}
        </span>
      )
    }
  }

  render_emoji_scores() {
    if (this.props.user) {
      const emojis = this.props.user.emoji_scores
      return (
        <div>
          <h2>Emojishments</h2>
          {Object.keys(emojis).map((key) => {
            return this.render_score_pair(key, emojis[key])
          })}
        </div>
      )
    }
  }

  render_story(story) {
    var emoj = ""
    var n = story.hearts_count
    if (story.emoji)
    {
      emoj = story.emoji.character
    }
    else {
      emoj = ""
    }

    var title = story.title
    if (story.written) {
      title = <b>{title}</b>
    }
    return (
      <div className="px1 py1">
        <Link to="story" params={story.urlParams}>
          {emoj}{n}<span className="px2">{title}</span>
        </Link>
      </div>
    )
  }

  render_stories() {
    if (this.props.user) {
      const stories = this.props.user.stories_participated

      return (
        <div>
          <h2>Posts</h2>
          { List(stories).
              sortBy(story => story.hearts_count).
              reverse().
              map(story => { return this.render_story(story) })  }
        </div>
      )
    }
  }

  renderProduct(changelog) {
    var part = " "
    if (changelog.participation=="member") {
      part = "⭐️ "
    }
    return (
      <div>
        <Link to="changelog" params={{changelogId: changelog.slug}}>
          {part}{changelog.name}{"   "}{changelog.followers_count}
        </Link>
      </div>
    )
  }

  renderProducts() {
    if (this.props.user) {
      var changelogs = this.props.user.changelogs
      var participation_emoji = ""
      return (
        <div>
          <h2>Changelogs</h2>
          {List(changelogs).
            sortBy(story => story.followers_count).
            reverse().
            map(changelog => { return this.renderProduct(changelog) })  }
        </div>

      )
    }
  }

  render() {
    const user = this.props.user
    if (!user) {
      return (
        <div />
      )
    }
    else {

      var blurb = ""
      if (user.blurb != null) {
        blurb = user.blurb
      }
      return (
        <div>
          <ApplicationNavbar />
          <div className="container">

            <div className="center">
              <h1>{this.props.user.username}</h1>
              <div style={{width: 128}} className="mx-auto">
                <Avatar user={this.props.user} size={128} />
              </div>
            </div>
            <div className="clearfix mx-auto py2">
              <div className="block">
                <div className="gray-2 center">
                  <BlurbBox text={this.props.user.blurb} owner={this.props.user.username} />
                </div>
              </div>
            </div>

            <div className="clearfix mxn2">
              <div className="col col-4 px2">
                {this.render_emoji_scores()}
              </div>

              <div className="col-right col col-4 px2 ">
                {this.render_stories()}
              </div>

              <div className="col col-4 px2">
                {this.renderProducts()}
              </div>

            </div>
          </div>
        </div>
      )
    }
  }
}
