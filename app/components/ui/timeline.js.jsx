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
      <div className="">
        {children}
      </div>
    )
  }
}

class TimelineItem extends React.Component {
  render() {
    return <div className="border-bottom">{this.props.children}</div>
  }
}

class TimelineDate extends React.Component {
  render() {
    const {date} = this.props
    const m = moment(date)
    return <div className="px2 md-px0 mt2 py2 gray bold border-bottom">
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
