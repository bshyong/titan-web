import Avatar from '../../ui/Avatar.jsx'
import React from 'react'
import SessionStore from '../../stores/session_store'
import moment from '../../config/moment'

export default class UserCell extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flaired: false
    }
    this.handleToggleFlair = this._handleToggleFlair.bind(this)
  }

  render() {
    const { user } = this.props

    return (
      <div className="flex flex-column flex-center p3 md-p4 bg-white">
        <div className="mb2"
             onMouseEnter={this.handleToggleFlair}
             onMouseLeave={this.handleToggleFlair}>
          <Avatar user={user} size={16 * 10} flaired={this.state.flaired} />
        </div>
        <div className="center">
          <h2 className="mt0 mb0 bold">{user.username}</h2>
          {this.renderBlurb.bind(this)()}
        </div>
          {this.renderStaffOnlyInfo()}
      </div>
    )
  }

  renderStaffOnlyInfo() {
    const { user } = this.props
    if (SessionStore.user && SessionStore.user.staff_at !== null) {
      return (
        <p className="center">
          {user.email}<br />
        Last request: {moment(user.last_request_at).fromNow()}
        </p>
      )
    }
  }

  renderBlurb() {
    const { user: { blurb } } = this.props

    if(!blurb || blurb === '') {
      return
    }

    return <p className="gray mt1 mb0">{blurb}</p>
  }

  _handleToggleFlair() {
    this.setState({flaired: !this.state.flaired})
  }
}

UserCell.propTypes = {
  user: React.PropTypes.shape({
    username: React.PropTypes.string.isRequired,
    blurb: React.PropTypes.string,
    avatar_url: React.PropTypes.string.isRequired,
    flair_url: React.PropTypes.string,
  }).isRequired
}
