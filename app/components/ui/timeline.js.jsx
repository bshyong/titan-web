require('./timeline.css')
import React from 'react'

const Timeline = React.createClass({
  render() {
    const {children} = this.props
    return (
      <div className="timeline">
        {children}
      </div>
    )
  }
})

export default Timeline
