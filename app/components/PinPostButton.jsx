import Icon from '../ui/Icon.jsx'
import React from 'react'
import StoryActions from '../actions/story_actions'
import classnames from 'classnames'

export default class PinPostButton extends React.Component {
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    post: React.PropTypes.object.isRequired,
    type: React.PropTypes.oneOf(['hoverText', 'normal']),
    disabled: React.PropTypes.bool,
  }

  static defaultProps = {
    type: 'normal'
  }

  render() {
    const { post, textOnHover, disabled } = this.props

    return (
      <li className="px1">
        <span className='gray' onClick={this.handleClick}>
          {this.renderContent()}
        </span>
      </li>
    )
  }

  renderContent() {
    const { type, post, disabled } = this.props
    if (type === 'hoverText') {
      return this.renderHoverType()
    }
    return <div className="flex flex-center gray-hover pointer">
      <Icon icon="thumb-tack" /> <span className='ml1'>
        {post.pinned_at ? 'Unpin' : 'Pin'}
      </span>
    </div>
  }

  renderHoverType() {
    const { post, disabled } = this.props
    const icon = <Icon icon="thumb-tack" />

    if (disabled) {
      return icon
    }
    return <div className="flex flex-center gray-hover visible-hover-wrapper pointer">
      <span className='visible-hover mr1'>
        {post.pinned_at ? 'Unpin' : 'Pin'}
      </span> {icon}
    </div>
  }

  handleClick = () => {
    const { post, changelogId, disabled } = this.props
    if (disabled) { return }

    if (post.pinned_at) {
      StoryActions.unpin(changelogId, post.slug)
    } else {
      StoryActions.pin(changelogId, post.slug)
    }
  }
}
