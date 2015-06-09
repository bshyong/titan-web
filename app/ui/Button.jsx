import classnames from 'classnames'
import React from 'react'

export default class Button extends React.Component {
  render() {
    const {
      action,
      bg,
      block,
      color,
      children,
      disabled,
      size,
      style,
    } = this.props

    const cn = classnames(
      {
        'block full-width':    block,
        'button--disabled':    disabled,
        'button':              style === 'solid',
        'button-outline':      style === 'outline',
        'button-transparent':  style === 'transparent',
        'button-small':        size === 'small',
        'button-big':          size === 'big',
        'button-narrow':       size === 'narrow'
      },
      (bg ? `bg-${bg}` : null),
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
  action: React.PropTypes.func,
  bg: React.PropTypes.string,
  block: React.PropTypes.bool.isRequired,
  color: React.PropTypes.string,
  disabled: React.PropTypes.bool.isRequired,
  size: React.PropTypes.oneOf([
    'small',
    'default',
    'big',
    'narrow'
  ]).isRequired,
  style: React.PropTypes.oneOf([
    'solid',
    'outline',
    'transparent'
  ]).isRequired,
}

Button.defaultProps = {
  block: false,
  disabled: false,
  size: 'default',
  style: 'solid',
}
