import authenticated from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import {Link, RouteHandler} from 'react-router'
import {List} from 'immutable'

@connectToStores(ProfileStore)
export default class SettingsPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ProfileActions.fetchChangelogs(SessionStore.user.username)
  }

  static getPropsFromStores(props) {
    return {
      user: SessionStore.user,
      changelogs: (ProfileStore.changelogs || [])
    }
  }

  render() {
    return (
      <DocumentTitle title="Settings">
        <div className="container">
          <div className="clearfix mxn3">

            <div className="sm-col sm-col-3">
              <h4>{this.props.user.username}</h4>
              <div className="bg-white border rounded">
                <Link to="profile_settings" className="button block button-transparent"
                  activeClassName="bg-blue white">Profile</Link>
              </div>

              <h4 className="mt3">Changelogs</h4>

              <div className="bg-white border rounded">
                {this.renderChangelogLinks()}
              </div>
            </div>

            <div className="sm-col sm-col-9 px3">
              <RouteHandler />
            </div>

          </div>
        </div>
      </DocumentTitle>
    )
  }

  renderChangelogLinks() {
    return List(this.props.changelogs).sortBy(c => c.name).map((c, i) => {
      let cn = classnames("button block button-transparent", {
        "border-bottom": i < (this.props.changelogs.size - 1)
      })
      return <Link to="changelog_settings" activeClassName="bg-blue white" params={{changelogId: c.slug}}
        className={cn}>{c.name}</Link>
    })
  }

  handleSignUp() {
    SessionActions.signin()
  }
}
