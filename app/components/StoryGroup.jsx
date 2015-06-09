import Avatar from '../ui/Avatar.jsx'
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
import GroupsStore from '../stores/groups_store'

export default class StoryGroup extends React.Component {

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
      hasMore: this.props.truncatable && (stories.size < stories.filter(s => s.group_total != null).minBy(story => story.group_total).group_total)
    })
  }

  render() {
    const { stories, changelogId, groupId } = this.props
    const group = GroupsStore.get(groupId)
    if (!group) { return null }
    return (
      <div key={groupId}>
        <div to="changelog_date" params={{changelogId: changelogId}} className="black">
          <Table.Separator label={group.title} />
        </div>
        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={this.state.hasMore}>
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
    const { changelogId, groupId } = this.props
    StoryActions.fetchForSpecificGroup(changelogId, groupId, this.state.page + 1, this.per)
    this.setState({
      page: this.state.page + 1
    })
  }

  hasMoreStories() {
    const { stories, truncatable } = this.props
    if (stories.size) {
      return truncatable && (stories.size < stories.filter(s => s.group_total != null).minBy(story => story.group_total).group_total)
    } else {
      return false
    }
  }
}

StoryGroup.propTypes = {
  changelogId: React.PropTypes.string.isRequired,
  groupId: React.PropTypes.string.isRequired,
  stories: React.PropTypes.object.isRequired,
  truncatable: React.PropTypes.bool.isRequired
}

StoryGroup.defaultProps = {
  truncatable: false,
}
