import React from 'react'

export default class Navbar extends React.Component {
  render() {
    const {title, left, right} = this.props
    return <div className="navbar flex flex-center relative full-width z1">
      <div className="flex-none p2">
        {left}
      </div>
      <div className="flex-auto center bold">
        {title}
      </div>
      <div className="flex-none">
        {right}
      </div>
    </div>
  }
}

Navbar.propTypes = {
  title: React.PropTypes.node,
  left:  React.PropTypes.node,
  right: React.PropTypes.node
}
