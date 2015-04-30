import React from 'react'

export default class Avatar extends React.Component {
  render() {
    const {size, user: {username, avatar_url}} = this.props
    const url = `${avatar_url}?s=${size * 2}`
    return <img className="block circle bg-mid-gray" src={url} style={{width: size, height: size}} alt={username} />
  }
}

Avatar.propTypes = {
  user: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
    avatar_url: React.PropTypes.string.isRequired
  }).isRequired,
  size: React.PropTypes.number.isRequired
}
