import { connect } from 'redux/react'
import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import {follow, unfollow} from 'actions/changelogActions'
import Button from 'ui/Button.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'

@connect(() => ({}))
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
    }

    return (
      <Button block bg="white" color="orange" action={this.handleClick}>
        Follow
      </Button>
    )
  }

  _handleClick() {
    if (!SessionStore.isSignedIn()) {
      this.props.dispatch(AuthenticationFormActions.changeForm({
        formComponent: 'login',
        formContent: { redirectTo: window.location.pathname },
      }))
      return
    }

    if (this.props.toggled) {
      this.props.dispatch(unfollow(this.props.changelogId))
    } else {
      this.props.dispatch(follow(this.props.changelogId))
    }
  }
}

FollowButton.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  toggled: React.PropTypes.bool,
}
