import React from 'react'
import SessionActions from '../actions/SessionActions'

export default class TwitterCallback extends React.Component {
  static willTransitionTo(transition, params, query) {
    SessionActions.twitterCallback(query)
  }

  render() {
    return (
      <div>
        Redirecting...
      </div>
    )
  }
}
