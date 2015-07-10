import {connect} from 'redux/react'
import {create} from 'actions/newChangelogActions'
import AppNavbar from 'components/App/AppNavbar.jsx'
import authenticatedComponent from 'components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import NewChangelog from '../components/NewChangelog.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'

@authenticatedComponent()
@connect(state => ({
  canCreate: state.newChangelog.canCreate
}))
@connectToStores(ChangelogStore)
export default class ChangelogOnboardingPage extends React.Component {
  static getPropsFromStores(props) {
    return {
      memberships: ChangelogStore.memberships,
      changelogId: ChangelogStore.slug,
      changelog: ChangelogStore.changelog,
    }
  }

  render() {
    return (
      <div>
        <AppNavbar title="New Changelog" />

        <div className="flex flex-center full-width">
          <div className="container full-width px2">
            <div className="sm-col-9 mx-auto px2">
              <h2 className="center mt4">Start a new changelog</h2>
              <p className="center mb3">
                Changelogs make it easy to share what you and your team have accomplished, from fixing bugs and releasing new features, to organizational updates.
              </p>
              <NewChangelog ref="form" />
            </div>
          </div>
        </div>

        <div className="full-width border-top p2">
          <div className="container">
            <div className="sm-col-8 mx-auto p1 right-align">
              <Button disabled={!this.props.canCreate}
                      color="green"
                      bg="white"
                      style="outline"
                      action={this.handleNewChangelog.bind(this)}
                      ref="nextButton">
                Next, invite your team
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleNewChangelog() {
    this.props.dispatch(create(this.handleRedirect))
  }

  handleRedirect() {
    const changelogId = ChangelogStore.slug
    RouterContainer.get().transitionTo("inviteChangelogMembers", {
      changelogId: changelogId
    })
  }
}
