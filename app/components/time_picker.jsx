import React from 'react'
import ChangelogActions from '../actions/changelog_actions'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store.js'
import classnames from 'classnames'
import SegmentedControl from '../ui/SegmentedControl.jsx'

export default class TimePicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {timeInterval: this.initTimeInterval() }
    this.renderTime = this.renderTime.bind(this)
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

  initTimeInterval() {
    let t = localStorage.getItem('preferredTimeInterval')
    if (t==null) {
      t = "week"
    }
    return t
  }

  changeTimeInterval(timeChange) {
    return function(e) {
      ChangelogActions.changeTimeInterval(timeChange)
      StoryActions.fetchAll(ChangelogStore.changelog.slug, timeChange)
      this.setState({timeInterval: timeChange})

      localStorage.setItem('preferredTimeInterval', timeChange)

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
}
