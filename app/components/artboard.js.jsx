import React from 'react'

export default class Artboard extends React.Component {
  render() {
    const {width, height, title, children} = this.props

    return (
      <div className="flex absolute top-0 left-0 right-0 bottom-0">
        <div className="mx-auto" style={{width: width}}>
          <div className="border bg-white" style={{width: width, height: height}}>{children}</div>
          {title}
        </div>
      </div>
    )
  }
}

Artboard.Canvas = class Canvas extends React.Component {
  render() {
    <div className="p3">
      <div className="border p4 bg-white">
        hi
      </div>
      {this.props.desc}
    </div>
  }
}
