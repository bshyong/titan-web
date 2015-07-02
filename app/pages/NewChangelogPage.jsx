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

@connectToStores(NewChangelogStore, ChangelogStore, StoryFormStore)
export default class ChangelogOnboardingPage extends React.Component {
  static getPropsFromStores(props) {
    return {
      memberships: NewChangelogStore.memberships,
      changelogId: ChangelogStore.slug,
      changelog: ChangelogStore.changelog
    }
  }

  render() {
    return (
      <div>
        <ApplicationNavbar title="New Changelog" />

        <div className="flex flex-center full-width">
          <div className="container full-width px2">
            <div className="sm-col-9 mx-auto px2">
              <h2 className="center mt4">Start a new changelog</h2>
              <p className="center mb3">
                Changelogs make it easy to share what you and your team have accomplished, from fixing bugs and releasing new features, to organizational updates.
              </p>
              <ChangelogCreation ref="form" />
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
                      action={this.handleChangelogCreation.bind(this)}
                      ref="nextButton">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleChangelogCreation() {
    NewChangelogActions.create(this.handleRedirect)
  }

  handleRedirect() {
    const changelogId = ChangelogStore.slug
    RouterContainer.get().transitionTo("inviteChangelogMembers", {
      changelogId: changelogId
    })
  }
}
