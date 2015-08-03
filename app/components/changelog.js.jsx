import {connect} from 'redux/react'
import Button from 'ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import EmptyStateGuide from 'components/EmptyStateGuide.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import PinnedPosts from 'components/PinnedPosts.jsx'
import PostSet from 'components/PostSet.jsx'
import React from 'react'
import Router from 'lib/router_container'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import {fetchAll} from 'actions/storyActions'
import StoryRange from 'components/StoryRange.jsx'

function countStories(grouped) {
  return grouped.reduce((r, g) => r + g.stories.size, 0)
}

@connect(state => ({
  changelog: state.currentChangelog.changelog,
  groupedStories: state.groupedStories.grouped,
  loading: state.groupedStories.loading,
  moreAvailable: state.groupedStories.moreAvailable,
  page: state.groupedStories.page,
  pinnedPosts: state.pinnedPosts.stories,
  totalStoriesCount: countStories(state.groupedStories.grouped),
}))
export default class Changelog extends React.Component {
  static propTypes = {
    groupBy: React.PropTypes.string,
  }

  render() {
    const { changelogId, changelog, page, moreAvailable, loading } = this.props

    if (!changelog || !changelogId) {
      return <div />
    }

    const nextPage = () =>
      this.props.dispatch(fetchAll(changelogId, {
        group_by: this.props.groupBy,
      }, page + 1, 25))

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

    if (groupBy === 'calendar' || groupedStories.isEmpty()) { return null }

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
      return null
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

    if (totalStoriesCount > 0 || loading) { return null }
    return <EmptyStateGuide />
  }

  renderGithubRepoMessage() {
    const { totalStoriesCount, changelogId, changelog, loading } = this.props

    if (totalStoriesCount > 0 || !changelog.user_is_team_member || loading) { return null }

    return <div className="mt3 mb3 p2 bg-smoke h4 sm-flex flex-center flex-wrap">
      <div className="flex-auto">You can pull in draft posts from your GitHub repos.<br /><span className="h5 gray">We don't save your data and promise not to peek at your code.</span></div>
      <div className="flex-none py2">
        <a href={`${API_URL}/auth/github?origin=${window.location.origin}${Router.get().makeHref('githubRepos', {changelogId})}`}><Button block={true}>Connect GitHub</Button></a>
      </div>
    </div>
  }
}
