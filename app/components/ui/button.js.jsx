import React from 'react'

const Button = React.createClass({
  render() {
    const {children} = this.props
    return (
      <button className="button px3" style={{borderRadius: 99}} type="submit">
        {children}
      </button>
    )
  }
})

export default Button
