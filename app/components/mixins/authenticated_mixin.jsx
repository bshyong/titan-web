import NotFound from 'components/not_found.js.jsx'
import React from 'react'
import RoutesStore from 'stores/routes_store'
import SessionStore from 'stores/session_store'

export default (AuthenticatedComponent) => {
  return class AuthenticatedMixin extends React.Component {

    static willTransitionTo(transition) {
      if (!SessionStore.isSignedIn()) {
        console.error('must login...', AuthenticatedComponent.name)
      }
    }

    constructor() {
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
      if (!this.state.resourceFound) {
        return <NotFound />
      }

      return (
      <AuthenticatedComponent
        {...this.props}
        user={this.state.user}
        signedIn={this.state.signedIn} />
      )
    }

    getStateFromStores() {
      return {
        resourceFound: RoutesStore.resourceFound,
        signedIn: SessionStore.isSignedIn(),
        user: SessionStore.user
      }
    }

    _onChange() {
      this.setState(this.getStateFromStores())
    }
  }
}
