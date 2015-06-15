import connectToStores from '../lib/connectToStores.jsx'
import moment from 'moment'
import React from 'react'
import StoryRange from './StoryRange.jsx'
import Table from '../ui/Table.jsx'
import StoryActions from '../actions/story_actions'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import dateString from '../lib/dateStringForTimeInterval'

@connectToStores(GroupedStoriesStore)
export default class ChangelogDateRange extends React.Component {
  static getPropsFromStores(props) {
    let start_date = moment(props.start_date)
    return {
      stories: GroupedStoriesStore.allWithinDates(start_date, props.timeInterval)
    }
  }

  render() {
    const { start_date, stories, timeInterval, changelogId } = this.props
    return (
      <div className="container">
        <Table.Separator label={dateString(start_date, timeInterval)} key={this.props.start_date.toISOString()} />
        <StoryRange date={start_date} stories={stories.sortBy(story => -story.hearts_count)} storyCount={stories.count()} timeInterval={timeInterval} truncatable={false} changelogId={changelogId}/>
      </div>
    )
  }
}

ChangelogDateRange.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  start_date: React.PropTypes.object.isRequired,
  timeInterval: React.PropTypes.string.isRequired
}
