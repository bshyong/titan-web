import classnames from 'classnames'
import React from 'react'

export default class Button extends React.Component {

  static getDefaultProps() {
    return {
      bg: 'blue',
      text: 'white',
      block: false
    }
  }

  render() {
    const {
      action,
      bg,
      block,
      children,
      disabled,
      text,
    } = this.props

    const cn = classnames('button px2 py1 rounded', `bg-${bg}`, text, {
      'button--block':    block,
      'button--disabled': disabled
    })

    return (
      <button className={cn} type="submit" disabled={disabled} onClick={action}>
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  bg: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  block: React.PropTypes.bool.isRequired
}
