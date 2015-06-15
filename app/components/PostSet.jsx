import { Link } from 'react-router'
import { List } from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ClickablePaginator from '../ui/ClickablePaginator.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import PostSetActions from '../actions/PostSetActions'
import React from 'react'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'

export default class PostSet extends React.Component {
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    editable: React.PropTypes.bool,
    group: React.PropTypes.object.isRequired,
    stories: React.PropTypes.object.isRequired,
    truncatable: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.per = 50
    this.state = {
      editing: false,
      hasMore: this.hasMoreStories(),
      page: 0,
      title: this.props.group.title,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      let input = React.findDOMNode(this.refs.text)
      input.value = this.state.title
      input.focus()
    }
  }

  render() {
    const { changelogId, group } = this.props
    let { stories } = this.props
    if (group.done_at) {
      stories = stories.sortBy(s => -s.hearts_count)
    }

    return (
      <div key={group.key} className="mb4">
        {this.renderHeader()}

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

  renderHeader() {
    return (
      <div className="border-bottom flex flex-center">
        <div className="flex-auto">
          {this.state.editing ? this.renderEditForm() : this.renderTitle() }
        </div>
        {this.renderFinalizeButton()}
      </div>
    )
  }

  renderFinalizeButton() {
    if (this.props.editable && !this.props.group.done_at) {
      return <div className="flex-none mr1">
        <a className="gray h5 orange-hover pointer" onClick={this.handleCloseGroup.bind(this)}>
          Close set
        </a>
      </div>
    }
  }

  renderTitle() {
    const { title } = this.state
    return (
      <div className="py2 flex flex-center">
        <div className="flex-none">
          {title ? title : "Latest Set"}
        </div>
        <div className="flex-none">
          {this.renderEditButton()}
        </div>
      </div>
    )
  }

  renderEditButton() {
    if (this.props.editable) {
      return <div className="px2">
        <a className="gray h5 orange-hover pointer" onClick={this.handleShowEditing.bind(this)}>
          Edit
        </a>
      </div>
    }
  }

  renderEditForm() {
    return (
      <form onSubmit={this.handleTitleSave.bind(this)}>
        <div className="py1 flex flex-center">
          <div className="mr1">
            <input type="text"
              className="field-light full-width"
              placeholder="Latest"
              ref="text" />
          </div>
          <div>
            <Button size="small" color="orange" style="transparent">
              Save
            </Button>
          </div>
        </div>
      </form>
    )
  }

  handleShowEditing() {
    this.setState({editing: true})
  }

  handleTitleSave(e) {
    e.preventDefault()
    let newTitle = React.findDOMNode(this.refs.text).value
    this.setState({
      editing: false,
      title: newTitle
    })
    PostSetActions.updateTitle(this.props.group.key, newTitle)
  }

  handleCloseGroup() {
    PostSetActions.finalize(this.props.group.key)
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
