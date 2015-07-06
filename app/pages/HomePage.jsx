import React from 'react'
import Button from 'ui/Button.jsx'
import Divider from 'components/Divider.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import SessionActions from 'actions/SessionActions'
import SessionStore from 'stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'

import HomePageLogoSrc from 'images/HomePageLogo.svg'
import HomePagePreviewSrc from 'images/HomePagePreview.png'

function shouldRedirect() {
  return window.location.host === 'assembly.com'
}

export default class HomePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    // TODO remove when domain transfer is done
    if (shouldRedirect()) {
      window.location.href = 'https://cove.assembly.com'
      return
    }
    if (SessionStore.user) {
      transition.redirect("dashboard")
    }
  }

  render() {
    if (shouldRedirect()) {
      return <div />
    }
    return (
      <div>
        <div className="flex flex-column" style={{minHeight: "100vh"}}>
          <div className="flex-none">
            <div className="full-width overflow-hidden">
              <Divider />
            </div>
          </div>

          <div className="flex-none p2">
            <img src={HomePageLogoSrc} width="196" height="21" />
          </div>

          <div className="flex-auto flex flex-center">
            <div className="container p2 overflow-hidden">

              <div className="flex-auto sm-flex mxn3">
                <div className="sm-col-6 px3">
                  <h1 className="mt0 mb3" style={{fontSize: '3rem'}}>
                    Create better, together.
                  </h1>
                </div>
                <div className="sm-col-6 px3">
                  <p className="h3">
                    Excitement grows when more people know. Assembly lets you
                    invite others into the creation process and turn observers
                    into contributors and eager evangelists.
                  </p>
                  <p className="h3 bold">
                    Start your Changelog today &mdash; it&#39;s
                    totally free.
                  </p>

                  <div className="mb3">
                    <Button action={this.handleSignUp} bg="orange" size="big">
                      Sign up
                    </Button>
                    <span className="ml1">
                      <Button action={this.handleSignIn}
                        size="big"
                        style="outline"
                        color="orange">
                        Log in
                      </Button>
                    </span>
                  </div>
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

  handleSignIn() {
    SigninScrimActions.show(LoginForm, '/dashboard')
  }

  handleSignUp() {
    SigninScrimActions.show(SignupForm, '/new')
  }
}
