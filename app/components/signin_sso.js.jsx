import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'

export default class SigninSSO extends React.Component {
  static willTransitionTo(transition, params, query) {
    SessionActions.signinFromSSO(query.payload, query.sig)
  }

  constructor() {
    super()
    this.state = {}
  }

  render() {
    if (this.state.user) {
      return <div className="container sm-col-8">
        Welcome {this.state.user.username}
      </div>
    }

    return <div className="container sm-col-8">
      Signing in...
    </div>
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this)
    SessionStore.addChangeListener(this.changeListener)
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.changeListener)
  }

  _onChange() {
    this.setState({
      user: SessionStore.user
    })
  }
}
