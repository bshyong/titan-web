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
    const { gif_url } = this.props.user
    if(this.props.flaired && gif_url) {
      return gif_url
    } else {
      const {size, user: {avatar_url}} = this.props
      return `${avatar_url}&s=${size * 2}`
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
