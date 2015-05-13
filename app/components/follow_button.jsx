import React from 'react'
import Button from 'components/ui/button.js.jsx'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'
import FollowActions from 'actions/follow_actions'

export default class FollowButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this._handleClick.bind(this)
  }

  render() {
    const { toggled } = this.props
    return (
      <Button color="white" style="outline" block={true} action={this.handleClick}>
        {toggled ? 'Following' : 'Follow Changelog'}
      </Button>
    )
  }

  _handleClick() {
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
