import React from 'react'
import Icon from 'ui/Icon.jsx'

export default class ChangelogName extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      is_members_only: React.PropTypes.bool.isRequired,
    }).isRequired
  }

  render() {
    const { changelog } = this.props
    const title = changelog.is_members_only ? `Only ${changelog.name} members can view` : null
    return (
      <span title={title}>
        {changelog.is_members_only ? <Icon icon="lock" /> : null}
        {' '}
        {changelog.name}
      </span>
    )
  }
}
