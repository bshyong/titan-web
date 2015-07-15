import Button from '../ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import ChangelogStore from '../stores/changelog_store'
import Emoji from '../ui/Emoji.jsx'
import EmptyStateGuide from '../components/EmptyStateGuide.jsx'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import LoadingBar from '../ui/LoadingBar.jsx'
import PinnedPosts from '../components/PinnedPosts.jsx'
import PinnedPostsStore from '../stores/PinnedPostsStore'
import PostSet from '../components/PostSet.jsx'
import React from 'react'
import Router from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import StoryActions from '../actions/story_actions'
import StoryRange from './StoryRange.jsx'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(ChangelogStore, GroupedStoriesStore, PinnedPostsStore)
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
      pinnedPosts: PinnedPostsStore.all,
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
      <ChangelogNavbar changelog={changelog} />

      {moreAvailable ?
        <ScrollPaginator page={page} onScrollBottom={nextPage} /> : null}
      {this.renderOpenSet()}

      <div className="container">
      	{this.renderEmptyState()}
      	{this.renderGithubRepoMessage()}
        {this.renderPinnedPosts()}
        {this.renderStories()}
        <LoadingBar loading={loading} />
      </div>
    </div>
  }

  renderPinnedPosts() {
    const { pinnedPosts, changelog } = this.props
    return <PinnedPosts posts={pinnedPosts} changelog={changelog} />
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

  renderEmptyState() {
    const { totalStoriesCount, loading } = this.props

    if (totalStoriesCount > 0 || loading) { return }
    return <EmptyStateGuide />
  }

  renderGithubRepoMessage() {
    const { totalStoriesCount, changelogId, changelog, loading } = this.props

    if (totalStoriesCount > 0 || !changelog.user_is_team_member || loading) { return }

    return <div className="mt3 mb3 p2 bg-smoke h4 sm-flex flex-center flex-wrap">
      <div className="flex-auto">You can pull in draft posts from your GitHub repos.<br /><span className="h5 gray">We dont't save your data and promise not to peek at your code.</span></div>
      <div className="flex-none py2">
        <a href={`${API_URL}/auth/github?origin=${window.location.origin}${Router.get().makeHref('githubRepos', {changelogId})}`}><Button block={true}>Connect GitHub</Button></a>
      </div>
    </div>
  }
}
