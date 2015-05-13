import React from 'react'
import Button from 'components/ui/button.js.jsx'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'
import FollowActions from 'actions/follow_actions'

export default class FollowButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Button bg="blue" text="white" block={true} action={this.handleOnClick.bind(this)}>
        {this.props.toggled ? 'Following' : 'Follow Changelog'}
      </Button>
    )
  }

  handleOnClick() {
    if (!SessionStore.isSignedIn()) {
      return SessionActions.signin()
    }

    if (this.props.toggled) {
      FollowActions.unfollow(this.props.changelogId)
    } else {
      FollowActions.follow(this.props.changelogId)
    }
  }
}

FollowButton.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  toggled: React.PropTypes.bool.isRequired
}
