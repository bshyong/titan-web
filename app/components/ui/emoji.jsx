import React from 'react'
import twemoji from 'twemoji'
import StoryActions from '../../actions/story_actions'
import classnames from 'classnames'
import emoji from '../../lib/emoji'

export default class Emoji extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {
      story: { hearts_count },
      hearted,
      onClick,
      size
    } = this.props

    const cn = classnames('emoji-container', 'flex flex-center pointer', {
      'emoji-container--sm': size == 'sm',
      'emoji-container--lg flex-column': size == 'lg',
      'emoji-container--unhearted': !hearted,
      'emoji-container--hearted': hearted
    })

    return (
      <div className={cn} onClick={onClick}>
        {this.icon()}
        <div className="emoji-count">{hearts_count}</div>
      </div>
    )
  }

  icon() {
    const {story: {labels}} = this.props
    var char = ""
    if (!this.props.story.emoji) {
      const label = (labels && labels[0]) || 'default'
      char = emoji[label.toLowerCase()] || '👍'
    }
    else {
      char = this.props.story.emoji.character
    }

    const html = twemoji.parse(
      char,
      icon => `https://twemoji.maxcdn.com/svg/${icon}.svg`
    )
    return <div dangerouslySetInnerHTML={{__html: html}} />
  }
}

Emoji.propTypes = {
  story: React.PropTypes.object.isRequired,
  hearted: React.PropTypes.bool.isRequired,
  size: React.PropTypes.oneOf(['sm', 'lg']).isRequired,
  onClick: React.PropTypes.func
}

Emoji.defaultProps = {
  size: 'sm',
  hearted: false
}
