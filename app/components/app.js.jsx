import 'stylesheets/application.css'
import {Link, RouteHandler} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'
import Navbar from 'components/ui/navbar.js.jsx'
import React from 'react'

// Logo versions:

// Blurry, medium weight:
import LogoSrc from 'images/logo.svg'

// Crisp-er, thin weight:
// import LogoSrc from 'images/logo-thin.svg'

// Crisp, fat weight:
// import LogoSrc from 'images/logo-fat.svg'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: SessionStore.user
    }
  }

  render() {
    var changelogId = RouterContainer.get().getCurrentParams().changelogId
    return <div>
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <Navbar>
        <div className="clearfix">
          <div className="left">
            {changelogId ? this.renderTopLink(changelogId) : null}
          </div>
          {this.renderUserOptions()}
        </div>
       </Navbar>

      <RouteHandler />
    </div>
  }

  renderTopLink(changelogId) {
    return <Link to="changelog" params={{changelogId: changelogId}} className="black">
      <img className="block" src={LogoSrc} style={{height: '1.5rem'}} />
    </Link>
  }

  renderUserOptions() {
    if (this.state.user) {
      return <div className="right">
        <a href="#" onClick={SessionActions.signout}>
          <Avatar user={this.state.user} size="1.5rem" />
        </a>
      </div>
    } else {
      return <div className="right">
        <a href="#" onClick={SessionActions.signin}>
          Sign in
        </a>
      </div>
    }
  }

  identifyUser() {
    var user = SessionStore.user
    if(user){
      analytics.identify(user.id, {
        email: user.email,
        avatar: user.avatar_url,
        username: user.username,
      })
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this)
    SessionStore.addChangeListener(this.changeListener)
    this.identifyUser()
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.changeListener)
  }

  _onChange() {
    this.setState({
      user: SessionStore.user
    })
    this.identifyUser()
  }
}
