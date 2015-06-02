import classnames from 'classnames'
import React from 'react'
import shallowEqual from 'react-pure-render/shallowEqual'
import Table from './Table.jsx'

export default class Picker extends React.Component {
  static getOffsetTop(element) {
    const top = element && element.getBoundingClientRect().top
    return top < 0 ? 0 : top
  }

  render() {
    const { maxHeight, position, shown } = this.props
    let style = {
      maxHeight: maxHeight,
      overflow: 'hidden',
      overflowY: 'auto'
    }

    style[position] = -maxHeight

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
