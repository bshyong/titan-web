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
    return (
      <span>
        {changelog.is_members_only ? <abbr title={`Only ${changelog.name} members can view`}><Icon icon="lock" /></abbr> : null}
        {' '}
        {changelog.name}
      </span>
    )
  }
}
