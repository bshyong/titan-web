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
    return <div className="navbar flex relative z1">
      <div className="flex-none p2">
        {left}
      </div>
      <div className="flex-auto p2 center bold">
        {title}
      </div>
      <div className="flex-none p2">
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
