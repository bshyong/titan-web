import SessionStore from '../stores/session_store'

const eventDefinitions = {
  ANALYTICS_CHANGELOG_CREATED: 'Changelog Created',
  ANALYTICS_COMMENT_CREATED: 'Comment Created',
  ANALYTICS_FOLLOWED: 'Followed',
  ANALYTICS_POST_CREATED: 'Post Created',
  ANALYTICS_UPVOTE: 'Upvoted',
  ANALYTICS_USER_CREATED: 'User Created',
  ANALYTICS_ENGAGED: 'Engaged',
}

export default {
  identifyUser() {
    const user = SessionStore.user
    if (user) {
      analytics.identify(user.id, {
        username: user.username,
        email: user.email
      })
    }
    return user
  },

  page(name){
    analytics.page(name)
  },

  track(eventName, properties={}) {
    const definedEventName = eventDefinitions[eventName]
    if (!definedEventName && __DEV__) {
      console.warn(`You are tracking <${eventName}>, which is not a defined event`)
    }

    properties.signedIn = !!this.identifyUser()
    analytics.track(definedEventName || eventName, properties)
  },
}
