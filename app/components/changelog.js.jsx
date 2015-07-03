import { RouteHandler } from 'react-router'
import {List, Set} from 'immutable'

import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import Icon from '../ui/Icon.jsx'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import PostSet from '../components/PostSet.jsx'
import React from 'react'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SegmentedControl from '../ui/SegmentedControl.jsx'
import SigninScrim from './Authentication/SigninScrim.jsx'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryRange from './StoryRange.jsx'
import Table from '../ui/Table.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import dateString from '../lib/dateStringForTimeInterval'
import moment from '../config/moment'
import paramsFor from '../lib/paramsFor'
import shallowEqual from 'react-pure-render/shallowEqual'
import SessionStore from '../stores/session_store'
import Router from '../lib/router_container'

@connectToStores(ChangelogStore, GroupedStoriesStore)
export default class Changelog extends React.Component {
  static propTypes = {
    groupBy: React.PropTypes.string
  }

  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
      groupedStories: GroupedStoriesStore.grouped,
      loading: GroupedStoriesStore.loading,
      moreAvailable: GroupedStoriesStore.moreAvailable,
      page: GroupedStoriesStore.page,
      totalStoriesCount: GroupedStoriesStore.totalStoriesCount,
    }
  }

  render() {
    const { changelogId, changelog, page, moreAvailable, loading } = this.props

    if (!changelog || !changelogId) {
      return <div />
    }

    let nextPage = () =>
      StoryActions.fetchAll(changelogId, {
        group_by: this.props.groupBy
      }, page + 1, 25)

    return <div>
      {moreAvailable ?
        <ScrollPaginator page={page} onScrollBottom={nextPage} /> : null}
      {this.renderOpenSet()}
      <div className="container">
        {this.renderStories()}
        {this.renderGithubRepoMessage()}
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
          changelog={changelog}
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

  renderGithubRepoMessage() {
    const { totalStoriesCount, changelogId, changelog, loading } = this.props

    if (totalStoriesCount > 2 || !changelog.user_is_team_member || loading) { return }

    return <div className="mt3 p2 bg-smoke h4 flex flex-center">
      <div className="flex-auto">You can pull in drafts from Github.<br /><span className="h5 gray">We won't save your data or peek at your code.</span></div>
      <div className="flex-none">
        <a href={`${API_URL}/auth/github?origin=${window.location.origin}${Router.get().makeHref('githubRepos', {changelogId})}`}><Button>Connect with Github</Button></a>
      </div>
    </div>
  }
}
