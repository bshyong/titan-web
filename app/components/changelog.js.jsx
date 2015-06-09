import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ChangelogActions from '../actions/changelog_actions'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import React from 'react'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryRange from './StoryRange.jsx'
import StoryStore from '../stores/story_store'
import Table from '../ui/Table.jsx'
import ViewPicker from './view_picker.jsx'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ChangelogStore, StoryStore)
export default class Changelog extends React.Component {

  static getPropsFromStores(props) {
    return {
      loading: StoryStore.loading,
      moreAvailable: StoryStore.moreAvailable,
      page: StoryStore.page,
      stories: StoryStore.all(),
      selectedView: ChangelogStore.selectedView
    }
  }

  render() {
    const { changelogId, page, moreAvailable, loading } = this.props

    return <div>
      {moreAvailable ?
        <ScrollPaginator page={page}
          onScrollBottom={() => StoryActions.fetchAll(changelogId, this.props.selectedView, page + 1, 25)} /> : null}

      <div className="bg-smoke">
        <div className="container">
          <div className="sm-flex">
            <div className="flex-auto" />
            <div className="flex-none">
              <ViewPicker />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {this.renderTable()}
        <LoadingBar loading={loading} />
      </div>
    </div>
  }

  parseCalendarDate(key) {
    const { selectedView } = this.props

    if (selectedView === "month") {
      return moment(key).format('MMMM YYYY')
    }

    if (selectedView === "day") {
      return key.calendar()
    }
    var start_date = moment(key)
    if (selectedView === "week") {
      var end_date = moment(key).add(1, 'weeks')
    }
    return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
  }

  sortStories() {
    const { selectedView } = this.props
    let stories = this.props.stories
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf(selectedView))

    return stories
  }

  renderTable() {
    const { changelogId, selectedView } = this.props
    const groupedStories = this.sortStories()
    return groupedStories.map((stories, date) => {
      let formatted_date = date.format('MM-DD-YYYY')
      return (
        <div key={date.toISOString()}>
          <Link to="changelog_date" params={{changelogId: changelogId, date: formatted_date, timeInterval: selectedView}} className="black">
            <Table.Separator label={this.parseCalendarDate(date)} />
          </Link>
          <StoryRange date={date}
              changelogId={changelogId}
              stories={stories.sortBy(story => -story.hearts_count)}
              storyCount={stories.count()}
              selectedView={selectedView}
              truncatable={true} />
        </div>
      )
    }).toList()
  }
}
