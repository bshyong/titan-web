import React from 'react'
import Button from 'components/ui/button.js.jsx'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'
import FollowActions from 'actions/follow_actions'
import FollowersStore from 'stores/followers_store'

export default class FollowButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      following: false
    }
    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleOnClick = this._handleOnClick.bind(this)
  }

  componentDidMount() {
    FollowersStore.addChangeListener(this.onStoreChange)
    FollowActions.fetchAll(this.props.changelog)
  }

  componentWillUnmount() {
    FollowersStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return (
      <Button bg="white" text="blue" block={true} action={this.handleOnClick}>
        {this.state.following ? 'Following' : 'Follow'} Changelog
      </Button>
    )
  }

  _handleOnClick() {
    if (!SessionStore.isSignedIn()) {
      return SessionActions.signin()
    }

    if (this.state.following) {
      FollowActions.unfollow(this.props.changelog)
    } else {
      FollowActions.follow(this.props.changelog)
    }
  }

  _onStoreChange() {
    this.setState({
      following: FollowersStore.following()
    })
  }
}

FollowButton.propTypes = {
  changelog: React.PropTypes.object.isRequired
}
