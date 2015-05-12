import React from 'react'
import twemoji from 'twemoji'
import StoryActions from 'actions/story_actions'
import classnames from 'classnames'

const EmojiMappings = {
  'discussion': '💬',
  'improvement': '🔧',
  'feature': '🚀',
  'update': '🎉',
  'bugfix': '🐛',
  'doc': '📄',
  'default': '👍',
  'idea': '💡'
}

export default class Emoji extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {
      story: { hearts_count },
      hearted,
      size,
      onClick
    } = this.props

    const cn = classnames('emoji-container', 'flex flex-center pointer', {
      'emoji-container--sm': size == 'sm',
      'emoji-container--lg flex-column': size == 'lg',
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
    const label = labels[0] || 'default'
    const char = EmojiMappings[label.toLowerCase()] || '👍'
    const html = twemoji.parse(
      char,
      icon => `https://twemoji.maxcdn.com/svg/${icon}.svg`
    )
    return <div dangerouslySetInnerHTML={{__html: html}} />
  }
}

Emoji.propTypes = {
  story: React.PropTypes.shape({
    labels: React.PropTypes.array.isRequired,
    hearts_count: React.PropTypes.number.isRequired
  }).isRequired,
  hearted: React.PropTypes.bool.isRequired,
  size: React.PropTypes.oneOf(['sm', 'lg']).isRequired,
  onClick: React.PropTypes.func
}

Emoji.defaultProps = {
  size: 'sm',
  hearted: false
}
