import React from 'react'
import TwitterActions from 'actions/oauth/TwitterActions'

export default class TwitterCallback extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (window.opener) {
      window.opener.location = window.location
      window.close()
    } else {
      TwitterActions.callback(query)
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
