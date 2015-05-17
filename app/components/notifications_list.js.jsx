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

export default class NotificationsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      notifications: []
    }
    this.getStateFromStores = this._getStateFromStores.bind(this)
  }

  componentDidMount() {
    NotificationsStore.addChangeListener(this.getStateFromStores)
    NotificationActions.fetchAll()
  }

  componentWillUnmount() {
    NotificationsStore.removeChangeListener(this.getStateFromStores)
  }

  render() {
    const stories = this.state.notifications
      .sort((a,b) => a.read_at < b.read_at)
      .map((n) => {
        return (
          <Notification notification={n} key={n.story_id}/>
        )
      })

    return (
      <div style={{minWidth: 320}}>
        <ol className="list list-reset mb0 list--small">
          {stories}
        </ol>
      </div>
    )
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
      notifications: NotificationsStore.notifications
    })
  }

}

class Notification extends React.Component {
  render() {
    const { notification } = this.props
    if (notification) {
      return (
        <li className="list-item">
          <div>
            <Link className="flex flex-center px2 py1" to="story" params={{changelogId: ChangelogStore.slug, storyId: notification.story_id}}>
            <div className="flex-none mr1">
              <Avatar user={notification.actor} size={24} />
            </div>
            <div className="flex-auto">
              <p className="h5 m0 gray">{notification.description}</p>
              <div className="h5">{notification.title}</div>
            </div>
          </Link>
          </div>
        </li>
      )
    } else {
      return (
        <li className="list-item">
          <LoadingBar loading={true} />
        </li>
      )
    }
  }
}

Notification.proptypes = {
  notification: React.PropTypes.object.isRequired
}
