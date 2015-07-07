import Button from 'ui/Button.jsx'
import Icon from 'ui/Icon.jsx'
import Jumbotron from 'ui/Jumbotron.jsx'
import LoginForm from 'components/Authentication/LoginForm.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'
import SignupForm from 'components/Authentication/SignupForm.jsx'
import Sticky from 'ui/Sticky.jsx'
import Navbar from 'ui/Navbar.jsx'
import Link from 'components/Link.jsx'

import HomeWriteImgSrc from 'images/home-write.png'
import HomeEmojiPickerImgSrc from 'images/home-emoji-picker.png'
import HomeContributorsImgSrc from 'images/home-contributors.png'
import HomeSlackImgSrc from 'images/home-slack.png'
import HomeNotificationsImgSrc from 'images/home-notifications.png'
import HomePublicImgSrc from 'images/home-public.png'
import HomePrivateImgSrc from 'images/home-private.png'
import EmojiBgImgSrc from 'images/home-emoji-bg.jpg'
import WorkmarkWhiteImgSrc from 'images/workmark-white.svg'

import LogoImgSrc from 'images/HomePageLogo.svg'


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
        <Navbar
          left={
            <Link to="home">
              <img className="block" src={LogoImgSrc} height={16} />
            </Link>
          }
          right={
            <div className="flex flex-center px1">
              <div className="px1 h5 sm-show">
                Start your <span className="caps">free</span> Changelog
              </div>
              <div className="px1">
                <Button bg="orange" action={this.handleSignUp}>Sign up</Button>
              </div>
              <div className="px1">
                <Button bg="gray" action={this.handleSignIn}>Log in</Button>
              </div>
            </div>
          }
        />

        <Jumbotron bgColor="charcoal">
          <div className="sm-flex flex-center mxn3">
            <div className="sm-col-9 mx-auto center px3 mb3 sm-mb0">
              <h1 className="mt0 mb2">
                Simple Changelogs for happy teams.
              </h1>
              <p className="mb0">
                Know what everyone is working on, get feedback on your work, and
                even share your latest product updates with your community.
              </p>
            </div>
          </div>
        </Jumbotron>

        <div style={{backgroundColor: BgColor}}>
          <div className="container px2 py4" style={{paddingTop: 'calc(4rem + 2rem)'}}>

            <div className="sm-flex mxn3">
              <div className="flex-auto flex-last sm-col-7 px3" style={{marginTop: '-2rem'}}>
                <Sticky>
                  <h1 className="m0 py3 center sm-left-align">
                    Catch up on the team’s progress faster than you can standup
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 mb4">
                  <img className="mb2" src={HomeWriteImgSrc} />
                  <figcaption className="gray">
                    Easily post what you’re working on right now.
                  </figcaption>
                </figure>

                <figure className="m0 mb4">
                  <img className="mb2" src={HomeEmojiPickerImgSrc} />
                  <figcaption className="gray">
                    Pick an Emoji that describes it.
                  </figcaption>
                </figure>

                <figure className="m0 mb4">
                  <img className="mb2" src={HomeContributorsImgSrc} />
                  <figcaption className="gray">
                    Give credit to everyone who helped.
                  </figcaption>
                </figure>
              </div>
            </div>


            <div className="sm-flex mxn3">
              <div className="sm-col-7 flex-last px3">
                <Sticky>
                  <h1 className="m0 py3 center sm-left-align">
                    Get thoughtful feedback from those who care
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 mb4">
                  <img className="mb2" src={HomeSlackImgSrc} />
                  <figcaption className="gray">
                    Automatically share your post on Slack.
                  </figcaption>
                </figure>

                <figure className="m0 mb4">
                  <img className="mb2" src={HomeNotificationsImgSrc} />
                  <figcaption className="gray">
                    Get immediate notifications when anyone leaves feedback.
                  </figcaption>
                </figure>
              </div>
            </div>


            <div className="sm-flex mxn3">
              <div className="sm-col-7 flex-auto flex-last px3">
                <Sticky>
                  <h1 className="m0 py3 center sm-left-align">
                    Invite the community into the creation process with a public
                    Changelog
                  </h1>
                </Sticky>
              </div>

              <div className="sm-col-5 px3">
                <figure className="m0 mb4">
                  <img className="mb2" src={HomePublicImgSrc} />
                  <figcaption className="gray">
                    Let your community contribute and become evangelists of your
                    product.
                  </figcaption>
                </figure>

                <figure className="m0 mb4">
                  <img className="mb2" src={HomePrivateImgSrc} />
                  <figcaption className="gray">
                    Want to keep things within your team? Start with a private
                    Changelog.
                  </figcaption>
                </figure>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-smoke py4" style={{
          backgroundImage: `url(${EmojiBgImgSrc})`,
          backgroundSize: 'cover',
        }}>
          <div className="container px2">
            <div className="sm-col-8 mx-auto center">
              <h2 className="mt0 mb3">
                Customize your Changelog, use emojis, and give it your own
                domain name.
              </h2>
              <Button bg="orange" size="big" action={this.handleSignUp}>
                Create your free Changelog
              </Button>
              <Link className="block mt3" to="changelog" params={{changelogId: 'assembly'}}>
                We're building more features
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-charcoal">
          <div className="container px2">
            <div className="flex flex-center py2">
              <div className="flex-auto white">
                <Link className="block white" to="home">
                  <img className="block" src={WorkmarkWhiteImgSrc} />
                </Link>
              </div>
              <div>
                <ul className="list-reset flex mxn2 mb0">
                  <li>
                    <a className="block p2 gray" href="https://cove.assembly.com/about">About</a>
                  </li>
                  <li>
                    <a className="block p2 gray" href="http://blog.assembly.com">Blog</a>
                  </li>
                  <li>
                    <a className="block p2 gray" href="https://twitter.com/asm"><Icon icon="twitter" /></a>
                  </li>
                  <li>
                    <a className="block p2 gray" href="https://facebook.com/assemblymade"><Icon icon="facebook" /></a>
                  </li>
                </ul>
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
