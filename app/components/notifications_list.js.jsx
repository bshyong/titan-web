import React from 'react'
import Avatar from './ui/avatar.jsx'
import Icon from './ui/icon.js.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import ScrollPaginator from './ui/scroll_paginator.jsx'
import moment from '../config/moment'
import NotificationsStore from '../stores/notifications_store'
import NotificationActions from '../actions/notification_actions'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store'
import RouterContainer from '../lib/router_container'
import {Link} from 'react-router'
import classnames from 'classnames'

export default class NotificationsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      notifications: NotificationsStore.notifications,
      fetching: NotificationsStore.fetching,
      page: 1
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
          <Notification notification={n} key={n.story_id} />
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
        <a className="block gray h5 center px2 py1 border-top border-silver pointer" onClick={this.markAllAsRead}>
          Mark all as read
        </a>
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

  constructor(props) {
    super(props)
    this.handleOnClick = this._handleOnClick.bind(this)
  }

  render() {
    if (!this.props.notification) {
      return
    }

    const {
      notification: {
        actor,
        description,
        read_at,
        title,
        updated_at,
      }
    } = this.props

    const cns = {
      notification: classnames('block flex p2 pointer', {
        'bg-smoke': read_at
      }),

      actor: classnames('flex-none mr1', {
        muted: read_at
      }),

      description: classnames('flex', {
        'gray': !read_at,
        'silver': read_at
      }),

      title: classnames({
        'silver': read_at
      })
    }

    return (
      <a className={cns.notification} onClick={this.handleOnClick}>
        <div className={cns.actor}>
          <Avatar user={actor} size={24} />
        </div>
        <div className="flex-auto h5">
          <div className={cns.description}>
            <div className="flex-auto">{description}</div>
            <div className="">
              {moment(updated_at).fromNow(true)}
            </div>
          </div>
          <div className={cns.title}>{title}</div>
        </div>
      </a>
    )
  }

  _handleOnClick(e) {
    const { notification } = this.props
    NotificationActions.markAsRead([notification])
    RouterContainer.get().transitionTo('story', {
      changelogId: ChangelogStore.slug,
      storyId: notification.story_id
    })
  }

}

Notification.proptypes = {
  notification: React.PropTypes.object.isRequired
}
