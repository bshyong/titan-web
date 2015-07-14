import * as AuthenticationFormActions from 'actions/AuthenticationFormActions'
import Button from '../ui/Button.jsx'
import { connect } from 'redux/react'
import FollowActions from '../actions/FollowActions'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import SessionStore from '../stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'

@connect(state => ({}))
export default class FollowButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this._handleClick.bind(this)
  }

  render() {
    const { toggled } = this.props

    if (toggled) {
      return <Button color="white" style="outline" block action={this.handleClick}>
        Following
      </Button>
    } else {
      return (
        <Button block bg="white" color="orange" action={this.handleClick}>
          Follow
        </Button>
      )
    }
  }

  _handleClick() {
    if (!SessionStore.isSignedIn()) {
      this.props.dispatch(AuthenticationFormActions.changeForm({
        formComponent: 'login',
        formContent: { redirectTo: window.location.pathname }
      }))
      return
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
