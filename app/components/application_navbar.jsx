import {Link} from 'react-router'
import Avatar from './ui/avatar.jsx'
import ChangelogStore from '../stores/changelog_store.js'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from './ui/icon.js.jsx'
import Jewel from './ui/jewel.jsx'
import List from './ui/list.jsx'
import Navbar from './ui/navbar.jsx'
import NotificationActions from '../actions/notification_actions'
import NotificationsList from './notifications_list.js.jsx'
import NotificationsStore from '../stores/notifications_store'
import Popover from './ui/popover.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

// Logo versions:
import LogoSrc from '../images/logo.svg'

@connectToStores(ChangelogStore, SessionStore, NotificationsStore)
export default class ApplicationNavbar extends React.Component {

  static getPropsFromStores() {
    return {
      user: SessionStore.user,
      changelog: ChangelogStore.changelog,
      unreadCount: NotificationsStore.unreadCount
    }
  }

  componentDidMount() {
    if (this.props.user) {
    //  setTimeout(() => {NotificationActions.fetchAll()})
    }
  }

  render() {
    return <Navbar title="Changelog"
                   left={this.left()}
                   right={this.right()} />
  }

  left() {
    return (
      <Link to="root" className="flex">
        <img className="flex-none mr2" src={LogoSrc} style={{height: '1.5rem'}} />
        <div className="black sm-show">Assembly</div>
      </Link>
    )
  }

  render_new_story(changelogId) {
    const { changelog } = this.props
    if (changelog && changelog.user_is_team_member) {
      return (
        <div>
          <List.Item>
            <Link to="new" params={{changelogId}}>
              <Icon icon="pencil" fw={true} /> New story
            </Link>
            <Link to="highlights" params={{changelogId}}>
              <Icon icon="magic" fw={true} /> Highlights
            </Link>
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
          <a className="pointer" onClick={SessionActions.signin}>Sign in</a>
        </div>
      )
    }

    const changelogId = RouterContainer.get().getCurrentParams().changelogId
    const unreadCount = this.props.unreadCount

    const userMenu = (
      <div className="py1">
        <List>
          {this.render_new_story(changelogId)}
        </List>
        <List type="small">
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

  _handleSignout() {
    SessionActions.signout()
  }
}
