import React from 'react'

export default class Badge extends React.Component {
  render() {
    const { badge, size } = this.props
    if (badge != null) {
      const hex = badge.unicode.replace('U+', '').toLowerCase()
      const src = `https://twemoji.maxcdn.com/svg/${hex}.svg`
      return <img className="block" src={src} alt={badge.name} style={{height: size}} />
    } else return null
  }
}

Badge.propTypes = {
  badge: React.PropTypes.object.isRequired,
  size:  React.PropTypes.string.isRequired
}

Badge.defaultProps = {
  size: '1rem'
}
