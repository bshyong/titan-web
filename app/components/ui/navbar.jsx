import React from 'react'

export default class Navbar extends React.Component {
  componentDidMount() {
    document.title = this.props.title || document.title
  }

  componentDidUpdate() {
    document.title = this.props.title || document.title
  }

  render() {
    const {title, left, right} = this.props
    return <div className="navbar flex relative full-width z1">
      <div className="absolute left-0 right-0 p2 center bold z0">
        {title}
      </div>
      <div className="flex-none p2 z4">
        {left}
      </div>
      <div className="flex-auto"></div>
      <div className="flex-none px2 py1 z4">
        {right}
      </div>
    </div>
  }
}

Navbar.propTypes = {
  title: React.PropTypes.string,
  left:  React.PropTypes.node,
  right: React.PropTypes.node
}
