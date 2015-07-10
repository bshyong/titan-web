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
import EmojiBgImgSrc from 'images/home-emoji-bg.jpg'
import FacesImgSrc from 'images/faces.gif'
import LogoImgSrc from 'images/HomePageLogo.svg'
import WorkmarkWhiteImgSrc from 'images/workmark-white.svg'


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
export default class HomePage extends React.Component {
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
                <Button bg="orange" action={this.handleSignUp.bind(this)}>Sign up</Button>
              </div>
              <div>
                <Button bg="gray" action={this.handleSignIn.bind(this)}>Log in</Button>
              </div>
            </div>
          }
        />

        <Jumbotron bgColor="blue py5">
          <img className="block mb2" src={FacesImgSrc} width={76 / 2} />
          <h1 className="sm-h00 mt0 mb2 sm-col-10 white">
            Simple Changelogs for happy teams.
          </h1>
          <h2 className="mb0" style={{color: '#004354'}}>
            Follow everyone's progress, get feedback on your work, and share your product updates with the world.
          </h2>
        </Jumbotron>

        <div style={{backgroundColor: BgColor}}>
          <div className="container px2 py5" style={{paddingTop: 'calc(5rem + 1rem)'}}>

            <div className="sm-flex mb5">
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
		  			        Slap some fun on it.
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


            <div className="sm-flex mb5">
              <div className="flex-auto sm-col-5 m0 sm-mr4" style={{marginTop: '-2rem'}}>
                <Sticky>
                  <h2 className="m0 py2 sm-py4 sm-left-align sm-h1">
                    Get thoughtful feedback from those who care
                  </h2>
                </Sticky>
              </div>

              <div className="sm-col-5 m0 sm-ml4">
                <figure className="m0 sm-mb4 py3 sm-mt4">
                  <img className="mb2" src={HomeSlackImgSrc} />
                  <figcaption className="gray">
                    Automatically share your post with everyone in Slack.
                  </figcaption>
                </figure>

                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomeNotificationsImgSrc} />
                  <figcaption className="gray">
                    Get helpful notifications when someone leaves feedback.
                  </figcaption>
                </figure>
              </div>
            </div>

            <div className="sm-flex mb5">
              <div className="flex-auto sm-col-5 m0 sm-mr4" style={{marginTop: '-2rem'}}>
                <Sticky>
                  <h2 className="m0 py2 sm-py4 sm-left-align sm-h1">
                    Invite others into the creation process and grow your community
                  </h2>
                </Sticky>
              </div>

              <div className="sm-col-5 m0 sm-ml4">
                <figure className="m0 sm-mb4 py3 sm-mt4">
                  <img className="mb2" src={HomePublicImgSrc} />
                  <figcaption className="gray">
                    Let your community contribute input and become evangelists of your
                    product with a public Changelog.
                  </figcaption>
                </figure>

                <figure className="m0 sm-mb4 py3">
                  <img className="mb2" src={HomePrivateImgSrc} />
                  <figcaption className="gray">
                    Want to keep things within your core team? Start with a private
                    Changelog.
                  </figcaption>
                </figure>
              </div>
            </div>

          </div>
        </div>

        <div>
          <div className="container px2 py4">
            <h3 className="center border-bottom py2 mb0 mt0">What's happening today in the community</h3>
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
              <Link className="block mt3 h5 gray underline-hover" to="changelog" params={{changelogId: 'assembly'}}>
                Not ready? Check out new features we're building and let us know what you think.
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleSignIn() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'login',
      formContent: { redirectTo: '/dashboard' }
    }))
  }

  handleSignUp() {
    this.props.dispatch(AuthenticationFormActions.changeForm({
      formComponent: 'signup',
      formContent: { redirectTo: '/new' }
    }))
  }
}
