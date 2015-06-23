import ApplicationNavbar from '../components/application_navbar.jsx'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import classnames from 'classnames'
import Icon from '../ui/Icon.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import paramsFor from '../lib/paramsFor'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import {RouteHandler} from 'react-router'
import Link from '../components/Link.jsx'

export default class ChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ChangelogActions.select(RouterContainer.changelogSlug(params))
  }

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
  }

  componentWillUnmount() {
    ChangelogStore.removeChangeListener(this.onStoreChange)
    SessionStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    if (!this.state.changelog) {
      return <div />
    }

    const changelogId = RouterContainer.changelogSlug()

    return (
      <div>
        <ApplicationNavbar title={this.title()} />
        <RouteHandler changelogId={changelogId} />
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

  title() {
    return this.state.changelog.name

    // TODO hook up link, looks weird right meow
    return (
      <Link to="changelog" params={paramsFor.changelog(this.state.changelog)}>
        {this.state.changelog.name}
      </Link>
    )
  }

  _onStoreChange() {
    this.setState({
      changelog: ChangelogStore.changelog,
      user:      SessionStore.user
    })
  }
}
