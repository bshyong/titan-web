import React from 'react'
import {List} from 'immutable'

export default class Stack extends React.Component {
  render() {
    const {items} = this.props
    const renderedItems = List(items).map((item, i) => {
      const zIndex = i
      return (
        <div style={{marginLeft: '-.25rem', zIndex: zIndex}} key={i}>
          {item}
        </div>
      )
    })

    return (
      <div className="flex">
        <div className="flex-shrink">
          <div className="flex" style={{flexDirection: 'row-reverse', marginLeft: '.25rem'}}>
            {renderedItems}
          </div>
        </div>
      </div>
    )
  }
}

Stack.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
}
