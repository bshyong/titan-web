import { RouteHandler } from 'react-router'
import {List, Set} from 'immutable'

import Avatar from '../ui/Avatar.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import paramsFor from '../lib/paramsFor'
import dateString from '../lib/dateStringForTimeInterval'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import Icon from '../ui/Icon.jsx'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import PostSet from '../components/PostSet.jsx'
import React from 'react'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SegmentedControl from '../ui/SegmentedControl.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryRange from './StoryRange.jsx'
import Table from '../ui/Table.jsx'

@connectToStores(ChangelogStore, GroupedStoriesStore)
export default class Changelog extends React.Component {
  static propTypes = {
    groupBy: React.PropTypes.string
  }

  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
      loading: GroupedStoriesStore.loading,
      moreAvailable: GroupedStoriesStore.moreAvailable,
      page: GroupedStoriesStore.page,
      groupedStories: GroupedStoriesStore.grouped,
    }
  }

  render() {
    const { changelogId, page, moreAvailable, loading } = this.props

    if (!this.props.changelog) {
      return <div />
    }

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
                <SegmentedControl.Link to="changelog" params={paramsFor.changelog(ChangelogStore.changelog)}>
                  Posts
                </SegmentedControl.Link>
                <SegmentedControl.Link to="changelog_by_sets" params={paramsFor.changelog(ChangelogStore.changelog)}>
                  Sets
                </SegmentedControl.Link>
              </SegmentedControl>
            </div>
            <div className="flex-auto" />
          </div>
        </div>
      </div>
      {this.renderOpenSet()}
      <div className="container">
        {this.renderStories()}
        <LoadingBar loading={loading} />
      </div>
    </div>
  }

  renderOpenSet() {
    const { changelogId, changelog, groupBy } = this.props
    let { groupedStories } = this.props

    groupedStories = groupedStories.filterNot(g => g.group.done_at)

    if (groupBy === 'calendar' || groupedStories.isEmpty()) { return }

    return (
      <div style={{background: changelog.user_is_team_member ? '#FAF9F7' : null}}>
        <div className="container p1 mb4">
          {groupedStories.filterNot(g => g.group.done_at).map(g =>
            <PostSet
              editable={changelog.user_is_team_member}
              key={g.group.key}
              group={g.group}
              stories={g.stories.toList()}
              changelogId={changelogId}
              truncatable={true} />
          )}
        </div>
      </div>
    )
  }

  renderStories() {
    const { changelogId, changelog, groupedStories } = this.props

    if (!groupedStories) {
      return
    }

    if (this.props.groupBy === 'calendar') {
      return groupedStories.map(g =>
        <StoryRange
          key={g.group.key}
          group={g.group}
          changelogId={changelogId}
          stories={g.stories.toList()}
          truncatable={true} />
      )
    }

    return groupedStories.filter(g => g.group.done_at).map(g =>
      <PostSet
        editable={changelog.user_is_team_member}
        key={g.group.key}
        group={g.group}
        stories={g.stories.toList()}
        changelogId={changelogId}
        truncatable={true} />
    )
  }
}
