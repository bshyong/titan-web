import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from './ui/avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import ChangelogActions from '../actions/changelog_actions'
import Emoji from './ui/emoji.jsx'
import Icon from './ui/icon.js.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import moment from '../config/moment'
import React from 'react'
import ScrollPaginator from './ui/scroll_paginator.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from './ui/stack.jsx'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import Table from './ui/table.js.jsx'
import TimePicker from './ui/time_picker.jsx'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ChangelogStore, StoryStore)
export default class Changelog extends React.Component {

  static getPropsFromStores(props) {
    return {
      loading: StoryStore.loading,
      moreAvailable: StoryStore.moreAvailable,
      page: StoryStore.page,
      stories: StoryStore.all(),
      timeLength: ChangelogStore.timeLength,
      timeShown: ChangelogStore.timeShown,
    }
  }

  render() {
    const { changelogId, page, moreAvailable, loading } = this.props

    return <div className="container mt2">
      {moreAvailable ?
        <ScrollPaginator page={page}
          onScrollBottom={() => StoryActions.fetchAll(changelogId, page + 1)} /> : null}

      <TimePicker />
      {this.renderTable()}
      <LoadingBar loading={loading} />
    </div>
  }

  parseCalendarDate(key) {
    const { timeLength } = this.props

    if (timeLength === "day") {
      return key.calendar()
    }

    if (timeLength === "week") {
      var start_date = moment(key)
      var end_date = moment(key).add(1, 'weeks')
      return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
    }

    if (timeLength === "month") {
      var start_date = moment(key)
      var end_date = moment(key).add(1, 'months')
      return start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
    }
  }

  sortStories() {
    const { timeLength } = this.props
    var stories = this.props.stories
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf(timeLength))

    if (timeLength != "day") {
      stories = stories.mapEntries((k,v) => {
        return [
          k[0],
          k[1].sortBy(story => story.hearts_count).reverse()
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
    const { timeShown, timeLength } = this.props
    if (timeShown) {
      if (timeShown.format() !== "day" && (key.format() !== timeShown.format()))
        {value = value.slice(0,5)}
    } else {
      if (timeLength !== "day") {
        value = value.slice(0,5)
      }
    }
    return value
  }

  renderTable() {
    const { changelogId, timeShown, timeLength } = this.props
    const groupedStories = this.sortStories()
    const a = groupedStories.reduce((reduction, stories, date, iter) => {
      let a = reduction.push(
        <Table.Separator label={this.parseCalendarDate(date)} key={date.toISOString()} />
      )
      var showButton = stories.count() > 5 && timeLength !== "day"

      stories = this.storyValuesLogic(date, stories)

      // stories
      let b = a.push(

      )

      return <StoryRange date={date} stories={stories.sortBy(story => -story.hearts_count)} storyCount={stories.count()} />

    }, List())

    return a
  }

}
