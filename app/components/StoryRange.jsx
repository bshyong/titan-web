import Avatar from '../ui/Avatar.jsx'
import Badge from './Badge.jsx'
import ChangelogStore from '../stores/changelog_store'
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
    this.state = {
      expanded: false
    }
  }

  render() {
    const { date, stories } = this.props
    let limitedStories = this.truncatedStories()
    return (
      <Table>
        {limitedStories.map(story => (
          <Table.Cell key={story.id} image={<UpvoteToggler story={story} hearted={story.viewer_has_hearted} />} to="story" params={paramsFor.story({id: 'assembly'}, story)}>
            <StoryCell story={story} />
          </Table.Cell>
        ))}
        {this.renderShowAll()}
      </Table>
    )
  }

  truncatedStories() {
    const { timeInterval, stories } = this.props
    if (!this.state.expanded && timeInterval != "day" && this.props.truncatable) {
      return stories.slice(0,5)
    } else {
      return stories
    }
  }

  renderShowAll() {
    const { date, stories, storyCount, timeInterval } = this.props

    if (stories.count() < 5 || timeInterval ==="day" || !this.props.truncatable) {
      return
    }
    let changelogId = ChangelogStore.changelog.slug
    let formatted_date = date.format('MM-DD-YYYY')
    return (
      <div className="block py2 h5 pointer">
        <Link to="changelog_date" params={{changelogId: changelogId, date: formatted_date, timeInterval: timeInterval}} className="black">
          See All
        </Link>
      </div>
    )
  }

  handleToggleExpanded(e) {
    this.setState({expanded: !this.state.expanded})
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
