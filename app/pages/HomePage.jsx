import React from 'react'
import Button from '../ui/Button.jsx'
import SessionActions from '../actions/session_actions'
import SessionStore from '../stores/session_store'
import Divider from '../components/Divider.jsx'

import HomePagePreviewSrc from '../images/HomePagePreview.png'

export default class HomePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (SessionStore.user) {
      transition.redirect("profile", {userId: SessionStore.user.username})
    }
  }

  render() {
    return (
      <div>
        <div className="flex flex-column" style={{minHeight: "100vh"}}>
          <div className="flex-none">
            <Divider />
          </div>

          <div className="flex-none p2">
            Assembly
          </div>

          <div className="flex-auto flex flex-center">
            <div className="container p2 overflow-hidden">

              <div className="flex-auto sm-flex mxn3">
                <div className="sm-col-6 px3">
                  <h1 className="mt0 mb3" style={{fontSize: '3rem'}}>Create better, together.</h1>
                </div>
                <div className="sm-col-6 px3">
                  <p className="h3">
                    Excitement grows when more people know. Assembly lets you invite
                    others into the creative process and turn observers into
                    contributors and eager evangelists.
                  </p>
                  <p className="h3 bold">
                    Start your public (or private) changelog today &mdash; it's totes free.
                  </p>

                  <div className="mb3">
                    <Button action={this.handleSignUp.bind(this)} bg="orange" size="big">
                      Sign up
                    </Button>
                  </div>

                  <p className="gray">
                    <a href="javascript:;" onClick={this.handleSignUp}>
                      Sign in
                    </a> with your Assembly account
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-none">
            <div className="container px2">
              <img className="block" src={HomePagePreviewSrc} />
            </div>
          </div>

        </div>
      </div>
    )
  }

  handleSignUp() {
    SessionActions.signin()
  }
}
