import React from 'react'
import SessionStore from 'stores/session_store'

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

    static willTransitionTo(transition) {
      if (!SessionStore.isSignedIn()) {
        console.error('must login...')
        // transition.redirect('/login', {}, {'nextPath' : transition.path})
      }
    }

    constructor() {
      this.state = this.getStateFromStores()
    }

    componentDidMount() {
      this.changeListener = this._onChange.bind(this)
      SessionStore.addChangeListener(this.changeListener)
    }

    componentWillUnmount() {
      SessionStore.removeChangeListener(this.changeListener)
    }

    render() {
      return (
      <ComposedComponent
        {...this.props}
        user={this.state.user}
        signedIn={this.state.signedIn} />
      )
    }

    getStateFromStores() {
      return {
        signedIn: SessionStore.isSignedIn(),
        user: SessionStore.user
      }
    }

    _onChange() {
      this.setState(this.getStateFromStores())
    }
  }
}
