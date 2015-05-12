import React from 'react'
import classnames from 'classnames'
import {List} from 'immutable'

export default class Stack extends React.Component {
  render() {
    const {items, align} = this.props
    const renderedItems = List(items).map((item, i) => {
      const zIndex = i
      return (
        <div className="stack-item" style={{zIndex: zIndex}} key={i}>
          {item}
        </div>
      )
    })

    const cn = classnames('stack', 'flex', {
      'stack--left': align === 'left',
      'stack--right': align === 'right'
    })

    return (
      <div className="flex">
        <div className="flex-shrink">
          <div className={cn} style={{}}>
            {renderedItems}
          </div>
        </div>
      </div>
    )
  }
}

Stack.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
  align: React.PropTypes.oneOf(['left', 'right'])
}

Stack.defaultProps = {
  align: 'left'
}
