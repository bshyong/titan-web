import classnames from 'classnames'
import React from 'react'
import shallowEqual from 'react-pure-render/shallowEqual'
import Table from './Table.jsx'

export default class Picker extends React.Component {
  static getOffsetTop(element) {
    return (element && element.getBoundingClientRect().top) || 0
  }

  renderForFullscreen() {
    const classes = classnames('absolute bg-white full-width z8')
    const style = {
      overflow: 'hidden',
      overflowY: 'auto',
      height: '100vh',
      width: '100vw',
      top: window.pageYOffset,
      left: 0,
      zIndex: 999,
    }

    return (
      <div className={classes} style={style} ref="container">
        {this.props.children}
      </div>
    )
  }

  render() {
    // guard for fullscreen
    if (this.props.fullscreen) {
      return this.renderForFullscreen()
    }

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
  shown: false,
  fullscreen: false,
}

Picker.propTypes = {
  maxHeight: React.PropTypes.number,
  position: React.PropTypes.oneOf(['top', 'bottom']),
  shown: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool,
}
