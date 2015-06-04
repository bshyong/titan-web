import classnames from 'classnames'
import React from 'react'

export default class Button extends React.Component {
  render() {
    const {
      action,
      block,
      color,
      children,
      disabled,
      style,
    } = this.props

    const cn = classnames(
      {
        'block full-width':    block,
        'button--disabled':    disabled,
        'button':              style === 'solid',
        'button-outline':      style === 'outline',
        'button-transparent':  style === 'transparent'
      },
      color
    )

    return (
      <button className={cn} type="submit" disabled={disabled} onClick={action}>
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  action:   React.PropTypes.func,
  color:    React.PropTypes.string,
  block:    React.PropTypes.bool.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  style:    React.PropTypes.oneOf([
    'solid',
    'outline',
    'transparent']).isRequired,
}

Button.defaultProps = {
  block:    false,
  disabled: false,
  style:    'solid'
}
