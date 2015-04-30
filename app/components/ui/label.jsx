import React from 'react'

export default class Label extends React.Component {
  render() {
    const {name, color, bg} = this.props
    const style = {
      color: color,
      backgroundColor: bg
    }
    return <div className="rounded px1 inline-block bold" style={style}>
      {name}
    </div>
  }
}
