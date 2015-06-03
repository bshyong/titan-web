import SessionStore from '../stores/session_store'

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
    properties.signedIn = !!this.identifyUser()
    analytics.track(eventName, properties)
  },
}
