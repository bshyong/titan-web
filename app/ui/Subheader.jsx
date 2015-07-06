import React from 'react'

export default class Subheader extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
  }

  render() {
    return <div className="mt3 p2 sm-px0 border-bottom bold">{this.props.text}</div>
  }
}
