import React from 'react'
<<<<<<< HEAD
import Avatar from './ui/avatar.jsx'
import Icon from './ui/icon.js.jsx'
import List from './ui/list.jsx'
import moment from '../config/moment'
import NotificationsStore from '../stores/notifications_store'
import NotificationActions from '../actions/notification_actions'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store'
import LoadingBar from '../ui/loading_bar.jsx'
import {Link} from 'react-router'
import classnames from 'classnames'

export default class NotificationsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      notifications: NotificationsStore.notifications,
      fetching: NotificationsStore.fetching
    }
    this.getStateFromStores = this._getStateFromStores.bind(this)
  }

  componentDidMount() {
    NotificationsStore.addChangeListener(this.getStateFromStores)
    if (NotificationsStore.notifications.count() == 0) {
      NotificationActions.fetchAll()
    }
  }

  componentWillUnmount() {
    NotificationsStore.removeChangeListener(this.getStateFromStores)
  }

  renderStories() {
    const stories = this.state.notifications
      .sort((b,a) => {
        if (a.read_at == null) return 1
        if (b.read_at == null) return 0
        return a.read_at < b.read_at
      })
      .map((n) => {
        return (
          <Notification notification={n} key={n.story_id}/>
        )
      })
      if (stories.count() > 0) {
        return stories
      } else {
        return (
          <div className="gray h5 center p2">No notifications</div>
        )
      }
  }

  render() {
    if (this.state.fetching) {
      return (
        <div style={{minWidth: 320}}>
          <div className="gray h5 center">Loading..</div>
          <LoadingBar loading={true} />
        </div>
      )
    } else {
      return (
        <div style={{minWidth: 320, maxHeight: 400, overflowY: 'scroll', zIndex: 999}}>
          {this.renderStories()}
        </div>
      )
    }
  }

  markAllAsRead() {
    // actions.markAllAsRead()
    this.optimisticallyMarkAllAsRead()
  }

  optimisticallyMarkAllAsRead() {
    let notifications = this.state.notifications

    for(let index in notifications) {
      notifications[index].read_at = moment().unix()
    }

    this.setState({
      notifications: notifications
    })
  }

  _getStateFromStores() {
    this.setState({
      notifications: NotificationsStore.notifications,
      fetching: NotificationsStore.fetching
    })
  }

}

class Notification extends React.Component {
  render() {
    const { notification } = this.props

    if (notification) {
      const title = notification.title.length > 35 ? `${notification.title.substr(0,33)}...` : notification.title

      const linkClasses = classnames({
        'block flex flex-center px2 py1' : true,
        'muted' : notification.read_at
      })

      return (
        <Link className={linkClasses} to="story" params={{changelogId: ChangelogStore.slug, storyId: notification.story_id}}>
          <div className="flex-none mr1">
            <Avatar user={notification.actor} size={24} />
          </div>
          <div className="flex-auto">
            <p className="h5 m0 gray">{notification.description}</p>
            <div className="h5 orange">{title}</div>
          </div>
        </Link>
      )
    } else {
      return
    }
  }
}

Notification.proptypes = {
  notification: React.PropTypes.object.isRequired
}
