import React from 'react'
import Table from './ui/table.jsx'
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

    return (
      <Table>
        <Table.Separator label={this.parseCalendarDate()} key={date.toISOString()} />
        {stories.map(this.renderStoryTableCell)}
        {this.renderShowAll()}
      </Table>
    )
  }

  renderShowAll() {
    const { date, stories, storyCount } = this.props

    if (stories.count() >= storyCount) {
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
    const { date, timeLength } = this.props

    if (timeLength === "day") {
      return date.calendar()
    }

    if (timeLength === "week") {
      var start_date = moment(date)
      var end_date = moment(date).add(1, 'weeks')
      return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
    }

    if (timeLength === "month") {
      var start_date = moment(date)
      var end_date = moment(date).add(1, 'months')
      return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
    }
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
  date: React.PropTypes.shape({
    toISOString: React.PropTypes.func.isRequired
  }).isRequired,
  stories: React.PropTypes.array.isRequired,
  storyCount: React.PropTypes.number.isRequired,
}
