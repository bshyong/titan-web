import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'
import StoryActions from '../../actions/story_actions'
import ChangelogStore from '../../stores/changelog_store.js'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeLength: "day"}
    this.renderTime = this.renderTime.bind(this)
  }

  changeTimeLength(e) {
    var timeChange = e.target.textContent
    ChangelogActions.changeTimeLength(timeChange)
    StoryActions.fetchAll(ChangelogStore.changelog.slug, timeChange)
    this.setState({timeLength: timeChange})
  }

  renderTime(unit) {
    if (this.state.timeLength == unit) {
      return (
        <span className="px2 mx2 pointer border orange" style={{borderRadius:'2rem',lineHeight:'2rem', borderColor: 'orange', borderWidth: '2px'}}>{unit}</span>
      )
    }
    else {
      return (
        <span className="px2 mx2 pointer gray border" style={{borderRadius:'2rem',lineHeight:'2rem'}} onClick={this.changeTimeLength.bind(this)}>{unit}</span>
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
      <span className="right">
        {this.renderTime("day")}
        {this.renderTime("week")}
        {this.renderTime("month")}
      </span>
    )
  }
}
