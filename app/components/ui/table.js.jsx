// It might appear that this component is a noop. However, I think it
// makes sense to move the actual dates and items in here as
// sub-components. The abstraction still makes sense even though the
// styling is non-existant (ATM). ~ @chrislloyd

import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import {Link, Route} from 'react-router'

export default class Table extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class TableCell extends React.Component {
  render() {
    return (
      <div className="flex">
        {this.image()}
        {this.cell()}
      </div>
    )
  }

  image() {
    const { image } = this.props

    if (!image) {
      return
    }

    return (
      <div className="table-cell-image flex-none">{image}</div>
    )
  }

  cell() {
    const { children, to } = this.props
    const cn = classnames(
      "table-cell-content",
      "flex-auto p2 md-px0 border-bottom black gray-visited"
    )

    let Component = 'div'

    if (this.props.to) {
      Component = Link
    }

    return (
      <Component {...this.props} className={cn}>{children}</Component>
    )
  }
}

TableCell.propTypes = {
  image: React.PropTypes.node,
  to: React.PropTypes.oneOfType([React.PropTypes.string, Route])
}

class TableSeparator extends React.Component {
  render() {
    const { label } = this.props
    return <h5 className="p2 md-px0 mt2 mb0 gray caps border-bottom">{label}</h5>
  }
}

TableSeparator.propTypes = {
  label: React.PropTypes.string.isRequired
}

Table.Cell = TableCell
Table.Separator = TableSeparator