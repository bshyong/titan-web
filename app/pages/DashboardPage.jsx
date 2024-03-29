import AppNavbar from 'components/App/AppNavbar.jsx'
import Button from '../ui/Button.jsx'
import * as changelogActions from 'actions/changelogActions'
import Dashboard from '../components/Dashboard.jsx'
import DocumentTitle from 'react-document-title'
import Jumbotron from '../ui/Jumbotron.jsx'
import React from 'react'
import Link from '../components/Link.jsx'
import fetchData from 'decorators/fetchData'

@fetchData(() => [
  changelogActions.fetchAll(),
  changelogActions.clearCurrent(),
])
export default class DashboardPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="Assembly">
        <div>
          <AppNavbar title="Assembly" onProduct="no" />
          <Jumbotron bgColor="smoke" color="black">
            <div className="sm-flex flex-center sm-mxn2 center sm-left-align">
              <div className="px2 mb2 sm-mb0">
                <h3 className="mt0 mb1 bold">
                  Bring ideas to life with people around the world.
                </h3>
                <p className="mb0">
                  Assembly is the simplest way to start and grow a community that gets things done.
                  Start your group, customizing everything down to the domain.
                  We'll help you find and stay connected with others that care.
                  Discuss ideas, share goals, and reach them with your new friends.
                </p>
              </div>
              <div className="flex-none px2">
                <Link to="newChangelog">
                  <Button bg="orange" size="big" block={true}>Create a Group</Button>
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
