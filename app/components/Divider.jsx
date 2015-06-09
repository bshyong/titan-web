import React from 'react'

const rand = (n) => {
  return Math.floor(Math.random() * n)
}

const sample = (arr) => {
  return arr[rand(arr.length)]
}

const Colors = [
  "rgba(0,   163, 185, 0.8)",
  "rgba(239, 84,  68,  0.8)",
  "rgba(147, 189, 22,  0.8)",
  "rgba(252, 203, 14,  0.8)",
  "rgba(32,  91,  103, 0.8)",
]

export default class Divider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {width: 0}
  }

  componentDidMount() {
    this.setState({width: React.findDOMNode(this).offsetWidth})
  }

  // This rendering method uses CSS `mix-blend-mode` which is nice, but kind of
  // hackey. The colors need to be definited with opacity for them to have any
  // multiplication overlap, so they're a little lighter than I'd like them
  // to be. If this is going to be refactored it's probably a good idea to use
  // Canvas' `globalCompositeOperation = "multiply"`. I wasn't 100% sure the
  // best way of using canvas with React. ~@chrislloyd
  
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
      <div className="relative" style={{mixBlendMode: "multiply", height: height}}>
        {bars}
      </div>
    )
  }

  renderBar(x, width, color) {
    return <div className="absolute pill" style={{height: this.props.height, width: width, left: x, backgroundColor: color}} />
  }
}

Divider.propTypes = {
  height: React.PropTypes.number.isRequired,
}

Divider.defaultProps = {
  height: 6,
}
