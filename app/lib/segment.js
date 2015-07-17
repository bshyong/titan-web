import SessionStore from '../stores/session_store'

const eventDefinitions = {
  ANALYTICS_CHANGELOG_CREATED: 'changelog.created',
  ANALYTICS_COMMENT_CREATED: 'comment.created',
  ANALYTICS_FOLLOWED: 'followed',
  ANALYTICS_POST_CREATED: 'post.created',
  ANALYTICS_UPVOTE: 'upvoted',
  ANALYTICS_USER_CREATED: 'user.created',
  ANALYTICS_ENGAGED: 'engaged',
}

function identifyUser() {
  const user = SessionStore.user
  if (user) {
    analytics.identify(user.id, {
      username: user.username,
      email: user.email,
      staff: user.staff_at
    })
  }
  return user
}

export default {
  page(name) {
    analytics.page(name, {
      signedIn: !!identifyUser()
    })
  },

  track(eventName, properties={}) {
    const definedEventName = eventDefinitions[eventName]
    if (!definedEventName && __DEV__) {
      console.warn(`You are tracking <${eventName}>, which is not a defined event`)
    }

    properties.signedIn = !!identifyUser()
    analytics.track(definedEventName || eventName, properties)
  },
}
