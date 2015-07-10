import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import LoadingBar from '../ui/LoadingBar.jsx'
import PostSet from '../components/PostSet.jsx'
import React from 'react'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import StoryActions from '../actions/story_actions'
import StoryRange from './StoryRange.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import Router from '../lib/router_container'
import Emoji from '../ui/Emoji.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'


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
      <ChangelogNavbar changelog={changelog} />

      {moreAvailable ?
        <ScrollPaginator page={page} onScrollBottom={nextPage} /> : null}
      {this.renderOpenSet()}

      <div className="container">
      	{this.renderGithubRepoMessage()}
      	{this.renderEmptyState()}
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
    return <div className="mt3 p2 h4 center">
      <div className="mx-auto" style={{width: '5rem'}}>
        <div dangerouslySetInnerHTML={{__html: Emoji.parse('📜')}} />
      </div>
      <div className="gray h4 mt1">
        No posts yet
      </div>
    </div>
  }

  renderGithubRepoMessage() {
    const { totalStoriesCount, changelogId, changelog, loading } = this.props

    if (totalStoriesCount > 2 || !changelog.user_is_team_member || loading) { return }

    return <div className="mt3 p2 bg-smoke h4 flex flex-center">
      <div className="flex-auto">You can pull in draft posts from your GitHub repos.<br /><span className="h5 gray">We won't don't save your data and promise not to peek at your code.</span></div>
      <div className="flex-none">
        <a href={`${API_URL}/auth/github?origin=${window.location.origin}${Router.get().makeHref('githubRepos', {changelogId})}`}><Button>Connect GitHub</Button></a>
      </div>
    </div>
  }
}
