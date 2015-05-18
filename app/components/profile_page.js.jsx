import React from 'react'
import {Link} from 'react-router'
import {List, Set} from 'immutable'
import Button from 'components/ui/button.js.jsx'
import Avatar from 'components/ui/avatar.jsx'
import ProfileStore from 'stores/profile_store.js'
import ProfileActions from 'actions/profile_actions.js'
import ApplicationNavbar from 'components/application_navbar.jsx'
import BlurbBox from 'components/ui/blurb_box.jsx'

import EmojiPicker from 'components/ui/emoji_picker.jsx'

export default class ProfilePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetch(params.username)
  }

  constructor(props) {
    super(props)
    this.state = this.getStateFromStores()
    this.handleStoresChanged = this.handleStoresChanged.bind(this)
  }

  getStateFromStores() {
    return {
      user: ProfileStore.user
    }
  }

  handleStoresChanged() {
    this.setState(this.getStateFromStores());
  }

  componentDidMount() {
    ProfileStore.addChangeListener(this.handleStoresChanged)

  }

  componentWillUnmount() {
    ProfileStore.removeChangeListener(this.handleStoresChanged)
  }

  render_score_pair(emoji, score) {
    return (
      <span className="px1">
        {emoji}
        {score}
      </span>
    )
  }

  render_emoji_scores() {
    if (this.state.user) {
      const emojis = this.state.user.emoji_scores
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
        <Link to="story" params={{changelogId: story.changelog_slug, storyId: story.id}}>
          {emoj}{n}<span className="px2">{title}</span>
        </Link>
      </div>
    )
  }

  render_stories() {
    if (this.state.user) {
      const stories = this.state.user.stories_participated

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
    if (this.state.user) {
      var changelogs = this.state.user.changelogs
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
    const user = this.state.user
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
          <EmojiPicker />
          <div className="flex flex-column" style={{minHeight: 'calc(100vh - 3.5rem)'}}>

            <div className="clearfix mx-auto">
              <h1>{this.state.user.username}</h1>
              <Avatar user={this.state.user} size={128} />
            </div>
            <br />
            <div className="clearfix mx-auto">
              <div className="block">
                <div className="gray-2 center">
                  <BlurbBox text={this.state.user.blurb} owner={this.state.user.username} />
                </div>
              </div>
            </div>

            <br />

            <div className="clearfix mx-auto">
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

ProfilePage.propTypes = {
  user: React.PropTypes.object.isRequired
}
