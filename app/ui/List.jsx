import React from 'react'
import classnames from 'classnames'

export default class List extends React.Component {
  render() {
    const { children, type } = this.props
    const cn = classnames('list list-reset mb0 nowrap', {
      'list--small': type === 'small'
    })
    return <ol className={cn}>{children}</ol>
  }
}

List.propTypes = {
  type: React.PropTypes.oneOf(['default', 'small'])
}

List.defaultProps = {
  type: 'default'
}

class ListItem extends React.Component {
  render() {
    return <li className="list-item h5 bg-white bg-smoke-hover">{this.props.children}</li>
  }
}

List.Item = ListItem
