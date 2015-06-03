import Avatar from '../../ui/Avatar.jsx'
import React from 'react'

export default class UserCell extends React.Component {

  render() {
    const { user } = this.props

    return (
      <div className="flex flex-column flex-center p3 bg-white">
        <div className="mb2">
          <Avatar user={user} size={16 * 8} />
        </div>
        <div className="center mb2">
          <h3 className="mt0 mb0">{user.username}</h3>
          <p className="gray mb0">{user.blurb}</p>
        </div>
      </div>
    )
  }

}

UserCell.propTypes = {
  user: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
    blurb: React.PropTypes.string.isRequired,
  }).isRequired
}
