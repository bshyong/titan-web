import React from 'react'
import classnames from 'classnames'
import {List} from 'immutable'

export default class Stack extends React.Component {
  render() {
    const {items, align} = this.props
    const renderedItems = List(items).map((item, i) =>
      <div className="stack-item" key={i}>{item}</div>
    )

    const cn = classnames('stack', 'flex', {
      'stack--left': align === 'left',
      'stack--right': align === 'right'
    })

    return (
      <div className="flex">
        <div className="flex-shrink">
          <div className={cn}>
            {renderedItems}
          </div>
        </div>
      </div>
    )
  }
}

Stack.propTypes = {
  items: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.object,
  ]).isRequired,
  align: React.PropTypes.oneOf(['left', 'right'])
}

Stack.defaultProps = {
  align: 'left'
}
