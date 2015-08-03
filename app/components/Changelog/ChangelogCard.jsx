import Card from 'ui/Card.jsx'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import Logo from 'components/logo.jsx'
import React from 'react'

export default class ChangelogCard extends React.Component {
  render() {
    const { changelog } = this.props
    return (
      <Card>
        <div className="flex flex-center">
          <div className="flex-auto">
            <div className="h2 black">
              <ChangelogName changelog={changelog} />
            </div>
            <div className="black">{changelog.tagline}</div>
            {this.renderLatestConvo()}
          </div>
          <div className="flex-none" style={{width: '3rem'}}>
            <Logo changelog={changelog} size="3rem" />
          </div>
        </div>
      </Card>
    )
  }

  renderLatestConvo() {
    const { changelog } = this.props

    if (changelog.latest_story_title) {
      return <div className="gray mt1">
        <span className="bold">Latest convo: </span>
        <span className="italic">{changelog.latest_story_title}</span>
      </div>
    }
    return null
  }
}

ChangelogCard.propTypes = {
  changelog: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
  }).isRequired,
}
