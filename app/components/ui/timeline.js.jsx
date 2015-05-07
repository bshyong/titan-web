// It might appear that this component is a noop. However, I think it
// makes sense to move the actual dates and items in here as
// sub-components. The abstraction still makes sense even though the
// styling is non-existant (ATM). ~ @chrislloyd

import React from 'react'
import moment from 'moment'

export default class Timeline extends React.Component {
  render() {
    const {children} = this.props
    return (
      <div className="mxn1">
        {children}
      </div>
    )
  }
}

class TimelineItem extends React.Component {
  render() {
    return <div className="">{this.props.children}</div>
  }
}

class TimelineDate extends React.Component {
  render() {
    const {date} = this.props
    const m = moment(date)
    return <div className="px1 py2 mid-gray bold bg-white">
      {moment(date).calendar()}
    </div>
  }
}

TimelineDate.propTypes = {
  // It sucks having to create a new moment object to do a check - it
  // would be nice if moment exported a class ~ @chrislloyd
  date: React.PropTypes.instanceOf(moment().constructor).isRequired
}

Timeline.Date = TimelineDate
Timeline.Item = TimelineItem
