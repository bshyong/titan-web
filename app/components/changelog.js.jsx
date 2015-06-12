import { RouteHandler, Link } from 'react-router'
import {List, Set} from 'immutable'

import Avatar from '../ui/Avatar.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import dateString from '../lib/dateStringForTimeInterval'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import React from 'react'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SegmentedControl from '../ui/SegmentedControl.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryGroup from '../components/StoryGroup.jsx'
import StoryRange from './StoryRange.jsx'
import Table from '../ui/Table.jsx'

@connectToStores(ChangelogStore, GroupedStoriesStore)
export default class Changelog extends React.Component {
  static propTypes = {
    groupBy: React.PropTypes.string
  }

  static getPropsFromStores(props) {
    return {
      loading: GroupedStoriesStore.loading,
      moreAvailable: GroupedStoriesStore.moreAvailable,
      page: GroupedStoriesStore.page,
      groupedStories: GroupedStoriesStore.grouped,
    }
  }

  render() {
    const { changelogId, page, moreAvailable, loading } = this.props

    let nextPage = () =>
      StoryActions.fetchAll(changelogId, {
        group_by: this.props.groupBy
      }, page + 1, 25)

    return <div>
      {moreAvailable ?
        <ScrollPaginator page={page} onScrollBottom={nextPage} /> : null}

      <div className="bg-smoke">
        <div className="container">
          <div className="sm-flex">
            <div className="flex-auto" />
            <div className="flex-none">
              <SegmentedControl>
                <SegmentedControl.Link to="changelog" params={{changelogId: ChangelogStore.slug}}>
                  Stream
                </SegmentedControl.Link>
                <SegmentedControl.Link to="changelog_by_time" params={{changelogId: ChangelogStore.slug}}>
                  Date
                </SegmentedControl.Link>
              </SegmentedControl>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {this.renderStories()}
        <LoadingBar loading={loading} />
      </div>
    </div>
  }

  renderStories() {
    const { changelogId, groupedStories } = this.props

    if (!groupedStories) {
      return
    }

    if (this.props.groupBy == 'calendar') {
      return groupedStories.map(g =>
        <StoryRange
            key={g.group.key}
            group={g.group}
            changelogId={changelogId}
            stories={g.stories.toList()}
            truncatable={true} />
      )
    }

    return groupedStories.map(g =>
      <StoryGroup
        key={g.group.key}
        group={g.group}
        stories={g.stories.toList()}
        changelogId={changelogId}
        truncatable={true} />
    )
  }
}
