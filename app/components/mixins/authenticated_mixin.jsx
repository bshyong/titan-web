import React from 'react'
import RouterContainer from 'lib/router_container'
import RoutesStore from 'stores/routes_store'
import SessionStore from 'stores/session_store'

export default function Authenticated() {
  return (Component) => {
    return class Authenticated extends React.Component {
      static fetchData = Component.fetchData
      static willTransitionTo(transition, params, query) {
        if (!SessionStore.isSignedIn()) {
          transition.abort()
          RouterContainer.transitionTo('signup', {}, { redirectTo: window.location.pathname })
        } else {
          if (Component.willTransitionTo) {
            Component.willTransitionTo(transition, params, query)
          }
        }
      }

      constructor() {
        super()
        this.state = this.getStateFromStores()
      }

      componentDidMount() {
        this.changeListener = this._onChange.bind(this)
        RoutesStore.addChangeListener(this.changeListener)
        SessionStore.addChangeListener(this.changeListener)
      }

      componentWillUnmount() {
        RoutesStore.removeChangeListener(this.changeListener)
        SessionStore.removeChangeListener(this.changeListener)
      }

      render() {
        return <Component {...this.props} {...this.state} />
      }

      getStateFromStores() {
        return {
          resourceFound: RoutesStore.resourceFound,
          signedIn: SessionStore.isSignedIn(),
          user: SessionStore.user,
        }
      }

      _onChange() {
        var newState = this.getStateFromStores()
        if (!newState.user) {
          return
        }

        this.setState(this.getStateFromStores())
      }

      static get Component() {
        return Component
      }
    }
  }
}
