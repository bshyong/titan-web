import React from 'react'
import classnames from 'classnames'
import {Link} from 'react-router'

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

class SegmentedControlLink extends React.Component {
  render() {
    return <Link
      {...this.props}
      className="px2 h5 py1 center flex-auto pointer rounded bold gray"
      activeClassName="bg-white orange">{this.props.children}</Link>
  }
}

SegmentedControlLink.propTypes = {
  active: React.PropTypes.bool.isRequired
}

SegmentedControlLink.defaultProps = {
  active: false
}

SegmentedControl.Link = SegmentedControlLink
