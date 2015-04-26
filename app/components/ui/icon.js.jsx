import React from 'react'
import classnames from 'classnames'

export default class Icon extends React.Component {
  render() {
    const {icon, fw} = this.props
    const cn = classnames('fa', `fa-${icon}`, {
      'fa-fw': fw
    })
    return <span className={cn}></span>
  }
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  fw:   React.PropTypes.bool.isRequired
}

Icon.defaultProps = {
  fw: false
}
