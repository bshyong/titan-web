import React from 'react'
import classnames from 'classnames'

export default class Jewel extends React.Component {
  render() {
    const { count, icon } = this.props

    const cn = classnames('center border h6 bold circle relative', {
      'orange border-orange': count > 0,
      'silver': count == 0
    })

    const style = {
      width: 'calc(2rem - 2px)',
      height: 'calc(2rem - 2px)',
      lineHeight: 'calc(2rem - 2px)'
    }

    const normalizedCount = count > 10 ? '10+' : count.toString()

    const label = count > 0 ? normalizedCount : icon

    return <div className={cn} style={style}>
      {label}
    </div>
  }
}

Jewel.propTypes = {
  count: React.PropTypes.number.isRequired,
  icon: React.PropTypes.node.isRequired
}
