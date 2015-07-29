import * as AuthenticationFormActions from 'actions/AuthenticationFormActions'
import Button from 'ui/Button.jsx'
import { connect } from 'redux/react'
import Icon from 'ui/Icon.jsx'
import Jumbotron from 'ui/Jumbotron.jsx'
import Link from 'components/Link.jsx'
import Navbar from 'ui/Navbar.jsx'
import onMobile from 'lib/on_mobile'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'
import SigninScrimActions from 'actions/SigninScrimActions'
import statics from 'lib/statics'
import Sticky from 'ui/Sticky.jsx'
import StoryActions from 'actions/story_actions'
import StoryFeed from 'components/StoryFeed.jsx'

import HomeWriteImgSrc from 'images/home-write.png'
import HomeEmojiPickerImgSrc from 'images/home-emoji-picker.png'
import HomeContributorsImgSrc from 'images/home-contributors.png'
import HomeSlackImgSrc from 'images/home-slack.png'
import HomeNotificationsImgSrc from 'images/home-notifications.png'
import HomePublicImgSrc from 'images/home-public.png'
import HomePrivateImgSrc from 'images/home-private.png'
import HomeCommentImgSrc from 'images/comment.png'
import EmojiBgImgSrc from 'images/home-emoji-bg.jpg'
import FacesImgSrc from 'images/faces.gif'
import LogoImgSrc from 'images/HomePageLogo.svg'
import WorkmarkWhiteImgSrc from 'images/workmark-white.svg'
import SoloSrc from 'images/solo.svg'
import TeamsSrc from 'images/small-teams.svg'


const BgColor = '#F5F6F8'
@statics({
  willTransitionTo(transition) {
    if (SessionStore.user) {
      return transition.redirect('dashboard')
    }
    StoryActions.fetchFeed()
  }
})
@connect(state => ({}))
export default class ChangelogHomePage extends React.Component {
  constructor(props) {
    super(props)

    this.handleSignIn = this._handleSignIn.bind(this)
    this.handleSignUp = this._handleSignUp.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar
          left={
            <Link className="block p2" to="home">
              <img className="block" src={LogoImgSrc} height={onMobile() ? 14 : 16} />
            </Link>
          }
          right={
            <div className="flex flex-center px1">
              <div className="px1 h5 sm-show">
                Want to keep everyone connected?
              </div>
              <div className="mr1">
                <Button bg="orange" action={this.handleSignUp}>Sign up</Button>
              </div>
              <div>
                <Button bg="gray" action={this.handleSignIn}>Log in</Button>
              </div>
            </div>
          }
        />

        <Jumbotron bgColor="blue">
          <div className="py3">
            <img className="block mb2" src={FacesImgSrc} width={76 / 2} />
            <h1 className="sm-h00 mt0 mb2 sm-col-10 white">
              Simple Changelogs for happy teams.
            </h1>
            <h2 className="mb0" style={{color: '#004354'}}>
              Follow everyone’s progress, get feedback on your work, and share you product updates with your team and the world.
            </h2>
          </div>
        </Jumbotron>

        <div>
          <div className="container px2 py4">
            <h3 className="center py3 mb0 mt0">Use Changelog for teams and projects of all sizes</h3>
            <div className="sm-mt4 sm-mb4 sm-flex flex-baseline">
              <div className="sm-col-6 center p3 border-right">
                <img src={TeamsSrc} />
                <h2 className="sm-h1">Small Teams</h2>
                <figcaption className="gray">Communication is the lifeblood of high-performance teams! Create more signal, less noise.</figcaption>
              </div>
              <div className="sm-col-6 center p3" >
                <img src={SoloSrc} />
                <h2 className="sm-h1">Solo Projects</h2>
                <figcaption className="gray">Building a community around your indie project is vital for your success. Save time, money, and resources to get it done.</figcaption>
              </div>
            </div>
            <div className="sm-mb4">
                <h4 className="center blue">How it works</h4>
                <i className="h3 fa fa-arrow-circle-o-down blue center block"></i>
            </div>
          </div>
        </div>
        <div style={{backgroundColor: BgColor}}>
          <div className="container px2 py4" style={{paddingTop: 'calc(5rem + 1rem)'}}>
            <div className="sm-flex mb4">
              <div className="flex-auto sm-col-5 m0 sm-mr4" style={{marginTop: '-2rem'}}>
                <Sticky>
                  <h2 className="m0 py2 sm-py4 sm-left-align sm-h1">
                    Catch up on the team’s progress faster than you can standup
                  </h2>
                </Sticky>
              </div>

              <div className="sm-col-5 m0 sm-ml4">
                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomeWriteImgSrc} />
                  <figcaption className="gray">
                    Easily post about the work you’ve recently finished or new ideas you have.
                  </figcaption>
                </figure>

                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomeEmojiPickerImgSrc} />
                  <figcaption className="gray">
		  			Give your update some character, make it fun!
                  </figcaption>
                </figure>

                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomeContributorsImgSrc} />
                  <figcaption className="gray">
                    Give credit to everyone who helped.
                  </figcaption>
                </figure>
              </div>
            </div>


            <div className="sm-flex">
              <div className="flex-auto sm-col-5 m0 sm-mr4" style={{marginTop: '-2rem'}}>
                <Sticky>
                  <h2 className="m0 py2 sm-py4 sm-left-align sm-h1">
                    Get thoughtful and actionable feedback from those who care
                  </h2>
                </Sticky>
              </div>

              <div className="sm-col-5 m0 sm-ml4">
                <figure className="m0 sm-mb4 py3 sm-mt4">
                  <img className="mb2" src={HomeCommentImgSrc} />
                  <figcaption className="gray">
                    Getting people involved leads to quicker progress, a happier team, and a better product.
                  </figcaption>
                </figure>

                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomeSlackImgSrc} />
                  <figcaption className="gray">
                    Automatically share your update with everyone in Slack (and more integrations to come)!
                  </figcaption>
                </figure>

              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="container px2 py4">
            <h3 className="center border-bottom py2 mb0 mt0">See how the community is using Changelog</h3>
            <StoryFeed />
            <div className="border-top center py2">
              <Button style="transparent" color="orange" action={this.handleSignUp}>Sign up and see more</Button>
            </div>
          </div>
        </div>

        <div className="bg-smoke py4" style={{
          backgroundImage: `url(${EmojiBgImgSrc})`,
          backgroundSize: 'cover',
        }}>
          <div className="container px2">
            <div className="sm-col-8 mx-auto center">
              <h3 className="mt0 mb3">
                Customize your Changelog to work just how you like, from the emojis to its domain.
              </h3>
              <Button bg="orange" size="big" action={this.handleSignUp}>
                Create your free Changelog
              </Button>
              <Link className="block mt3 h5 gray underline gray-hover underline-hover" to="changelog" params={{changelogId: 'assembly'}}>
                Not ready? <span className="block">Watch us build Assembly and let us know your thoughts.</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleSignIn() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'login',
      formContent: { redirectTo: '/dashboard' }
    }))
  }

  _handleSignUp() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'signup',
      formContent: { redirectTo: '/new' }
    }))
  }
}
