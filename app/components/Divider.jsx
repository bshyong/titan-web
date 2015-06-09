import React from 'react'

const rand = (n) => {
  return Math.floor(Math.random() * n)
}

const sample = (arr) => {
  return arr[rand(arr.length)]
}

const Colors = [
  "rgba(0,   163, 185, 0.6)",
  "rgba(239, 84,  68,  0.6)",
  "rgba(147, 189, 22,  0.6)",
  "rgba(252, 203, 14,  0.6)",
  "rgba(32,  91,  103, 0.6)",
]

export default class Divider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {width: 0}
  }

  componentDidMount() {
    console.log()
    this.setState({width: React.findDOMNode(this).offsetWidth})
  }

  render() {
    const { fill, height } = this.props

    let bars = []
    let i
    let pos = -height
    while(pos < this.state.width) {
      let x = (-2 * height) + (rand(4) * height)

      if (x === 0) {
        x = height
      }

      const width = height + (rand(20) * height)

      const bar = this.renderBar(
        pos + x,
        width,
        sample(Colors)
      )
      bars.push(bar)
      pos = pos + (x + width)
    }

    return (
      <div className="relative" style={{mixBlendMode: "multiply"}}>
        {bars}
      </div>
    )
  }

  renderBar(x, width, color) {
    return <div className="absolute pill" style={{height: this.props.height, width: width, left: x, backgroundColor: color}} />
  }
}

Divider.defaultProps = {
  width: 1800,
  height: 8,
  fill: 'currentcolor'
}
