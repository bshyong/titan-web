import React from 'react'

const Navbar = React.createClass({
  render() {
    const {children} = this.props
    return <div className="border-bottom bg-white py2">
      <div className="container px2">
        {children}
      </div>
    </div>
  }
})

export default Navbar
