import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import Icon from 'ui/Icon.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'
import {subscribe, unsubscribe} from 'actions/storyActions'
import {connect} from 'redux/react'

@connect(() => ({}))
export default class SubscribeStoryButton extends React.Component {
  static propTypes = {
    story: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { story } = this.props

    return (
      <div
        onClick={this.handleClick.bind(this)}
        className="pointer gray-hover">
          <Icon icon="newspaper" /> {story.viewer_has_subscribed ? 'Subscribed to notifications' : 'Subscribe to notifications'}
      </div>
    )
  }

  handleClick() {
    const { story } = this.props

    if (!SessionStore.isSignedIn()) {
      this.props.dispatch(AuthenticationFormActions.changeForm({
        formComponent: 'login',
        formContent: { redirectTo: window.location.pathname },
      }))
    }

    if (story.viewer_has_subscribed) {
      this.props.dispatch(unsubscribe(story.slug))
    } else {
      this.props.dispatch(subscribe(story.slug))
    }
  }
}
