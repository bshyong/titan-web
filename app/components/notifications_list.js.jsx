import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import DOMActions from '../actions/DOMActions'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import NotificationActions from '../actions/notification_actions'
import NotificationsStore from '../stores/notifications_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollEater from '../ui/ScrollEater.jsx'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import moment from '../config/moment'
import paramsFor from '../lib/paramsFor'
import pluralize from '../lib/pluralize'
import {Link} from 'react-router'
import {List} from 'immutable'

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}

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
    moment.locale('en-short')
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

  renderNotifications() {
    if (this.props.notifications.count() == 0) {
      return <div className="gray h5 center p2">No notifications</div>
    }

    return this.props.notifications.map(n => <Notification notification={n} key={n.id} />)
  }

  renderBottomBar() {
    const content = this.props.fetching ? (
      <div className="gray h5 center border-top border-silver py1 px2">Loading...</div>
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
            {this.renderNotifications()}
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

  renderNewFollower() {
    const { notification: { changelog } } = this.props

    return (
      <div className="flex-auto">
        {this.renderDescription()} {changelog.name}
      </div>
    )
  }

  renderStoryNotification() {
    const {
      notification: {
        story,
        title,
        read_at,
        updated_at,
      }
    } = this.props

    var isRead = moment(read_at || 0).unix() > moment(updated_at).unix()

    const cns = {
      title: classnames({
        'orange': !isRead,
        'gray': isRead
      })
    }

    return (
      <div className="flex-auto">
        {this.renderDescription()}
        <span className={cns.title}>{' ' + title}</span>
        <span>{` in ${story.changelog_name}`}</span>
      </div>
    )
  }

  render() {
    if (!this.props.notification) {
      return
    }

    const {
      notification: {
        actors,
        initial_comment_id,
        read_at,
        story,
        title,
        updated_at,
        changelog,
      }
    } = this.props

    const linkParams = {
      to: 'home',
      urlParams: {}
    }

    if (changelog) {
      linkParams.to = 'changelog'
      linkParams.urlParams = { changelogId: changelog.slug }
    } else if (story) {
      linkParams.to = initial_comment_id ? 'storyWithComment' : 'story'
      linkParams.urlParams = addParams(story.changelog_slug, story).urlParams
      linkParams.urlParams.commentId = initial_comment_id
    }

    var isRead = moment(read_at || 0).unix() > moment(updated_at).unix()
    let face = actors[0].user

    const cns = {
      notification: classnames('block flex p2 pointer', {
        'bg-smoke': isRead
      }),

      actor: classnames('flex-none mr1', {
        muted: isRead
      }),
    }

    return (
      <Link className={cns.notification}
        to={linkParams.to}
        params={linkParams.urlParams}
        onClick={this.handleOnClick.bind(this)}>
        <div className={cns.actor}>
          <Avatar user={face} size={32} />
        </div>
        <div className="flex-auto h5 gray">
          {story ? this.renderStoryNotification() : this.renderNewFollower()}
        </div>
        <div className="flex-none h5 gray ml1">
          {moment(updated_at).fromNow(true)}
        </div>
      </Link>
    )
  }

  renderDescription() {
    const {
      notification: {
        actors,
        title,
      }
    } = this.props

    let usernames = List(actors).map(a => `@${a.user.username}`).take(2)
    const notificationVerb = this.renderNotificationVerb()

    if (actors.length <= 2) {
      return `${usernames.join(' and ')} ${notificationVerb}`
    }

    return `${usernames.join(', ')} and ${pluralize(actors.length - 2, 'other', 'others')} ${notificationVerb}`
  }

  renderNotificationVerb() {
    const {
      notification: {
        category,
      }
    } = this.props

    switch (category) {
      case 'comment':
        return 'commented on'
      case 'comment_mention':
        return 'mentioned you in'
      case 'new_story':
        return 'wrote a new story'
      case 'new_follower':
        return 'started following'
      default:
        break;
    }
  }

  handleOnClick() {
    NotificationActions.markAsRead([this.props.notification])
    DOMActions.click() // dismisses the popup on click
  }

}

Notification.proptypes = {
  notification: React.PropTypes.object.isRequired
}
