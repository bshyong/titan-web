import {Link, RouteHandler} from 'react-router'
import Avatar from 'components/ui/avatar.jsx'
import ChangelogActions from 'actions/changelog_actions'
import ChangelogStore from 'stores/changelog_store'
import classnames from 'classnames'
import Icon from 'components/ui/icon.js.jsx'
import Navbar from 'components/ui/navbar.js.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'

// Logo versions:

import LogoSrc from 'images/logo.svg'

export default class ChangelogLayout extends React.Component {
  constructor() {
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
        <Navbar>
          <div className="flex mxn1">
            <div className="flex-none p1">
              <img className="block" src={LogoSrc} style={{height: '1.5rem'}} />
            </div>

            <h3 className="flex-auto mt0 mb0 p1">
              <div className="light-gray left mr2">
                <Icon icon="angle-right" />
              </div>
              <Link to="changelog" params={{changelogId: changelogId}} className="black">
                {this.state.changelog.name}
              </Link>
            </h3>

            <Link className="flex-none block p1" to="highlights" params={{changelogId: changelogId}}>Write</Link>

            {this.renderProfileNav()}
          </div>
        </Navbar>

        <div className="container px2">
          <RouteHandler />
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
