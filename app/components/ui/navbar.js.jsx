import React from 'react'
import {Link} from 'react-router'

// Logo versions:

import LogoSrc from 'images/logo.svg'

export default class Navbar extends React.Component {
  render() {
    const {children} = this.props
    return <div className="navbar flex relative">
      <div className="flex-none p2">
        <img className="block left mr1" src={LogoSrc} style={{height: '1.5rem'}} />
        Assembly
      </div>
      <div className="flex-auto">
        <div className="container p1 sm-p2 center">
          Changelog
        </div>
      </div>
      <div className="flex-none p1 sm-p2">
        <Link to="highlights" params={{changelogId: 'assembly'}}>Write</Link> Profile
      </div>
    </div>
  }
}
