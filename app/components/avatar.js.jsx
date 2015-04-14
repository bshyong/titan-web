import React from 'react'

const AvatarUrls = {
  chrislloyd: 'https://avatars2.githubusercontent.com/u/718?v=3&s=460',
  whatupdave: 'https://avatars3.githubusercontent.com/u/7064?v=3&s=460',
}

const Avatar = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      username: React.PropTypes.string.isRequired
    }).isRequired,
    size: React.PropTypes.number.isRequired
  },

  render() {
    const {size, user: {username}} = this.props
    const url = AvatarUrls[username]
    return <img className="block circle bg-mid-gray" src={url} style={{width: size, height: size}} alt={username} />
  }
})

export default Avatar
