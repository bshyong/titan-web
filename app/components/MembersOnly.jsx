import React, { Component, PropTypes } from 'react'

export default class MembersOnly extends Component {
  static propTypes = {
    changelog: PropTypes.shape({
      user_is_team_member: React.PropTypes.bool
    }).isRequired
  }

  render() {
    if (!this.props.changelog.user_is_team_member) {
      return <div />
    }

    return this.props.children
  }
}
