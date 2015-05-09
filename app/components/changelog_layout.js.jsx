import {Link, RouteHandler} from 'react-router'
import ApplicationNavbar from 'components/application_navbar.jsx'
import Avatar from 'components/ui/avatar.jsx'
import Button from 'components/ui/button.js.jsx'
import ChangelogActions from 'actions/changelog_actions'
import ChangelogStore from 'stores/changelog_store'
import classnames from 'classnames'
import Icon from 'components/ui/icon.js.jsx'
import Logo from 'components/logo.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'
import FollowButton from 'components/follow_button.jsx'
import Jumbotron from 'components/ui/jumbotron.jsx'


export default class ChangelogLayout extends React.Component {
  constructor() {
    super()
    this.state = {
      changelog: ChangelogStore.changelog,
      user:      SessionStore.user
    }
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    ChangelogStore.addChangeListener(this.onStoreChange)
    SessionStore.addChangeListener(this.onStoreChange)

    ChangelogActions.select(RouterContainer.get().getCurrentParams().changelogId)
  }

  componentWillUnmount() {
    ChangelogStore.removeChangeListener(this.onStoreChange)
    SessionStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    if (!this.state.changelog) {
      return <div />
    }

    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return (
      <div>
        <ApplicationNavbar />

        <Jumbotron bgColor="white" bgImageUrl="https://github.com/images/modules/about/about-header.jpg">
          <div className="sm-flex flex-center">

            <div className="flex-none mb2 sm-mb0">
              <div className="mx-auto" style={{width: '4rem'}}><Logo size="4rem"/></div>
            </div>

            <Link className="block flex-auto mb2 md-mb0 sm-px3 center sm-left-align white" to="changelog" params={{changelogId}}>
              <h2 className="mt0 mb0">Meta</h2>
              <div>Building Assembly on Assembly.</div>

            </Link>

            <div className="flex-none sm-ml2">
              <FollowButton changelog={this.state.changelog}/>
            </div>
          </div>
        </Jumbotron>

        <div className="container">
          <RouteHandler changelogId={changelogId} />
        </div>
      </div>
    )
  }

  renderProfileNav() {
    if (!this.state.user) {
      return
    }
    return (
      <div className="flex-none p1">
        <a href="#" onClick={SessionActions.signout}>
          <Avatar user={this.state.user} size={24} />
        </a>
      </div>
    )
  }

  _onStoreChange() {
    this.setState({
      changelog: ChangelogStore.changelog,
      user:      SessionStore.user
    })
  }
}
