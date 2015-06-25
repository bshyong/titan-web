import React from 'react'
import classnames from 'classnames'

export default class Icon extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    color: React.PropTypes.string,
    fw:   React.PropTypes.bool.isRequired,
  }

  static defaultProps = {
    fw: false
  }

  render() {
    const {color, icon, fw} = this.props
    const cn = classnames('fa', `fa-${icon}`, color, {
      'fa-fw': fw
    })
    return <span className={cn}></span>
  }
}
