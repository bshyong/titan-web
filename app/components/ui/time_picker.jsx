import React from 'react'
import ChangelogActions from '../../actions/changelog_actions'
import StoryActions from '../../actions/story_actions'
import ChangelogStore from '../../stores/changelog_store.js'
import classnames from 'classnames'
import SegmentedControl from './SegmentedControl.jsx'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeInterval: "day"}
    this.renderTime = this.renderTime.bind(this)
  }

  changeTimeInterval(timeChange) {
    return function(e) {
      ChangelogActions.changeTimeInterval(timeChange)
      StoryActions.fetchAll(ChangelogStore.changelog.slug, timeChange)
      this.setState({timeInterval: timeChange})
    }
  }

  renderTime(unit, label) {
    const cn = classnames('px2 mr2 pointer border pill', {
      'orange border-orange': this.state.timeInterval === unit,
      'gray': this.state.timeInterval !== unit
    })
    return (
      <SegmentedControl.Item active={this.state.timeInterval === unit} onClick={this.changeTimeInterval(unit).bind(this)}>
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
