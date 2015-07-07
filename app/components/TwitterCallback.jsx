import React from 'react'
import SessionActions from 'actions/SessionActions'

export default class TwitterCallback extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (window.opener) {
      window.opener.location = window.location
      window.close()
    } else {
      SessionActions.twitterCallback(query)
    }
  }

  render() {
    return (
      <div className="p2">
        Redirecting...
      </div>
    )
  }
}
