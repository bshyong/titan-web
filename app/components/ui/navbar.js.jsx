import React from 'react'

const Navbar = React.createClass({
  render() {
    const {children} = this.props
    return <div className="border-bottom bg-white">
      <div className="container p1">
        {children}
      </div>
    </div>
  }
})

export default Navbar
