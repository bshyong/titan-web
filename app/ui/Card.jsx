import React from 'react'

export default class Card extends React.Component {
  render() {
    return <div className="bg-white bg-smoke-hover p2 rounded">
      {this.props.children}
    </div>
  }
}
