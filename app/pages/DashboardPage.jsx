import ApplicationNavbar from '../components/application_navbar.jsx'
import AuthenticatedComponent from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import Dashboard from '../components/Dashboard.jsx'
import DocumentTitle from 'react-document-title'
import FollowingActions from '../actions/follow_actions'
import Jumbotron from '../ui/Jumbotron.jsx'
import React from 'react'
import SessionStore from '../stores/session_store'
import Link from '../components/Link.jsx'
import StoryActions from 'actions/story_actions'

@AuthenticatedComponent()
export default class DashboardPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ChangelogActions.fetchAll()
    FollowingActions.fetchFollowing(SessionStore.user.username)
    ChangelogActions.clearCurrent()
    StoryActions.fetchFeed()
  }

  render() {
    return (
      <DocumentTitle title="Dashboard">
        <div>
          <ApplicationNavbar title="Dashboard" />
          <Jumbotron bgColor="smoke" color="black">
            <div className="sm-flex flex-center sm-mxn2 center sm-left-align">
              <div className="px2 mb2 sm-mb0">
                <h3 className="mt0 mb1 bold">Stay connected with your team.</h3>
                <p className="mb0">
				  Know everyone's progress, get feedback on your work, 
				  and share your product updates with the world.
                </p>
              </div>
              <div className="flex-none px2">
                <Link to="newChangelog">
                  <Button bg="orange" size="big" block={true}>Create Changelog</Button>
                </Link>
              </div>
            </div>
          </Jumbotron>
          <div className="container px0 sm-px2 mb4">
            <Dashboard />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
