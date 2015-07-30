import {connect} from 'redux/react'
import {RouteHandler} from 'react-router'
import * as changelogActions from 'actions/changelogActions'
import Avatar from 'ui/Avatar.jsx'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import fetchData from 'decorators/fetchData'
import Link from 'components/Link.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/SessionActions'
import SessionStore from 'stores/session_store'

@fetchData(params =>
  changelogActions.select(RouterContainer.changelogSlug(params))
)
@connect(state => ({
  changelog: state.currentChangelog.changelog,
}))
export default class ChangelogPage extends React.Component {
  state = {
    user: SessionStore.user,
  }

  constructor() {
    super()
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    SessionStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    if (!this.props.changelog) {
      return <div />
    }

    const changelogId = RouterContainer.changelogSlug()
    return (
      <div>
        <RouteHandler changelogId={changelogId} />
      </div>
    )
  }

  renderProfileNav() {
    if (!this.state.user) {
      return <div />
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
    const changelogId = RouterContainer.changelogSlug()

    return (
      <Link to="changelog" params={{changelogId}} className="black">
        <ChangelogName changelog={this.props.changelog} />
      </Link>
    )
  }

  _onStoreChange() {
    this.setState({
      user: SessionStore.user,
    })
  }
}
