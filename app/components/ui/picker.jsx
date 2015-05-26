import classnames from 'classnames'
import React from 'react'
import shallowEqual from 'react-pure-render/shallowEqual'
import Table from './table.jsx'

const UPDATE_COUNT = 15

export default class Picker extends React.Component {
  static getOffsetTop(element) {
    let y = 0

    while (element) {
      y += (element.offsetTop - element.scrollTop + element.clientTop)
      element = element.offsetParent
    }

    return y
  }

  constructor(props) {
    super(props)

    this.state = {
      height: props.maxHeight
    }

    this.updateCount = 0
  }

  componentDidMount() {
    this.setState({
      height: this.calculateHeight()
    })
  }

  componentDidUpdate() {
    if (this.updateCount > UPDATE_COUNT) {
      this.updateCount = 0
      return
    }

    this.updateCount++

    this.setState({
      height: this.calculateHeight()
    })
  }

  render() {
    const { maxHeight, position, shown } = this.props
    let style = {
      maxHeight: maxHeight,
      overflow: 'hidden',
      overflowY: 'auto'
    }

    style[position] = -this.state.height

    const classes = classnames('absolute bg-white full-width shadow', {
      border: shown,
      'border-silver': shown,
      z4: position === 'bottom'
    })

    return (
      <div className={classes} ref="container" style={style}>
        {this.props.children}
      </div>
    )
  }

  calculateHeight() {
    if (this.props.position === 'bottom') {
      return
    }

    let node = React.findDOMNode(this.refs.container)
    let height = node.offsetHeight
    let fromTop = Picker.getOffsetTop(node)

    while (fromTop < 0) {
      height = height + fromTop
      fromTop = Picker.getOffsetTop()
    }

    return height
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
  }
}

Picker.defaultProps = {
  maxHeight: 300,
  shown: false
}

Picker.propTypes = {
  maxHeight: React.PropTypes.number,
  position: React.PropTypes.oneOf(['top', 'bottom']),
  shown: React.PropTypes.bool
}
