// It might appear that this component is a noop. However, I think it
// makes sense to move the actual dates and items in here as
// sub-components. The abstraction still makes sense even though the
// styling is non-existant (ATM). ~ @chrislloyd

import React from 'react'

const Timeline = React.createClass({
  render() {
    const {children} = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
})

export default Timeline
