import ClickablePaginator from 'ui/ClickablePaginator.jsx'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import {fetchForSpecificGroup} from 'actions/storyActions'
import StoryCell from './Story/StoryCell.jsx'
import Table from 'ui/Table.jsx'
import UpvoteToggler from './UpvoteToggler.jsx'
import {connect} from 'redux/react'

@connect(() => ({}))
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
      hasMore: this.hasMoreStories(),
      page: 0,
      title: this.props.group.title,
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
          {this.renderTitle()}
        </div>
      </div>
    )
  }

  renderTitle() {
    const { title } = this.state
    return (
      <div className="py2 flex flex-center">
        <div className="flex-none">
          {title}
        </div>
      </div>
    )
  }

  handleShowMore() {
    const { changelogId, group } = this.props
    this.props.dispatch(fetchForSpecificGroup(changelogId, group.key, this.state.page + 1, this.per))
    this.setState({
      page: this.state.page + 1,
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
