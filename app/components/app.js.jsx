require('file?name=index.html!../../index.html')
require('stylesheets')
import {Link, RouteHandler} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
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
  constructor() {
    this.state = {
      user: SessionStore.user
    }
  }

  render() {
    return <div>
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
      <Navbar>
        <div className="clearfix">
          <div className="left">
            <Link to="root" className="black">
              <img className="block" src={LogoSrc} style={{height: '1.5rem'}} />
            </Link>
          </div>
          {this.renderUserOptions()}
        </div>
      </Navbar>

      <RouteHandler />
    </div>
  }

  renderUserOptions() {
    if (this.state.user) {
      return <div className="right" onClick={SessionActions.signout}>
        <Avatar user={this.state.user} size="1.5rem" />
      </div>
    } else {
      return <div className="right" onClick={SessionActions.signin}>
        Sign in
      </div>
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this)
    SessionStore.addChangeListener(this.changeListener)
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.changeListener)
  }

  _onChange() {
    this.setState({
      user: SessionStore.user
    })
  }
}
