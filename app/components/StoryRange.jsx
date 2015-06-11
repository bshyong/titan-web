import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import Icon from '../ui/Icon.jsx'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import { Link } from 'react-router'

export default class StoryRange extends React.Component {

  constructor(props) {
    super(props)
    this.per = 5
    this.state = {
      page: 1,
      hasMore: this.hasMoreStories()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { stories } = nextProps
    this.setState({
      hasMore: stories.size < stories.minBy(story => story.group_total).group_total
    })
  }

  render() {
    const { date, stories, changelogId } = this.props
    return (
      <Table>
        <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={this.state.hasMore && this.props.truncatable}>
          {stories.map(story => (
            <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: changelogId}, story)}>
              <StoryCell story={story} />
            </Table.Cell>
          ))}
        </ClickablePaginator>
      </Table>
    )
  }

  handleShowMore() {
    const { date, timeInterval } = this.props
    StoryActions.fetchSpecificDate(ChangelogStore.slug, date.format('MM-DD-YYYY'), timeInterval, this.state.page + 1, this.per)
    this.setState({
      page: this.state.page + 1
    })
  }

  hasMoreStories() {
    const { stories } = this.props
    if (stories.size) {
      return stories.size < stories.minBy(story => story.group_total).group_total
    } else {
      return false
    }
  }

  parseCalendarDate() {
    const { date, timeInterval } = this.props
    const start_date = moment(date)

    if (timeInterval === "day") {
      return date.calendar()
    }
    if (timeInterval === "week") {
      var end_date = moment(date).add(1, 'weeks')
    }
    if (timeInterval === "month") {
      var end_date = moment(date).add(1, 'months')
    }
    return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
  }
}

StoryRange.propTypes = {
  date: React.PropTypes.object.isRequired,
  stories: React.PropTypes.object.isRequired,
  storyCount: React.PropTypes.number.isRequired,
  timeInterval: React.PropTypes.string.isRequired,
  truncatable: React.PropTypes.bool.isRequired
}
