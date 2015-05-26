import moment from 'moment'
import React from 'react'
import StoryRange from './StoryRange.jsx'
import Table from './ui/table.jsx'


export default class ChangelogDateRange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {date: moment(this.props.date, "MM DD YYYY")}
  }

  render() {
    const { date, stories } = this.props
    return (
      <div>
        <Table.Separator label={this.parseCalendarDate(date)} key={date.toISOString()} />
        <StoryRange date={date} stories={stories.sortBy(story => -story.hearts_count)} storyCount={stories.count()} timeInterval={timeInterval} />
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
  date: React.PropTypes.string.isRequierd,
  stories: React.PropTypes.object.isRequired,
  timeInterval: React.PropTypes.string.isRequired
}
