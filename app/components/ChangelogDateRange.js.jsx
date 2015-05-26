import connectToStores from '../lib/connectToStores.jsx'
import moment from 'moment'
import React from 'react'
import StoryRange from './StoryRange.jsx'
import Table from './ui/table.jsx'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'

@connectToStores(StoryStore)
export default class ChangelogDateRange extends React.Component {
  static getPropsFromStores(props) {
     let end_date = props.start_date.add(1, props.timeInterval)
     let start_date = props.start_date
    return {
      stories: StoryStore.all_within_dates(start_date, end_date)
    }
  }

  render() {
    const { start_date, stories, timeInterval } = this.props
    return (
      <div className="container">
        <Table.Separator label={this.parseCalendarDate(this.props.start_date)} key={this.props.start_date.toISOString()} />
        <StoryRange date={start_date} stories={stories.sortBy(story => -story.hearts_count)} storyCount={stories.count()} timeInterval={timeInterval} truncatable={false}/>
      </div>
    )
  }

  parseCalendarDate(key) {
    const { timeInterval } = this.props
    if (timeInterval === "day") {
      return key.calendar()
    }
    var start_date = moment(key)
    if (timeInterval === "week") {
      var end_date = moment(key).add(1, 'weeks')
    }
    if (timeInterval === "month") {
      var end_date = moment(key).add(1, 'months')
    }
    return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
  }

}

ChangelogDateRange.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  start_date: React.PropTypes.object.isRequired,
  timeInterval: React.PropTypes.string.isRequired
}
