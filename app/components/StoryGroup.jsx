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
    this.per = 50
    this.state = {
      title: this.props.group.title,
      page: 0,
      hasMore: this.hasMoreStories(),
      editing: false,
      expanded: false,
    }
  }

  render() {
    const { changelogId, group } = this.props
    const showLoadMore = this.hasMoreStories() && this.state.page !== 0
    let { stories } = this.props
    if (group.key) {
      stories = stories.sortBy(s => -s.hearts_count)
    }

    return (
      <div key={group.key}>
        <div className="flex flex-center">
          <div className="flex-auto">
            { group.done_at ?
                this.renderTitle() :
                this.renderHeader()
            }
          </div>
          <div className="px1">
            {this.renderShowAll()}
          </div>
        </div>

        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={showLoadMore}>
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

  renderShowAll() {
    const { expanded } = this.state
    const { group } = this.props

    if (group.total > 5) {
      return (
        <a className='h5 orange pointer' onClick={this.toggleShowAll.bind(this)}>
          {expanded ? 'Collapse' : 'See all'}
        </a>
      )
    }
    return (
      <div className='h5 silver'>
        See all
      </div>
    )
  }

  renderHeader() {
    return (
      <div className="border-bottom flex flex-center">
        <div className="flex-auto">
          {this.state.editing ? this.renderEditForm() : this.renderTitle() }
        </div>
        <div className="flex-none">
          <Button size="small" bg="green" action={this.handleCloseGroup.bind(this)}>
            Finalize
          </Button>
        </div>
      </div>
    )
  }

  renderTitle() {
    const { title } = this.state
    return (
      <div className="py2 flex flex-center">
        <div className="flex-auto">
          {title ? title : <span className="gray">Latest</span>}
        </div>
        <div className="px1">
          <Button size="small" color="orange" style="transparent"
                  action={this.handleShowEditing.bind(this)}>
            Edit
          </Button>
        </div>
      </div>
    )
  }

  renderEditForm() {
    return (
      <div className="py1 flex flex-center">
        <div className="mr1">
          <input type="text" className="field-light full-width" placeholder="Latest" />
        </div>
        <div>
          <Button size="small" color="orange" style="transparent"
                  action={function() {alert('foo')}}>
            Save
          </Button>
        </div>
      </div>
    )
  }

  toggleShowAll() {
    const { expanded } = this.state
    const { group } = this.props

    this.setState({
      expanded: !expanded
    }, () => {
      if (expanded) {
        this.setState({
          page: 0
        }, GroupActions.collapse(group.key))
      } else {
        this.handleShowMore()
      }
    })
  }

  handleShowEditing() {
    this.setState({editing: true})
  }

  handleTitleSave() {
    GroupActions.changeTitle(this.props.group.key, {

    })
  }

  handleCloseGroup() {
    GroupActions.done(this.props.group.key)
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

    return truncatable && (stories.size < group.total)
  }
}
