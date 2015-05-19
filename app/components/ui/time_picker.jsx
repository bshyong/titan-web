import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeLength: "day"}
    this.renderTime = this.renderTime.bind(this)
  }

  changeTimeLength(unit) {
    console.log(unit)
    ChangelogActions.changeTimeLength(unit)
    this.setState({timeLength: unit})
  }

  renderTime(unit) {

    if(this.state.timeLength == unit)
    {
      return (
        <span className="px2 field-light">{unit}</span>
      )
    }
    else
    {
      var a = unit
      return (
        <span className="px2" onClick={this.changeTimeLength.bind(this, a)} key={a} >{unit}</span>
      )
    }
  }

  render() {
    return (
      <span>
        {this.renderTime("day")}
        {this.renderTime("week")}
        {this.renderTime("month")}
      </span>
    )
  }
}
