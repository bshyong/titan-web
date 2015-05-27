import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import NotificationActions from '../actions/notification_actions'
import NotificationsStore from '../stores/notifications_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollEater from './ui/ScrollEater.jsx'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'
import addParams from '../lib/addUrlParamsToStory'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import moment from '../config/moment'
import pluralize from '../lib/pluralize'
import {Link} from 'react-router'
import {List} from 'immutable'

@connectToStores(NotificationsStore)
export default class NotificationsList extends React.Component {
  static getPropsFromStores(props) {
    return {
      notifications: NotificationsStore.notifications,
      fetching: NotificationsStore.fetching,
      page: NotificationsStore.page,
      moreAvailable: NotificationsStore.moreAvailable,
    }
  }

  constructor(props) {
    super(props)
    this.markAllAsRead = this._markAllAsRead.bind(this)
    this.setScrollPaginatorRefs = this._setScrollPaginatorRefs.bind(this)
  }

  componentDidMount() {
    NotificationActions.acknowledge()
    this.setScrollPaginatorRefs()
  }

  _setScrollPaginatorRefs() {
    this.scrollPaginatorRefs = {
      element: React.findDOMNode(this.refs.notifications),
      container: React.findDOMNode(this.refs.notificationsContainer)
    }
  }

  renderStories() {
    const stories = this.props.notifications
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
    const content = this.props.fetching ? (
      <div className="gray h5 center border-top border-silver py1 px2">Loading..</div>
    ) : (
      <a className="block gray h5 center px2 py1 border-top border-silver pointer" onClick={this.markAllAsRead}>
        Mark all as read
      </a>
    )

    return (
      <div>
        {content}
        <LoadingBar loading={this.props.fetching} />
      </div>
    )
  }

  render() {
    let paginator = null
    if (this.scrollPaginatorRefs) {
      paginator = <ScrollPaginator
                    element={this.scrollPaginatorRefs.element}
                    container={this.scrollPaginatorRefs.container}
                    page={this.props.page}
                    onScrollBottom={() => NotificationActions.fetchAll(this.props.page + 1)} />
    }

    return (
      <ScrollEater element={this.scrollPaginatorRefs ? this.scrollPaginatorRefs.element : null}>
        <div ref="notificationsContainer">
          {this.props.moreAvailable ? paginator : null}
          <div ref="notifications" style={{minWidth: 360, maxHeight: 400, overflowY: 'scroll', zIndex: 999}}>
            {this.renderStories()}
          </div>
          {this.renderBottomBar()}
        </div>
      </ScrollEater>
    )
  }

  _markAllAsRead() {
    NotificationActions.markAsRead(this.props.notifications)
  }
}


class Notification extends React.Component {
  render() {
    if (!this.props.notification) {
      return
    }

    const {
      notification: {
        actor,
        new_commenters,
        read_at,
        title,
        updated_at,
      }
    } = this.props

    var isRead = moment(read_at).unix() > moment(updated_at).unix()
    let face = new_commenters[0] || actor

    const cns = {
      notification: classnames('block flex p2 pointer', {
        'bg-smoke': isRead
      }),

      actor: classnames('flex-none mr1', {
        muted: isRead
      }),

      title: classnames({
        'orange': !isRead,
        'gray': isRead
      })
    }

    return (
      <a className={cns.notification} onClick={this.handleOnClick.bind(this)}>
        <div className={cns.actor}>
          <Avatar user={face} size={24} />
        </div>
        <div className="flex-auto h5 gray">
          <div className="flex-auto">
            {this.renderDescription()}
            <span className={cns.title}>{' ' + title}</span>
          </div>
        </div>
        <div className="flex-none h5 gray ml1">
          {moment(updated_at).fromNow(true)}
        </div>
      </a>
    )
  }

  renderDescription() {
    const {
      notification: {
        description,
        new_commenters,
        title,
      }
    } = this.props

    if (new_commenters.length == 0) {
      return description
    }

    let usernames = List(new_commenters).map(u => `@${u.username}`).take(2)

    if (new_commenters.length <= 2) {
      return `${usernames.join(' and ')} commented on`
    }

    return `${usernames.join(', ')} and ${pluralize(new_commenters.length - 2, 'other', 'others')} commented on`
  }

  handleOnClick(e) {
    const { notification } = this.props

    const { urlParams } = addParams(ChangelogStore.slug, {
      slug: notification.story_slug,
      created_at : notification.created_at
    })

    NotificationActions.markAsRead([notification])
    RouterContainer.get().transitionTo('story', urlParams)
  }

}

Notification.proptypes = {
  notification: React.PropTypes.object.isRequired
}
