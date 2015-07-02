import Button from '../ui/Button.jsx'
import ChangelogInviteLink from '../components/Changelog/ChangelogInviteLink.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import TeamAdder from '../components/team_adder.jsx'

@connectToStores(ChangelogStore)
export default class InviteChangelogMembersPage extends React.Component {
  static getPropsFromStores(props) {
    return {
      memberships: ChangelogStore.memberships,
      changelog: ChangelogStore.changelog
    }
  }

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

              <TeamAdder memberships={this.props.memberships}
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

              <div className="right-align">
                <Button color="green"
                        bg="white"
                        style="outline"
                        action={this.handleNext.bind(this)}>
                  Write your first post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleNext() {
    RouterContainer.get().transitionTo("new", {changelogId: this.props.changelog.slug})
  }
}
