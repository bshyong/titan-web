import React from 'react'
let guestAvatar = require('../images/default_avatar.png')

export default class Avatar extends React.Component {
  render() {
    const { size } = this.props
    return (
      <img
        className="block circle bg-mid-gray"
        src={guestAvatar}
        style={{width: size, height: size}}
        alt="Guest Contributor" />
    )
  }
}
