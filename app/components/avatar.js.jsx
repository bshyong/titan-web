require('basscss/css/basscss.css')
import React from 'react'

const Avatar = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      username: React.PropTypes.string.isRequired,
      avatar_url: React.PropTypes.string.isRequired
    }).isRequired,
    size: React.PropTypes.string.isRequired
  },

  render() {
    const {size, user: {username, avatar_url}} = this.props
    const url = `${avatar_url}?s=64`
    return <img className="block circle bg-mid-gray" src={url} style={{width: size, height: size}} alt={username} />
  }
})

export default Avatar
