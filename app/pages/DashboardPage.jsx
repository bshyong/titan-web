import AppNavbar from 'components/App/AppNavbar.jsx'
import AuthenticatedComponent from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import * as changelogActions from 'actions/changelogActions'
import Dashboard from '../components/Dashboard.jsx'
import DocumentTitle from 'react-document-title'
import Jumbotron from '../ui/Jumbotron.jsx'
import React from 'react'
import Link from '../components/Link.jsx'
import storyActions from 'actions/storyActions'
import fetchData from 'decorators/fetchData'

@fetchData(() => {
  return [
    storyActions.fetchFeed(),
    changelogActions.fetchAll(),
    changelogActions.clearCurrent(),
  ]
})
@AuthenticatedComponent()
export default class DashboardPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="Dashboard">
        <div>
          <AppNavbar title="Dashboard" />

          <Jumbotron bgColor="smoke" color="black">
            <div className="sm-flex flex-center sm-mxn2 center sm-left-align">
              <div className="px2 mb2 sm-mb0">
                <h3 className="mt0 mb1 bold">Stay connected with your team.</h3>
                <p className="mb0">
                  Follow everyone&#39;s progress, get feedback on your work,
                  and share your product updates with the world. &nbsp;
                  <img src="https://twemoji.maxcdn.com/svg/1f30e.svg" height="12" width="12"></img>
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
