import React from 'react'
import ChangelogActions from '../actions/changelog_actions'
import StoryActions from '../actions/story_actions'
import ChangelogStore from '../stores/changelog_store.js'
import classnames from 'classnames'
import SegmentedControl from '../ui/SegmentedControl.jsx'

export default class ViewPicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedView: localStorage.getItem('defaultView') || 'week'
    }
    this.renderOption = this.renderOption.bind(this)
  }

  render() {
    return (
      <SegmentedControl>
        {this.renderOption("day", 'Day')}
        {this.renderOption("week", 'Week')}
        {this.renderOption("month", 'Month')}
      </SegmentedControl>
    )
  }

  changeView(viewName) {
    return () => {
      if (viewName !== ChangelogStore.selectedView) {
        ChangelogActions.changeView(viewName)
        StoryActions.fetchAll(ChangelogStore.changelog.slug, viewName)
        this.setState({selectedView: viewName})

        localStorage.setItem('defaultView', viewName)
      }
    }
  }

  renderOption(value, label) {
    const cn = classnames('px2 mr2 pointer border pill', {
      'orange border-orange': this.state.selectedView === value,
      'gray': this.state.selectedView !== value
    })
    return (
      <SegmentedControl.Item
        active={this.state.selectedView === value}
        onClick={this.changeView(value).bind(this)}>
        {label}
      </SegmentedControl.Item>
    )
  }
}
