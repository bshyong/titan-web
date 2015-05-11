import React from 'react'
import twemoji from 'twemoji'
import StoryActions from 'actions/story_actions'

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
    this.handleClick = this._handleClick.bind(this)
  }

  render() {
    const {story: {labels}, size} = this.props

    const label = labels[0] || 'default'
    const char = EmojiMappings[label.toLowerCase()] || '👍'

    const html = twemoji.parse(char, (icon, options, variant) => {
       return `https://twemoji.maxcdn.com/${size}x${size}/${icon}.png`
     })

    return <div dangerouslySetInnerHTML={{__html: html}} onClick={this.handleClick} />
  }

  _handleClick(e) {
    e.preventDefault()
    StoryActions.heart(this.props.story.id)
  }

}

Emoji.propTypes = {
  story: React.PropTypes.shape({
    labels: React.PropTypes.array
  }).isRequired,
  size: React.PropTypes.oneOf([16, 36, 72]).isRequired
}
