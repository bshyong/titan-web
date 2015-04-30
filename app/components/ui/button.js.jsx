require('./button.css')
import classnames from 'classnames'
import React from 'react'

const Button = React.createClass({
  getDefaultProps() {
    return {
      bg: 'blue',
      color: 'white'
    }
  },

  render() {
    const {children, bg, color} = this.props
    const cn = classnames('btn px2 py1 regular', `bg-${bg}`, color)
    return (
      <button className={cn} style={{borderRadius: 0}} type="submit" {...this.props}>
        {children}
      </button>
    )
  }
})

export default Button
