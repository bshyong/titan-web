import React, {PropTypes} from 'react'

export default class MembersOnly extends React.Component {
  render() {
    if (!this.props.changelog.user_is_team_member) {
      return <div />
    }

    return this.props.children
  }
}
