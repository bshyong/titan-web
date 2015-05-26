import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ChangelogActions from '../actions/changelog_actions'
import Emoji from '../ui/Emoji.jsx'
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
import Table from '../ui/table.jsx'
import TimePicker from './time_picker.jsx'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ChangelogStore, StoryStore)
export default class Changelog extends React.Component {

  static getPropsFromStores(props) {
    return {
      loading: StoryStore.loading,
      moreAvailable: StoryStore.moreAvailable,
      page: StoryStore.page,
      stories: StoryStore.all(),
      timeInterval: ChangelogStore.timeInterval,
      timeShown: ChangelogStore.timeShown,
    }
  }

  render() {
    const { changelogId, page, moreAvailable, loading } = this.props

    return <div>
      {moreAvailable ?
        <ScrollPaginator page={page}
          onScrollBottom={() => StoryActions.fetchAll(changelogId, page + 1)} /> : null}

      <div className="bg-smoke">
        <div className="container">
          <div className="sm-flex">
            <div className="flex-auto" />
            <div className="flex-none">
              <TimePicker />
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
    const { timeInterval } = this.props
    if (timeInterval === "day") {
      return key.calendar()
    }
    var start_date = moment(key)
    if (timeInterval === "week") {
      var end_date = moment(key).add(1, 'weeks')
    }
    if (timeInterval === "month") {
      var end_date = moment(key).add(1, 'months')
    }
    return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
  }

  sortStories() {
    const { timeInterval } = this.props
    let stories = this.props.stories
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf(timeInterval))

    if (timeInterval != "day") {
      stories = stories.mapEntries((k,v) => {
        return [
          k[0],
          k[1].sortBy(story => -story.hearts_count)
        ]
      })
    }
    return stories
  }

  expandDate(d) {
    return function(e) {
      ChangelogActions.changeTimeShown(d)
    }
  }

  renderShowAll(date) {
    const { timeShown } = this.props
    let newDate = date
    let buttonText = "Show All"
    if (timeShown) {
      if (date.format() === timeShown.format()) {
        newDate = null
        buttonText = "Hide"
      }
    }

    return (
      <a className="block py2 h5 pointer" onClick={this.expandDate(newDate)}>
        {buttonText}
      </a>
    )
  }

  storyValuesLogic(key, value) {
    const { timeShown, timeInterval } = this.props
    if (timeShown) {
      if (timeShown.format() !== "day" && (key.format() !== timeShown.format()))
        {value = value.slice(0,5)}
    } else {
      if (timeInterval !== "day") {
        value = value.slice(0,5)
      }
    }
    return value
  }

  renderTable() {
    const { changelogId, timeShown, timeInterval } = this.props
    const groupedStories = this.sortStories()
    return groupedStories.map((stories, date) => {
      return (
        <div key={date.toISOString()}>
          <Table.Separator label={this.parseCalendarDate(date)} />
          <StoryRange date={date}
              stories={stories.sortBy(story => -story.hearts_count)}
              storyCount={stories.count()}
              timeInterval={timeInterval} />
        </div>
      )
    }).toList()
  }
}
