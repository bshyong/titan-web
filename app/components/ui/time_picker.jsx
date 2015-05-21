import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'
import StoryActions from '../../actions/story_actions'
import ChangelogStore from '../../stores/changelog_store.js'
import classnames from 'classnames'

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
    const cn = classnames('px2 mr2 pointer border pill', {
      'orange border-orange': this.state.timeLength === unit,
      'gray': this.state.timeLength !== unit
    })

    if (this.state.timeLength == unit) {
      return (
        <div className="px2 mr2 pointer border orange border-orange pill" style={{borderWidth: 2}}>{unit}</div>
      )
    } else {
      return (
        <div className="px2 mr2 pointer gray border pill" onClick={this.changeTimeLength.bind(this)}>{unit}</div>
      )
    }
  }

  render() {
    return (
      <div className="flex">
        <div className="flex-auto" />
        <div className="flex-none">
          <div className="flex mxn2">
            {this.renderTime("day")}
            {this.renderTime("week")}
            {this.renderTime("month")}
          </div>
        </div>
      </div>
    )
  }
}
