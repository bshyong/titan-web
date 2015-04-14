import React from 'react'

const Navbar = React.createClass({
  render() {
    const {children} = this.props
    return <div className="bg-white border-bottom py2 mb3">
      <div className="container col-8">
        {children}
      </div>
    </div>
  }
})

export default Navbar
