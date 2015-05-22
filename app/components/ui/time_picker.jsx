import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'
import StoryActions from '../../actions/story_actions'
import ChangelogStore from '../../stores/changelog_store.js'
import classnames from 'classnames'
import SegmentedControl from './SegmentedControl.jsx'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeLength: "day"}
    this.renderTime = this.renderTime.bind(this)
  }

  changeTimeLength(timeChange) {
    return function(e) {
      ChangelogActions.changeTimeLength(timeChange)
      StoryActions.fetchAll(ChangelogStore.changelog.slug, timeChange)
      this.setState({timeLength: timeChange})
    }
  }

  renderTime(unit, label) {
    const cn = classnames('px2 mr2 pointer border pill', {
      'orange border-orange': this.state.timeLength === unit,
      'gray': this.state.timeLength !== unit
    })
    return (
      <SegmentedControl.Item active={this.state.timeLength === unit} onClick={this.changeTimeLength(unit).bind(this)}>
        {label}
      </SegmentedControl.Item>
    )
  }

  render() {
    return (
      <SegmentedControl>
        {this.renderTime("day", 'Day')}
        {this.renderTime("week", 'Week')}
        {this.renderTime("month", 'Month')}
      </SegmentedControl>
    )
  }
}
