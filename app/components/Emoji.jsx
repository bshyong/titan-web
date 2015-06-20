import React from 'react'

export default class Emoji extends React.Component {
  render() {
    const { emoji, size } = this.props
    const src = `https://twemoji.maxcdn.com/svg/${emoji.unicode}.svg`
    return (
      <img {...this.props} className="block" src={src} style={{width: size, height: size}} alt={emoji.name} />
    )
  }
}
