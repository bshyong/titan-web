import {connect} from 'redux/react'
import Button from 'ui/Button.jsx'
import ChangelogInviteLink from 'components/Changelog/ChangelogInviteLink.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import TeamAdder from 'components/TeamAdder.jsx'

@connect(state => ({
  coreMemberships: state.memberships.core,
  changelog: state.currentChangelog.changelog,
}))
export default class InviteChangelogMembersPage extends React.Component {
  render() {
    const { changelog } = this.props

    if (!changelog) {
      return null
    }

    return (
      <div>
        <div className="flex flex-center full-width">
          <div className="container full-width px2">
            <div className="sm-col-9 mx-auto px2">
              <h2 className="center mt4 mb3">Invite your team</h2>

              <p>
                Anyone you add here will be members of your Changelog. They will be able to read, write, and comment on all posts.
              </p>

              <TeamAdder memberships={this.props.coreMemberships}
                         changelog={changelog}
                         showBlankEntries={true}
                         showNumbers={true} />

              <hr />

              <div className="mb2">
                <p>
                  Or send this private link to your team in Slack or via. email to make it easy
                  for them to sign up.
                </p>
                <ChangelogInviteLink changelog={changelog} />
              </div>

              <hr />

              <div className="right-align mb4">
                <Button color="green"
                        bg="white"
                        style="outline"
                        action={this.handleNext.bind(this)}>
                  Voilà!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleNext() {
    RouterContainer.get().transitionTo(`/${this.props.changelog.slug}`, {})
  }
}
