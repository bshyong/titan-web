import React from 'react'
import twemoji from 'twemoji'


const EmojiMappings = {
  'discussion': '💬',
  'improvement': '✅',
  'feature': '✅',
  'update': '🎉',
  'bugfix': '🐛',
  'doc': '📄',
  'default': '✅'
}

export default class Emoji extends React.Component {

  render() {
    const {char, size} = this.props
    const html = twemoji.parse(char, (icon, options, variant) => {
       return `https://twemoji.maxcdn.com/${size}x${size}/${icon}.png`
     })

    return <div dangerouslySetInnerHTML={{__html: html}} />
  }

}

Emoji.propTypes = {
  char: React.PropTypes.string.isRequired,
  size: React.PropTypes.oneOf([16, 36, 72]).isRequired
}
