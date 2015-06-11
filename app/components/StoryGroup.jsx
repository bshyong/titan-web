import { Link } from 'react-router'
import { List } from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
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
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    group: React.PropTypes.object.isRequired,
    stories: React.PropTypes.object.isRequired,
    truncatable: React.PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.per = 5
    this.state = {
      page: 1,
      hasMore: this.hasMoreStories()
    }
  }

  render() {
    const { changelogId, group, stories } = this.props
    return (
      <div key={group.key}>
        <div className="border-bottom flex flex-center">
          <div className="flex-auto py2">
            {group.title ? group.title : <span className="gray">Fresh group</span>}
          </div>
          {this.renderActions()}
        </div>

        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={this.hasMoreStories()}>
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

  renderActions() {
    return null // TODO hook up buttons

    return (
      <div className="flex-none flex mxn1">
        <div className="px1">
          <Button size="small" color="orange" style="transparent" action={function() {}}>Edit</Button>
        </div>
        <div className="px1">
          <Button size="small" bg="gray" action={this.handleCloseGroup.bind(this)}>Publish </Button>
        </div>
      </div>
    )
  }

  handleCloseGroup() {
    GroupActions.done(this.props.group.key)
    // if (confirm("Are you sure you want to close this group?")) {
    // }
  }

  handleShowMore() {
    const { changelogId, group } = this.props
    StoryActions.fetchForSpecificGroup(changelogId, group.key, this.state.page + 1, this.per)
    this.setState({
      page: this.state.page + 1
    })
  }

  hasMoreStories() {
    const { group, stories, truncatable } = this.props
    if (stories.isEmpty()) {
      return false
    }

    return truncatable && (stories.size < group.count)
  }
}
