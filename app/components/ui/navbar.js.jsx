import React from 'react'

const Navbar = React.createClass({
  render() {
    const {children} = this.props
    return <div className="border-bottom bg-white py2">
      <div className="container">
        <div className="flex px1">
          {children}
        </div>
      </div>
    </div>
  }
})

export default Navbar
