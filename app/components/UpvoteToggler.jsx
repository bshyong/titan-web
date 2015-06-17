import React from 'react'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import classnames from 'classnames'

import UpvoteArrowSrc  from '../images/upvote-arrow.svg'
import UpvotedArrowSrc from '../images/upvoted-arrow.svg'

export default class UpvoteToggler extends React.Component {

  constructor(props) {
    super(props)
    this.handleClick = this._handleClick.bind(this)
    this.handleHover = this._handleHover.bind(this)

    this.state = {
      hovered: false
    }
  }

  render() {
    const {
      story: { hearts_count },
      hearted,
      size
    } = this.props

    const cn = classnames(
      'upvote-toggler',
      'flex flex-column flex-center pointer',
      {
        'upvote-toggler--sm': size === 'sm',
        'upvote-toggler--lg': size === 'lg',
        'upvote-toggler--unhearted gray': !hearted,
        'upvote-toggler--hearted orange': hearted
      })

    const src = (hearted || this.state.hovered) ? UpvotedArrowSrc : UpvoteArrowSrc

    return (
      <div className={cn} onClick={this.handleClick} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
        <img className="upvote-toggler-icon" src={src} />
        <div className="upvote-toggler-count">{hearts_count}</div>
      </div>
    )
  }

  _handleClick(e) {
    const { story } = this.props
    if (!SessionStore.isSignedIn()) {
      // FIXME (@chrislloyd): this probably isn't cool (calling an
      // action from an action) but it was a quick fix.
      SessionActions.signin()
      return
    }

    StoryActions.clickHeart(story)
  }

  _handleHover(e) {
    this.setState({hovered: !this.state.hovered})
  }
}

UpvoteToggler.propTypes = {
  story: React.PropTypes.object.isRequired,
  hearted: React.PropTypes.bool.isRequired,
  size: React.PropTypes.oneOf(['sm', 'lg']).isRequired
}

UpvoteToggler.defaultProps = {
  size: 'sm',
  hearted: false
}
