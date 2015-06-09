import React from 'react'
import Logo from '../logo.jsx'
import Card from '../../ui/Card.jsx'

export default class ChangelogCard extends React.Component {
  render() {
    const { changelog } = this.props
    return (
      <Card>
        <div className="mb2 mx-auto" style={{width: '3rem'}}>
          <Logo changelog={changelog} size="3rem" />
        </div>
        <div className="center h4 bold black">{changelog.name}</div>
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
