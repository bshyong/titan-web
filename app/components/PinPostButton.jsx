import Icon from '../ui/Icon.jsx'
import React from 'react'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import classnames from 'classnames'

export default class PinPostButton extends React.Component {
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    post: React.PropTypes.object.isRequired,
    textOnHover: React.PropTypes.bool
  }

  static defaultProps = {
    textOnHover: false
  }

  render() {
    const { post, textOnHover } = this.props

    if (!SessionStore.isSignedIn()) {
      return <div />
    }

    return (
      <li className="px1">
        <span className="gray gray-hover pointer" onClick={this.handleClick}>
          {this.renderContent()}
        </span>
      </li>
    )
  }

  renderContent() {
    const { type, post } = this.props
    if (type === 'hover') {
      return <div className="flex flex-center">
        <span className='visible-hover mr1'>
          {post.pinned_at ? 'Unpin' : 'Pin'}
        </span> <Icon icon="thumb-tack" />
      </div>
    }
    return <div className="flex flex-center">
      <Icon icon="thumb-tack" /> <span className='ml1'>
        {post.pinned_at ? 'Unpin' : 'Pin'}
      </span>
    </div>
  }

  handleClick = () => {
    const { post, changelogId } = this.props

    if (post.pinned_at) {
      StoryActions.unpin(changelogId, post.slug)
    } else {
      StoryActions.pin(changelogId, post.slug)
    }
  }
}
