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
  static propTypes = {
    group: React.PropTypes.object.isRequired,
    changelogId: React.PropTypes.string.isRequired,
    stories: React.PropTypes.object.isRequired,
    truncatable: React.PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.per = 50
    this.state = {
      page: 0,
      truncatable: props.truncatable
    }
  }

  render() {
    const { group, changelogId } = this.props
    let { stories } = this.props
    let title = group.title
    let date = moment(group.title)
    if (date.isValid()) {
      let format = 'MMM'
      if (date.year() != moment().year()) {
        format = 'MMM YYYY'
      }
      title = date.format(format)
    }

    if (group.title !== 'Today') {
      stories = stories.sortBy(s => -s.hearts_count)
    }

    return (
      <div>
        <div className="border-bottom flex flex-center">
          <div className="flex-auto py2">
            {title}
          </div>
        </div>

        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={this.hasMoreStories()}>
            {stories.map(story => (
              <Table.Cell key={story.id} image={<UpvoteToggler story={story} hearted={story.viewer_has_hearted} />} to="story" params={paramsFor.story({slug: changelogId}, story)}>
                <StoryCell story={story} />
              </Table.Cell>
            ))}
          </ClickablePaginator>
        </Table>
      </div>
    )
  }

  handleShowMore() {
    const { changelogId, group } = this.props
    StoryActions.fetchSpecificDate(changelogId, group.key, this.state.page + 1, this.per)
    this.setState({
      page: this.state.page + 1
    })
  }

  hasMoreStories() {
    const { stories, truncatable } = this.props
    if (stories.size) {
      return truncatable && (stories.size < stories.minBy(story => story.group_total).group_total)
    } else {
      return false
    }
  }
}
