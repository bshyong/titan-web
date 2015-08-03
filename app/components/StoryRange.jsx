import {connect} from 'redux/react'
import {fetchSpecificDate} from 'actions/storyActions'
import ClickablePaginator from 'ui/ClickablePaginator.jsx'
import moment from 'moment'
import paramsFor from 'lib/paramsFor'
import React from 'react'
import StoryCell from './Story/StoryCell.jsx'
import Subheader from 'ui/Subheader.jsx'
import Table from 'ui/Table.jsx'

@connect(() => ({}))
export default class StoryRange extends React.Component {
  static propTypes = {
    group: React.PropTypes.object.isRequired,
    changelog: React.PropTypes.shape({
      is_members_only: React.PropTypes.bool.isRequired,
    }).isRequired,
    changelogId: React.PropTypes.string.isRequired,
    stories: React.PropTypes.object.isRequired,
    truncatable: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.per = 50
    this.state = {
      page: 0,
    }
  }

  render() {
    const { group, changelogId } = this.props
    const showLoadMore = this.hasMoreStories()
    let { stories } = this.props
    let title = group.title
    const date = moment(group.title)
    if (date.isValid()) {
      let format = 'MMM'
      if (date.year() !== moment().year()) {
        format = 'MMM YYYY'
      }
      title = date.format(format)
    }

    if (group.title !== 'Today' && group.title !== 'Yesterday') {
      stories = stories.sortBy(s => -s.hearts_count)
    }

    return (
      <div className="mb3">
        <Subheader text={title} />

        <Table>
          <ClickablePaginator onLoadMore={this.handleShowMore.bind(this)} hasMore={showLoadMore}>
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

  handleShowMore() {
    const { changelogId, group } = this.props
    this.props.dispatch(fetchSpecificDate(changelogId, group.key, this.state.page + 1, this.per))
    this.setState({
      page: this.state.page + 1,
    })
  }

  hasMoreStories() {
    const { stories, truncatable, group } = this.props
    if (stories.isEmpty()) {
      return false
    }

    return truncatable && (stories.size < group.total)
  }
}
