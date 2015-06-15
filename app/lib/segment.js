import SessionStore from '../stores/session_store'

const eventDefinitions = {
  ANALYTICS_CHANGELOG_CREATED: 'changelog-created',
  ANALYTICS_COMMENT_CREATED: 'comment-created',
  ANALYTICS_FOLLOWED: 'followed',
  ANALYTICS_POST_CREATED: 'post-created',
  ANALYTICS_UPVOTE: 'upvoted',
  ANALYTICS_USER_CREATED: 'user-created',
  ANALYTICS_ENGAGED: 'engaged',
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
    analytics.page(name, {
      signedIn: !!this.identifyUser()
    })
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
