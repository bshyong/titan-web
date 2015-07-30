import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import { connect } from 'redux/react'
import React from 'react'
import SessionStore from '../stores/session_store'
import StoryActions from 'actions/story_actions'
import classnames from 'classnames'
import Icon from 'ui/Icon.jsx'

@connect(() => ({}))
export default class UpvoteToggler extends React.Component {

  constructor(props) {
    super(props)
    this.handleClick = this._handleClick.bind(this)
    this.handleHover = this._handleHover.bind(this)

    this.state = {
      hovered: false,
    }
  }

  render() {
    const {
      story: { hearts_count },
      hearted,
      size,
    } = this.props

    const cn = classnames(
      'upvote-toggler',
      'flex flex-column flex-center pointer',
      {
        'upvote-toggler--sm': size === 'sm',
        'upvote-toggler--lg': size === 'lg',
        'upvote-toggler--unhearted gray': !hearted,
        'upvote-toggler--hearted orange': hearted,
      })

    return (
      <div className={cn} onClick={this.handleClick} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
        <div className="upvote-toggler-icon">
          <Icon icon="heart" />
        </div>
        <div className="upvote-toggler-count">{hearts_count}</div>
      </div>
    )
  }

  _handleClick() {
    const { story } = this.props
    if (!SessionStore.isSignedIn()) {
      this.props.dispatch(AuthenticationFormActions.changeForm({
        formComponent: 'login',
        formContent: { redirectTo: window.location.pathname },
      }))
      return
    }

    StoryActions.clickHeart(story)
  }

  _handleHover() {
    this.setState({hovered: !this.state.hovered})
  }
}

UpvoteToggler.propTypes = {
  story: React.PropTypes.object.isRequired,
  hearted: React.PropTypes.bool.isRequired,
  size: React.PropTypes.oneOf(['sm', 'lg']).isRequired,
}

UpvoteToggler.defaultProps = {
  size: 'sm',
  hearted: false,
}
