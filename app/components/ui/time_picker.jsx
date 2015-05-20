import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeLength: "day"}
    this.renderTime = this.renderTime.bind(this)
  }

  changeTimeLength(e) {
    var timeChange = e.target.textContent
    ChangelogActions.changeTimeLength(timeChange)
    this.setState({timeLength: timeChange})
  }

  renderTime(unit) {
    if(this.state.timeLength == unit)
    {
      return (
        <span className="px2 border field-light">{unit}</span>
      )
    }
    else
    {
      var a = unit
      return (
        <span className="px2 border" onClick={this.changeTimeLength.bind(this)}>{unit}</span>
      )
    }
  }

  renderTimeWarp() {
    return (
      <div>
        <input type="range" name="points" min="0" max="2" onChange={this.changeTimeLength.bind(this)} />
      </div>
    )
  }

  render() {
    return (
      <span className='border'>
        {this.renderTime("day")}
        {this.renderTime("week")}
        {this.renderTime("month")}
      </span>
    )
  }
}
