import React from 'react'
import classnames from 'classnames'

export default class SegmentedControl extends React.Component {
  render() {
    const { children } = this.props
    const style = {
      borderWidth: 2
    }
    return <div className="rounded flex flex-justify bg-smoke border" style={style}>
      {children}
    </div>
  }
}

class SegmentedControlItem extends React.Component {
  render() {
    const { active, children } = this.props
    const cn = classnames('px2 h5 py1 center flex-auto pointer rounded bold', {
      'gray': !active,
      'bg-white orange': active
    })

    return <div {...this.props} className={cn}>{children}</div>
  }
}

SegmentedControlItem.propTypes = {
  active: React.PropTypes.bool.isRequired
}

SegmentedControlItem.defaultProps = {
  active: false
}

SegmentedControl.Item = SegmentedControlItem
