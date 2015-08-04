import Card from 'ui/Card.jsx'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import Logo from 'components/logo.jsx'
import React from 'react'
import Avatar from 'ui/Avatar.jsx'
import Stack from 'ui/Stack.jsx'

export default class ChangelogCard extends React.Component {
  render() {
    const { changelog } = this.props
    return (
      <Card>
        <div className="flex flex-center">
          <div className="flex-auto px1">
            <div className="h2 black">
              <ChangelogName changelog={changelog} />
            </div>
            <div className="black">{changelog.tagline}</div>
            {this.renderLatestConvo()}
          </div>
          <div className="flex-none mr1">
            {this.renderFollowers()}
          </div>
          <div className="flex-none" style={{width: '3rem'}}>
            <Logo changelog={changelog} size="3rem" />
          </div>
        </div>
      </Card>
    )
  }

  renderFollowers() {
    const { changelog } = this.props
    if (changelog.followers_count > 3) {
      return <div className="flex flex-center">
        {this.renderAvatarStack()}
        <div className="gray px1">+ {changelog.followers_count - 3}</div>
      </div>
    } else {
      return this.renderAvatarStack()
    }
  }

  renderAvatarStack() {
    const { changelog } = this.props

    if (changelog.followers) {
      return <Stack
        items={changelog.followers.map(u => <Avatar user={u} size={24} />)} align="right" />
    }

    return null
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
