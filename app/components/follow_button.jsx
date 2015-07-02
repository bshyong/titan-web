import Button from '../ui/Button.jsx'
import FollowActions from '../actions/follow_actions'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'

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
      return SigninScrimActions.initialize(LoginForm, {}, window.location.pathname)
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
  toggled: React.PropTypes.bool
}
