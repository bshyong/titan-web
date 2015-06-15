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
import { Link } from 'react-router'

@AuthenticatedComponent()
export default class DashboardPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ChangelogActions.fetchAll()
    FollowingActions.fetchFollowing(SessionStore.user.username)
    ChangelogActions.clearCurrent()
  }

  render() {
    return (
      <DocumentTitle title="Dashboard">
        <div>
          <ApplicationNavbar />
          <Jumbotron bgColor="white" color="black">
            <p className="center col-8 mx-auto">
              Hey, you found us (it wasn’t a big secret anyway). We’re building a
              powerful communication tool and we’d love your help to make it
              {' '}<em>ab-so-lute-ly</em> amazing. Give it a go,
              {' '}<a href="mailto:christine@assembly.com">send copious
              feedback</a>, and turn down for what.
            </p>
            <div className="center">
              <Link to="newChangelog">
                <Button bg="green">Create your own Changelog</Button>
              </Link>
            </div>
          </Jumbotron>

          <div className="container px2">
            <Dashboard />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
