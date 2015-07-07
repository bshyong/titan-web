import Avatar from 'ui/Avatar.jsx'
import ChangelogStore from 'stores/changelog_store.js'
import connectToStores from 'lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import Jewel from 'ui/Jewel.jsx'
import Link from 'components/Link.jsx'
import List from 'ui/List.jsx'
import Navbar from 'ui/Navbar.jsx'
import NotificationActions from 'actions/notification_actions'
import NotificationsList from 'components/notifications_list.js.jsx'
import NotificationsStore from 'stores/notifications_store'
import paramsFor from 'lib/paramsFor'
import Popover from 'ui/Popover.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/SessionActions'
import SessionStore from 'stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'
import LoginForm from 'components/Authentication/LoginForm.jsx'

// Logo versions:
import LogoSrc from 'images/logo.svg'

@connectToStores(ChangelogStore, SessionStore, NotificationsStore)
export default class ApplicationNavbar extends React.Component {

  static getPropsFromStores() {
    return {
      user: SessionStore.user,
      changelog: ChangelogStore.changelog,
      unreadCount: NotificationsStore.unreadCount
    }
  }

  static propTypes = {
    title: React.PropTypes.node.isRequired
  }

  static defaultProps = {
    title: 'Changelog'
  }

  render() {
    return <Navbar title={this.props.title}
                   left={this.left()}
                   right={this.right()} />
  }

  left() {
    let route = this.props.user ? "dashboard" : "root"
    return (
      <Link to={route} className="flex">
        <img className="flex-none mr2" src={LogoSrc} style={{height: '1.5rem'}} />
      </Link>
    )
  }

  renderHighlightsLink() {
    const { changelog } = this.props

    if (changelog.slug === 'assembly') {
      return (
        <Link to="highlights" params={paramsFor.changelog(changelog)}>
          <Icon icon="magic" fw={true} /> Highlights
        </Link>
      )
    }
  }

  renderNewStory() {
    const { changelog } = this.props
    if (changelog && changelog.user_is_team_member) {
      return (
        <div>
          <List.Item>
            <Link to="new" params={paramsFor.changelog(changelog)}>
              <Icon icon="pencil" fw={true} /> Write
            </Link>
            {this.renderHighlightsLink()}
          </List.Item>
          <hr className="mt1 border-top mb1" />
        </div>
      )
    }
  }

  right() {
    const { user } = this.props

    if (!user) {
      return (
        <div className="p2">
          <a className="pointer" onClick={this._handleSignIn}>Log in</a>
        </div>
      )
    }

    const changelogId = RouterContainer.changelogSlug()
    const unreadCount = this.props.unreadCount

    const userMenu = (
      <div className="py1">
        <List>
          {this.renderNewStory(changelogId)}
        </List>
        <List type="small">
          <List.Item>
            <Link to="profile" params={{userId: user.username}}>Profile</Link>
          </List.Item>
          <List.Item>
            <Link to="settings">Settings</Link>
          </List.Item>
          <List.Item>
            <a href="https://assembly.com/about">About</a>
          </List.Item>
          <List.Item>
            <a href="#" onClick={this._handleSignout}>Sign out</a>
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

  _handleSignIn(e) {
    SigninScrimActions.show(LoginForm, window.location.pathname)
  }

  _handleSignout() {
    SessionActions.signout()
  }
}
