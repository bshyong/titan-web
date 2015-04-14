import React from 'react'

const Avatar = React.createClass({
  propTypes: {
    size: React.PropTypes.number.isRequired
  },

  render() {
    const {size} = this.props
    return <img className="block circle bg-mid-gray" src="https://avatars2.githubusercontent.com/u/718?v=3&s=460" style={{width: size, height: size}} alt="chrislloyd" />
  }
})

export default Avatar
