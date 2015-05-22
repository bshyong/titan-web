import React from 'react'
import Table from './ui/table.js.jsx'
import Icon from './ui/icon.js.jsx'
import Stack from './ui/stack.jsx'
import Avatar from './ui/avatar.jsx'
import Emoji from './ui/emoji.jsx'
import StoryActions from '../actions/story_actions'
import moment from 'moment'

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
        {limitedStories.map(this.renderStoryTableCell)}
        {this.renderShowAll()}
      </Table>
    )
  }

  truncatedStories() {
    const { timeInterval, stories } = this.props
    if (!this.state.expanded && timeInterval != "day") {
      return stories.slice(0,5)
    } else {
      return stories
    }
  }

  renderShowAll() {
    const { date, stories, storyCount, timeInterval } = this.props

    if (stories.count() < 5 || timeInterval ==="day") {
      return
    }

    return (
      <a className="block py2 h5 pointer" onClick={this.handleToggleExpanded.bind(this)}>
        {this.state.expanded ? 'Hide' : 'Show All'}
      </a>
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

  renderStoryTableCell(story) {
    const emoji = (
      <Emoji story={story} size="sm"
             hearted={story.viewer_has_hearted}
             onClick={() => StoryActions.clickHeart(story)} />
    )

    return (
      <Table.Cell key={story.id} image={emoji} to="story" params={story.urlParams}>
        <div className="flex">
          <div className="flex-auto">
            {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
          </div>
          <div className="flex-none sm-show ml2">
            <Stack items={story.allContributors.map(user => <Avatar user={user} size={24} />)} align="right" />
          </div>

          <div className="flex-none ml2">
            <div className="h5 gray  mxn1 flex">
              <div className="px1 no-underline">
                <span className=" silver"><Icon icon="comment" /></span>
                {' '}
                {story.live_comments_count}
              </div>
            </div>
          </div>
        </div>
      </Table.Cell>
    )
  }
}

StoryRange.propTypes = {
  date: React.PropTypes.object.isRequired,
  stories: React.PropTypes.array.isRequired,
  storyCount: React.PropTypes.number.isRequired,
  timeInterval: React.PropTypes.string.isRequired
}
