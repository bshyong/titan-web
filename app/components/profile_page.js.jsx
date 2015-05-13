import React from 'react'
import {Link} from 'react-router'
import Button from 'components/ui/button.js.jsx'
import Avatar from 'components/ui/avatar.jsx'
import ProfileStore from 'stores/profile_store.js'
import ProfileActions from 'actions/profile_actions.js'
import ApplicationNavbar from 'components/application_navbar.jsx'

export default class ProfilePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    console.log(params)
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

    return (
      <div className="px1 py1">
        <Link to="story" params={{changelogId: story.changelog_slug, storyId: story.id}}>
          {emoj}{n}<span className="px2">{story.title}</span>
        </Link>
      </div>
    )
  }

  render_stories() {
    if (this.state.user) {
      const stories = this.state.user.stories_written
      return (
        <div>
          <h2>Posts</h2>
          { stories.map(story => { return this.render_story(story) })  }
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
      return (
        <div>
          <ApplicationNavbar />
          <div className="flex flex-column" style={{minHeight: 'calc(100vh - 3.5rem)'}}>

            <div className="clearfix mx-auto">
              <div className="">
                <h1>{this.state.user.username}</h1>
                <Avatar user={this.state.user} size={128} />
              </div>
            </div>


            <div className="clearfix mx-auto">
              <div className="col col-4 px2">
                {this.render_emoji_scores()}
              </div>

              <div className="col-right col col-4 px2 ">
                {this.render_stories()}
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
