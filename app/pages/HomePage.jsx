import Badge from 'components/Badge.jsx'
import Button from 'ui/Button.jsx'
import Jumbotron from 'ui/Jumbotron.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'
import Sticky from 'react-sticky-position'

import HomeSlackImgSrc from 'images/home-slack.png'
import HomeContributorsImgSrc from 'images/home-contributors.png'
import HomeWriteImgSrc from 'images/home-write.png'

const BgColor = '#F5F6F8'

export default class HomePage extends React.Component {
  static willTransitionTo(transition) {
    if (SessionStore.user) {
      transition.redirect('dashboard')
    }
  }

  render() {
    return (
      <div>

        <Jumbotron bgImageUrl="https://unsplash.imgix.net/photo-1429041966141-44d228a42775?dpr=2&fit=crop&fm=jpg&h=700&q=75&w=1050">
          <div className="container sm-col-8 center mxn2 mb3">

            <div className="px2">
              <h1 className="mt0 mb2">Simple, free public and private Changelogs for happy teams.</h1>
              <p>
                Know what everyone is working on, receive thoughtful feedback on
                your work, and even keep your community informed of the latest
                updates to your product.
              </p>
            </div>
          </div>
        </Jumbotron>

        <div className="relative px2" style={{marginTop: '-2rem', marginBottom: '-2rem'}}>
          <img className="block mx-auto" src={HomeWriteImgSrc} style={{height: '4rem'}} />
        </div>

        <div style={{backgroundColor: BgColor}}>
          <div className="container px2 py4" style={{paddingTop: 'calc(4rem + 2rem)'}}>

            <div className="sm-flex mxn3">
              <div className="flex-auto flex-last sm-col-7 px3">
                <Sticky className="sticky top-0">
                  <h1 className="m0 mb4 center sm-left-align">
                    Quickly post your latest work with style
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 center mb4">
                  <img className="mb2" src="https://s3.amazonaws.com/f.cl.ly/items/0p3g1g13001B3w1d1Q1y/Screen%20Shot%202015-07-06%20at%204.25.52%20PM.png"/>
                  <figcaption className="gray">
                    Pick an Emoji that describes and personalizes your work.
                  </figcaption>
                </figure>

                <figure className="m0 center mb4">
                  <img className="mb2" src={HomeContributorsImgSrc} />
                  <figcaption className="gray">
                    Add multiple contributors to celebrate your teammates.
                  </figcaption>
                </figure>
              </div>
            </div>


            <div className="sm-flex mxn3">
              <div className="sm-col-7 flex-last px3">
                <Sticky className="sticky top-0">
                  <h1 className="m0 mb4 center sm-left-align">
                    Get thoughtful feedback from those who care
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 center mb4">
                  <img className="mb2" src={HomeSlackImgSrc} />
                  <figcaption className="gray">
                    Works great with Slack. Automatically share your work with
                    your team.
                  </figcaption>
                </figure>

                <figure className="m0 center mb4">
                  <img className="mb2" src="https://s3.amazonaws.com/f.cl.ly/items/0p3g1g13001B3w1d1Q1y/Screen%20Shot%202015-07-06%20at%204.25.52%20PM.png"/>
                  <figcaption className="gray">
                    Get immediate notifications when anyone leaves feedback.
                  </figcaption>
                </figure>
              </div>
            </div>


            <div className="sm-flex mxn3">
              <div className="sm-col-7 flex-auto flex-last px3">
                <Sticky className="sticky top-0">
                  <h1 className="m0 py4 center sm-left-align">
                    Invite the community into the creation process with a public
                    Changelog
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 center mb4">
                  <img className="mb2" src="https://s3.amazonaws.com/f.cl.ly/items/0p3g1g13001B3w1d1Q1y/Screen%20Shot%202015-07-06%20at%204.25.52%20PM.png"/>
                  <figcaption className="gray">
                    Public Changelogs invite participation from your community,
                    turning them into contributors and evangelists.
                  </figcaption>
                </figure>

                <figure className="m0 center mb4">
                  <img className="mb2" src="https://s3.amazonaws.com/f.cl.ly/items/0p3g1g13001B3w1d1Q1y/Screen%20Shot%202015-07-06%20at%204.25.52%20PM.png"/>
                  <figcaption className="gray">
                    Want to keep things between your team only? Start with a
                    private Changelog.
                  </figcaption>
                </figure>
              </div>
            </div>

          </div>
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
