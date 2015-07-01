import ApplicationNavbar from '../components/application_navbar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogBootstrapFlow from '../components/ChangelogBootstrapFlow.jsx'
import ChangelogCreation from '../components/ChangelogCreation.jsx'
import ChangelogStore from '../stores/changelog_store'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/Story/StoryForm.jsx'
import StoryFormStore from '../stores/story_form_store'
import connectToStores from '../lib/connectToStores.jsx'
import StoryGifSrc from '../images/interface.gif'
import TeamAdder from '../components/team_adder.jsx'
import ChangelogActions from 'actions/changelog_actions'

import ChangelogInviteLink from '../components/Changelog/ChangelogInviteLink.jsx'

@connectToStores(NewChangelogStore, ChangelogStore)
export default class InviteChangelogMembersPage extends React.Component {

  static willTransitionTo(params) {
    console.log(params)
    ChangelogActions.select(params.changelogId)
  }

  static getPropsFromStores(props) {
    return {
      memberships: NewChangelogStore.memberships,
      changelog: ChangelogStore.changelog
    }
  }

  render() {
    const { changelog } = this.props
    return (
      <div>
        <div className="flex flex-center full-width">
          <div className="container full-width px2">
            <div className="sm-col-9 mx-auto px2">
              <h2 className="center mt4">Invite your team</h2>

              <p>
                Anyone you add here will be members of your Changelog. They will be able to read, write, and comment on all posts.
              </p>

              <div className="mb2">
                <p>Send this private link to anyone you want to invite:</p>
                <ChangelogInviteLink changelog={changelog} />
              </div>

              <TeamAdder memberships={this.props.memberships}
                         changelog={changelog}
                         showBlankEntries={true} />
            </div>
          </div>
        </div>

        <div className="full-width border-top p2">
          <div className="container">
            <div className="sm-col-8 mx-auto p1 right-align">
              <Button disabled={!NewChangelogStore.isValid}
                      color="green"
                      bg="white"
                      style="outline"
                      action={function() {}}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
