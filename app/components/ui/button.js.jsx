require('basscss/css/basscss.css')
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
    const cn = classnames('button px3', `bg-${bg}`, color)
    return (
      <button className={cn} style={{borderRadius: 99}} type="submit">
        {children}
      </button>
    )
  }
})

export default Button
