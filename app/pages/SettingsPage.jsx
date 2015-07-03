import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import ApplicationNavbar from '../components/application_navbar.jsx'
import authenticated from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Link from '../components/Link.jsx'
import Logo from '../components/logo.jsx'
import paramsFor from '../lib/paramsFor'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'

@connectToStores(ProfileStore)
export default class SettingsPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetchChangelogs(SessionStore.user.username)
    ChangelogActions.clearCurrent()
  }

  static getPropsFromStores(props) {
    return {
      user: SessionStore.user,
      changelogs: (ProfileStore.changelogs || [])
    }
  }

  render() {
    return (
      <div>
        <ApplicationNavbar title="Settings" />
        <div className="container">
          <div className="flex" style={{minHeight: 'calc(100vh - 3.5rem)'}}>

            <div className="col-3 border-right py4">
              <div className="mb4">
                <h4 className="mt0 mb2 gray">Personal Settings</h4>
                <Link to="profile_settings" className="block px2 py1 black bg-smoke-hover"
                    activeClassName="bg-smoke bold">
                  Profile
                </Link>
              </div>

              <div className="mb4">
                <h4 className="mt0 mb2 gray">Changelogs</h4>
                {this.renderChangelogLinks()}
              </div>
            </div>

            <div className="col col-9 p4">
              <RouteHandler />
            </div>

          </div>
        </div>
      </div>
    )
  }

  renderChangelogLinks() {
    return List(this.props.changelogs).sortBy(c => c.name).map((c, i) => {
      return (
        <Link to="changelog_settings" activeClassName="bg-smoke bold" params={{changelogId: c.slug}}
          className="flex flex-center px2 py1 black bg-smoke-hover" key={c.id}>
          <div className="mr1">
            <Logo changelog={c} size="1.5rem" />
          </div>
          <div className="flex-auto">
            <ChangelogName changelog={c} />
          </div>
        </Link>
      )
    })
  }

  handleSignUp() {
    SessionActions.signin()
  }
}
