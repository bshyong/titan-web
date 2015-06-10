import { Link } from 'react-router'
import { List } from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import GroupsStore from '../stores/groups_store'
import Button from '../ui/Button.jsx'
import GroupActions from '../actions/GroupActions'
import Icon from '../ui/Icon.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'

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
        <div className="border-bottom flex flex-center">
          <div className="flex-auto py2">
            {group.title ? group.title : <span className="gray">Fresh group</span>}
          </div>
          <div className="flex-none flex mxn1">
            <div className="px1">
              <Button size="small" color="orange" style="transparent" action={function() {}}>Edit</Button>
            </div>
            <div className="px1">
              <Button size="small" bg="gray" action={this.handleCloseGroup.bind(this)}>Publish </Button>
            </div>
          </div>
        </div>

        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={this.state.hasMore}>
            {stories.map(story => (
              <Table.Cell key={story.id} to="story" params={paramsFor.story({slug: changelogId}, story)}>
                <StoryCell story={story} />
              </Table.Cell>
            ))}
          </ClickablePaginator>
        </Table>
      </div>
    )
  }

  handleCloseGroup() {
    GroupActions.done(this.props.groupId)
    // if (confirm("Are you sure you want to close this group?")) {
    // }
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
    if (stories.isEmpty()) {
      return false
    }

    return truncatable && (stories.size < stories.filter(s => s.group_total != null).minBy(story => story.group_total).group_total)
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
  stories: List([]),
}
