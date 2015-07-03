import Card from 'ui/Card.jsx'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import Logo from 'components/logo.jsx'
import React from 'react'

export default class ChangelogCard extends React.Component {
  render() {
    const { changelog } = this.props
    return (
      <Card>
        <div className="mb2 mx-auto" style={{width: '3rem'}}>
          <Logo changelog={changelog} size="3rem" />
        </div>
        <div className="center h4 bold black">
          <ChangelogName changelog={changelog} />
        </div>
        <div className="center gray">{changelog.tagline}</div>
      </Card>
    )
  }
}

ChangelogCard.propTypes = {
  changelog: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired
  }).isRequired
}
