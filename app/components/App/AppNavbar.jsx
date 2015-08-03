import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import Avatar from 'ui/Avatar.jsx'
import { connect } from 'redux/react'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import Jewel from 'ui/Jewel.jsx'
import Link from 'components/Link.jsx'
import List from 'ui/List.jsx'
import Logo from 'components/logo.jsx'
import Navbar from 'ui/Navbar.jsx'
import NotificationsList from 'components/notifications_list.js.jsx'
import NotificationsStore from 'stores/notifications_store'
import paramsFor from 'lib/paramsFor'
import Popover from 'ui/Popover.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/SessionActions'
import SessionStore from 'stores/session_store'

import Button from 'ui/Button.jsx'

// Logo versions:
import LogoSrc from 'images/logo.svg'
import LogoTransparentSrc from 'images/logo-transparent.svg'

@connect(state => ({
  membered: state.changelogs.membered,
  changelog: state.currentChangelog.changelog,
}))
@connectToStores(SessionStore, NotificationsStore)
export default class AppNavbar extends React.Component {
  static getPropsFromStores() {
    return {
      user: SessionStore.user,
      unreadCount: NotificationsStore.unreadCount,
    }
  }

  static propTypes = {
    bgImgUrl: React.PropTypes.string,
  }

  render() {
    return (
      <Navbar {...this.props} left={this.left()} right={this.right()}>
        <div className="p2">
          {this.props.children}
        </div>
      </Navbar>
    )
  }

  logoUrl() {
    if (this.props.bgImgUrl || this.props.onProduct == "yes") {
      return LogoTransparentSrc
    } else {
      return LogoSrc
    }
  }

  left() {
    const route = this.props.user ? 'dashboard' : 'https://assembly.com'
    return (
      <div className="flex flex-center px2">
      <Link to={route} className="flex p2">
        <img className="flex-none mr2" src={this.logoUrl()} style={{height: '1.5rem'}} />
      </Link>
    </div>
    )
  }

  right() {
    const { user, membered } = this.props

    if (!user) {
      if (this.props.bgImgUrl || this.props.onProduct == "yes")
      {
        return (
          <div className="p2">
            <a className="white pointer" onClick={this._handleSignIn.bind(this)}>Log in</a>
          </div>
        )
      }
      else {
        return (
          <div className="flex flex-center px1">
            <div className="mr1">
              <Button bg="twitter-blue" action={this._handleSignUp.bind(this)}>Sign up</Button>
            </div>
            <div>
              <Button bg="gray" action={this._handleSignIn.bind(this)}>Log in</Button>
            </div>
          </div>
        )
      }
    }

    const changelogId = RouterContainer.changelogSlug()
    const unreadCount = this.props.unreadCount

    const userMenu = (
      <div className="py2">
        {membered && this.renderChangelogs(membered)}

        <List type="small">
          <List.Item>
            <Link to="profile" params={{userId: user.username}}>Profile</Link>
          </List. Item>
          <List.Item>
            <Link to="settings">Settings</Link>
          </List.Item>
          <List.Item>
            <a href="mailto:support@assembly.com">Support</a>
          </List.Item>
          <List.Item>
            <a href="#" onClick={this._handleSignout}>Log out</a>
          </List.Item>
        </List>
      </div>
    )

    const paddingStyle = {
      paddingTop: '.75rem',
      paddingBottom: '.75rem'
    }

    return (
      <div className="flex px1">
        <Popover content={<NotificationsList />}>
          <div className="px1" style={paddingStyle}>
            <Jewel icon={<Icon icon="bell" />} count={unreadCount} />
          </div>
        </Popover>
        <Popover content={userMenu}>
          <div className="px1" style={paddingStyle}>
            <Avatar user={user} size={32} />
          </div>
        </Popover>
      </div>
    )
  }

  renderChangelogs(changelogs) {
    return (
      <div>
        <div className="px2 gray h6">Changelogs</div>
        <hr className="ml2 mt0 mb1" />
        <List>
          {changelogs.map(this.renderChangelogEntry)}
        </List>
        <hr className="mt1 border-top mb1" />
      </div>
    )
  }

  renderChangelogEntry(changelog) {
    return (
      <List.Item key={`entry-${changelog.id}`}>
        <Link to="changelog" params={paramsFor.changelog(changelog)}>
          <div className="flex flex-center">
            <Logo changelog={changelog} size="2rem" />
            <div className="flex-auto px1">
              {changelog.name}
            </div>
          </div>
        </Link>
      </List.Item>
    )
  }

  _handleSignIn(e) {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'login',
      formContent: { redirectTo: window.location.pathname }
    }))
  }

  _handleSignUp() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'signup',
      formContent: { redirectTo: '/new' },
    }))
  }

  _handleSignout() {
    SessionActions.signout()
  }
}
