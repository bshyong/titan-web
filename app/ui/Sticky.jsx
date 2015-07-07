import React from 'react'
import ReactStickyPosition from 'react-sticky-position'

export default class Stick extends React.Component {
  render() {
    return (
      <ReactStickyPosition classname="sticky top-0">
        {this.props.children}
      </ReactStickyPosition>
    )
  }
}
