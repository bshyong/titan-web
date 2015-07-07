import React from 'react'
import RouterContainer from '../../lib/router_container'
import RoutesStore from '../../stores/routes_store'
import SessionStore from '../../stores/session_store'
import SessionActions from '../../actions/SessionActions'

export default function Authenticated() {
  return (Component) => {
    return class Authenticated extends React.Component {
      static willTransitionTo(transition, params, query) {
        if (!SessionStore.isSignedIn()) {
          transition.abort()
          RouterContainer.router.transitionTo("login", {}, {
            return_path: window.location.pathname
          })
        } else {
          Component.willTransitionTo && Component.willTransitionTo(transition, params, query)
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
          user: SessionStore.user
        }
      }

      _onChange() {
        var newState = this.getStateFromStores()
        if (!newState.user) {
          // Since this action effectively gets triggered
          // by another action, we need to transition on the
          // next tick to avoid dispatching in the middle of a
          // dispatch
          setTimeout(() => {
            RouterContainer.get().transitionTo('/')
          }, 0)
        } else {
          this.setState(this.getStateFromStores())
        }
      }

      static get Component() {
        return Component
      }
    }
  }
}
