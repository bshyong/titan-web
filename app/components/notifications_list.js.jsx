import React from 'react'
import Avatar from './ui/avatar.jsx'
import Icon from './ui/icon.js.jsx'
import Popover from './ui/popover.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import ScrollPaginator from './ui/scroll_paginator.jsx'
import moment from '../config/moment'
import NotificationsStore from '../stores/notifications_store'
import NotificationActions from '../actions/notification_actions'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store'
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
    this.markAllAsRead = this._markAllAsRead.bind(this)
    this.setScrollPaginatorRefs = this._setScrollPaginatorRefs.bind(this)
  }

  componentDidMount() {
    NotificationsStore.addChangeListener(this.getStateFromStores)
    setTimeout(() => {NotificationActions.fetchAll()})
    this.setScrollPaginatorRefs()
  }

  componentWillUnmount() {
    NotificationsStore.removeChangeListener(this.getStateFromStores)
  }

  _setScrollPaginatorRefs() {
    this.scrollPaginatorRefs = {
      element: React.findDOMNode(this.refs.notifications),
      container: React.findDOMNode(this.refs.notificationsContainer)
    }
  }

  renderStories() {
    const stories = this.state.notifications
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

  renderBottomBar() {
    if (this.state.fetching) {
      return (
        <div className="border-top py1">
          <div className="gray h5 center">Loading..</div>
          <LoadingBar loading={true} />
        </div>
      )
    } else {
      return (
        <div onClick={this.markAllAsRead} className="gray h5 center px2 py1 mt1 border-top">
          <a className="gray pointer">Mark all as read</a>
        </div>
      )
    }
  }

  render() {
    let paginator = null
    if (this.scrollPaginatorRefs) {
      paginator = <ScrollPaginator
                    element={this.scrollPaginatorRefs.element}
                    container={this.scrollPaginatorRefs.container}
                    page={this.state.page}
                    onScrollBottom={() => NotificationActions.fetchAll(this.state.page + 1)}
                  />
    }

    return (
      <div ref="notificationsContainer">
        {this.state.moreAvailable ? paginator : null}
        <div ref="notifications" style={{minWidth: 320, maxHeight: 400, overflowY: 'scroll', zIndex: 999}}>
          {this.renderStories()}
        </div>
        {this.renderBottomBar()}
      </div>
    )
  }

  _markAllAsRead() {
    NotificationActions.markAsRead(this.state.notifications)
    this.optimisticallyMarkAllAsRead()
  }

  optimisticallyMarkAllAsRead() {
    let notifications = this.state.notifications

    for(let index of notifications.keySeq()) {
      notifications.get(index).read_at = moment().unix()
    }

    this.setState({
      notifications: notifications
    })
  }

  _getStateFromStores() {
    const notifications = NotificationsStore.notifications

    this.setState({
      notifications: notifications,
      fetching: NotificationsStore.fetching,
      page: NotificationsStore.page,
      moreAvailable: NotificationsStore.moreAvailable,
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
