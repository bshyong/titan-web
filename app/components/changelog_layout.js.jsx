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
import Button from 'components/ui/button.js.jsx'
import FollowButton from 'components/follow_button.jsx'


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
        <Navbar>

        </Navbar>

        <div className="bg-blue">
          <div className="container">

            <div className="sm-flex py3 px2 md-px0">
              <Link className="block flex-auto mb2 md-mb0 center sm-left-align white" to="changelog" params={{changelogId}}>
                <h2 className="mt0 mb0">Assembly</h2>
                <div>This is where we're tracking change to the assembly product</div>
              </Link>

              <div className="flex-none sm-ml2">
                <FollowButton changelog={this.state.changelog}/>
              </div>
            </div>

          </div>
        </div>

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
