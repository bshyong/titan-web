import React from 'react'

export default class Avatar extends React.Component {
  render() {
    const {size, user: {username, avatar_url}} = this.props
    return (
      <img
        className="block circle bg-mid-gray"
        src={this.url()}
        style={{width: size, height: size}}
        alt={username}
      />
    )
  }

  url() {
    if(this.props.flaired && this.props.user.flair_url) {
      return this.props.user.flair_url
    } else {
      const {size, user: {avatar_url}} = this.props
      return `${avatar_url}?s=${size * 2}`
    }
  }
}

Avatar.propTypes = {
  user: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
    avatar_url: React.PropTypes.string.isRequired,
    flair_url: React.PropTypes.string
  }).isRequired,
  size: React.PropTypes.number.isRequired,
  flaired: React.PropTypes.bool.isRequired,
}

Avatar.defaultProps = {
  flaired: false
}
