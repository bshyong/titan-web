import Avatar from '../../ui/Avatar.jsx'
import React from 'react'

export default class UserCell extends React.Component {

  render() {
    const { user } = this.props

    return (
      <div className="flex flex-column flex-center p4 bg-white">
        <div className="mb2">
          <Avatar user={user} size={16 * 10} />
        </div>
        <div className="center">
          <h2 className="mt0 mb1 bold">{user.username}</h2>
          <p className="mb0">{user.blurb}</p>
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
