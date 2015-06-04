import React from 'react'
import Button from '../ui/Button.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'

export default class HomePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (SessionStore.user) {
      transition.redirect("profile", {username: SessionStore.user.username})
    }
  }

  render() {
    return (
      <div className="container py4 px2">
        <div className="sm-col-8 col-12">
          <h1>Create better, together</h1>

          <p>Assembly makes it quick and easy to keep your team and even the world involved in what you&#39;re creating.</p>

          <p>Share what’s happening, invite your followers to help out, and celebrate along the way. You can also make your work public, inviting the community to participate and contribute.</p>

          <p>Oh yeah, it&#39;s also completely free so you can give it a go right meow.</p>

          <Button action={this.handleSignUp.bind(this)} className="button">Sign Up</Button>
          <a href="javascript:;" onClick={this.handleSignUp.bind(this)} className="ml2">Sign in with your Assembly account</a>
        </div>
      </div>
    )
  }

  handleSignUp() {
    SessionActions.signin()
  }
}
