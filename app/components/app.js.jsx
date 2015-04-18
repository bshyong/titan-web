require('file?name=index.html!../../index.html')
require('stylesheets')
import {Link, RouteHandler} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
import Navbar from 'components/ui/navbar.js.jsx'
import React from 'react'

// Logo versions:

// Blurry, medium weight:
import LogoSrc from 'images/logo.svg'

// Crisp-er, thin weight:
// import LogoSrc from 'images/logo-thin.svg'

// Crisp, fat weight:
// import LogoSrc from 'images/logo-fat.svg'

const App = React.createClass({

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
          <div className="right">
            <Avatar user={{username: 'chrislloyd'}} size="1.5rem" />
          </div>
        </div>
      </Navbar>

      <RouteHandler />
    </div>
  }
})

export default App
