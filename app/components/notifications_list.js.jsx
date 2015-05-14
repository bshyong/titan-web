import React from 'react'
import Avatar from './ui/avatar.jsx'
import Icon from './ui/icon.js.jsx'
import List from './ui/list.jsx'
import moment from '../config/moment'
import NotificationsStore from '../stores/notifications_store'
import NotificationActions from '../actions/notification_actions'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store'

export default class NotificationsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      stories: []
    }
    this.getStateFromStores = this._getStateFromStores.bind(this)
    this.fetchStoriesForNotifications = this._fetchStoriesForNotifications.bind(this)
  }

  componentDidMount() {
    NotificationsStore.addChangeListener(this.fetchStoriesForNotifications)
    StoryStore.addChangeListener(this.getStateFromStores)
    NotificationActions.fetchAll()
    // StoryActions.fetchAll(ChangelogStore.slug)
  }

  componentWillUnmount() {
    NotificationsStore.removeChangeListener(this.fetchStoriesForNotifications)
    StoryStore.removeChangeListener(this.getStateFromStores)
  }

  render() {
    const stories = this.state.notifications
      .sort((a,b) => a.read_at < b.read_at)
      .map((n) => {
        const story = StoryStore.get(n.story_id)
        if (story) {
          return (
            <List.Item key={n.story_id}>
              <div className="flex flex-center px2 py1">
                <div className="flex-none mr2">
                  <Avatar user={story.user} size={24} />
                </div>
                <div className="flex-auto">
                  <p className="h5 m0 gray">{story.user.username} wrote a new story</p>
                  <a href="#">{story.title}</a>
                </div>
              </div>
            </List.Item>
          )
        }
      })

    return (
      <List type="small">
        {stories}
      </List>
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

  _fetchStoriesForNotifications() {
    const notifications = NotificationsStore.all()

    notifications.map((n) => {
      if(!StoryStore.get(n.story_id)){
        StoryActions.fetch(ChangelogStore.slug, n.story_id)
      }
    })
    this.getStateFromStores()
  }

  _getStateFromStores() {
    this.setState({
      notifications: NotificationsStore.all(),
      stories: StoryStore.all().toJS()
    })
  }

}
