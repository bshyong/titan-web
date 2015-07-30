import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import AppNavbar from 'components/App/AppNavbar.jsx'
import authenticated from 'components/mixins/authenticated_mixin.jsx'
import * as changelogActions from 'actions/changelogActions'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import Link from 'components/Link.jsx'
import Logo from 'components/logo.jsx'
import ProfileActions from 'actions/profile_actions.js'
import ProfileStore from 'stores/profile_store.js'
import React from 'react'
import SessionStore from 'stores/session_store'
import {connect} from 'redux/react'

@authenticated()
@connect(() => ({}))
@connectToStores(ProfileStore)
export default class SettingsPage extends React.Component {
  static getPropsFromStores() {
    return {
      user: SessionStore.user,
      changelogs: (ProfileStore.changelogs || []),
    }
  }

  componentWillMount() {
    ProfileActions.fetchChangelogs()
    this.props.dispatch(changelogActions.clearCurrent())
  }

  render() {
    return (
      <DocumentTitle title='Settings'>
        <div>
          <AppNavbar title="Settings" />
          <div className="container">
            <div className="sm-flex" style={{minHeight: 'calc(100vh - 3.5rem)'}}>

              <div className="border-right py4 flex-none ml1">
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

              <div className="p4 flex-auto">
                <RouteHandler />
              </div>

            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  renderChangelogLinks() {
    return List(this.props.changelogs).sortBy(c => c.name).map(c => {
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
}
