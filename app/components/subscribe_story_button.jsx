import Icon from '../ui/Icon.jsx'
import React from 'react'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'

export default class SubscribeStoryButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { story } = this.props

    return (
      <span
        onClick={this.handleClick.bind(this)}
        className="gray pointer">
          <Icon icon="newspaper" /> {story.viewer_has_subscribed ? 'Unsubscribe' : 'Subscribe'}
      </span>
    )
  }

  handleClick() {
    const { story } = this.props

    if (!SessionStore.isSignedIn()) {
      return SessionActions.signin()
    }

    if (story.viewer_has_subscribed) {
      StoryActions.unsubscribe(story.slug)
    } else {
      StoryActions.subscribe(story.slug)
    }
  }
}

SubscribeStoryButton.propTypes = {
  story: React.PropTypes.object.isRequired,
}
