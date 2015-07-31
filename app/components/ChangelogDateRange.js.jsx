import moment from 'moment'
import React from 'react'
import StoryRange from './StoryRange.jsx'
import Table from 'ui/Table.jsx'
import dateString from 'lib/dateStringForTimeInterval'
import {connect} from 'redux/react'

function allWithinDates(startDate, timeInterval) {
  const endDate = moment(startDate).add(1, timeInterval.concat('s'))
  return this.stories.toList().filter(story => {
    const d = moment(story.created_at)
    return d >= startDate && d < endDate
  })
}

@connect((state, props) => ({
  stories: allWithinDates(moment(props.start_date), props.timeInterval),
}))
export default class ChangelogDateRange extends React.Component {
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    start_date: React.PropTypes.object.isRequired,
    timeInterval: React.PropTypes.string.isRequired,
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
