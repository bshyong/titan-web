import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'
import Badge from '../Badge.jsx'
import Button from '../../ui/Button.jsx'
import connectToStores from '../../lib/connectToStores.jsx'
import Logo from '../logo.jsx'
import paramsFor from '../../lib/paramsFor'
import pluralize from '../../lib/pluralize'
import ProfileActions from '../../actions/profile_actions.js'
import ProfileStore from '../../stores/profile_store.js'
import ProfileStories from '../../stores/profile_stories_store'
import React from 'react'
import StoryCell from '../Story/StoryCell.jsx'
import Table from '../../ui/Table.jsx'
import UserCell from '../User/UserCell.jsx'
import ClickablePaginator from '../../ui/ClickablePaginator.jsx'

@connectToStores(ProfileStore, ProfileStories)
export default class ProfilePage extends React.Component {

  static getPropsFromStores() {
    // The reason these are all split out is that I imagine that they'll
    // eventually come from multiple stores so we can make the requests faster
    // and do smart things like pagination. ~@chrislloyd
    return {
      user: ProfileStore.user,
      upvotes: ProfileStore.upvotes,
      stories: ProfileStories.stories,
      storyPagination: ProfileStories.pagination,
      changelogs: ProfileStore.changelogs,
      following: ProfileStore.following,
    }
  }

  render() {
    const { user } = this.props

    if (!user) {
      return <div />
    }

    const upvoteCount = List(this.props.upvotes).reduce((reduction, value) => {
      return reduction + value.count
    }, 0)

    return (
      <div>
        <UserCell user={user} />

        <hr className="mt0 mb0 border-silver" />

        <div className="container">
          <div className="px2 md-px0 py4">
            <p className="h3 mt0 mb0 center">
              Earned <strong>{pluralize(upvoteCount, 'upvote', 'upvotes')}</strong>,
              contributed to <strong>{pluralize(this.props.user.contribution_count, 'post', 'posts')}</strong>,
              and following <strong>{pluralize(this.props.following.length, 'changelog', 'changelogs')}</strong>.
            </p>
          </div>
          {this.renderSection('Upvotes earned', this.renderUpvotes)}
          {this.renderSection('Recent posts', this.renderStories)}
          {this.renderSection('Following', this.renderFollowingChangelogs)}
        </div>
      </div>
    )
  }

  renderSection(title, body) {
    return (
      <div className="mb4">
        <h4 className="px2 md-px0 py1 caps gray h5 mt0 mb0 border-bottom">{title}</h4>
        {body.bind(this)()}
      </div>
    )
  }

  renderUpvotes() {
    const { upvotes } = this.props
    const stickerSheet = List(upvotes).sortBy(s => -s.count)

    return (
      <div className="">
        <div className="flex flex-wrap">
          {stickerSheet.map(s => {
            const {emoji, count} = s
            return (
              <div className="p2 center" key={emoji.id}>
                <div className="mb1">
                  <Badge badge={emoji} size="2rem" />
                </div>
                <div className="h5">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  renderStories() {
    const { stories, storyPagination } = this.props

    return (
      <ClickablePaginator
        hasMore={storyPagination.moreAvailable}
        onLoadMore={this.handleLoadMoreStories.bind(this)}>
        <Table>
          {
            List(stories)
              .sortBy(story => story.created_at)
              .reverse()
              .map(story => (
                <Table.Cell key={story.id} to="story" params={paramsFor.story(story.changelog, story)}>
                  <div className="flex">
                    <div className="flex-none">
                      <Badge badge={story.emoji} size="1.5rem" />
                    </div>
                    <div className="flex-auto px2">
                      {story.title}
                    </div>
                    <div className="flex-none gray h5">
                      {story.changelog.name}
                    </div>
                  </div>

                </Table.Cell>
              ))
          }
        </Table>
      </ClickablePaginator>
    )
  }

  renderChangelogs() {
    return (
      <div className="sm-flex p2">
        <div className="half-width px2 md-px0">
          <h5 className="mt1 mb2 gray">Working on</h5>
          {this.renderWorkingOnChangelogs()}
        </div>

        <div className="half-width px2 md-px0">
          <h5 className="mt1 mb2 gray">Following</h5>
          {this.renderFollowingChangelogs()}
        </div>
      </div>
    )
  }

  renderFollowingChangelogs() {
    const { following: changelogs } = this.props
    return (
      <div className="flex flex-wrap p1 py2">
        {changelogs.map(changelog =>
          <div className="ml1 mb1" key={changelog.id}>
            <Link to="changelog" params={{changelogId: changelog.slug}}>
              <Logo changelog={changelog} size="2rem" />
            </Link>
          </div>
        )}
      </div>
    )
  }

  handleLoadMoreStories() {
    const { user, storyPagination } = this.props
    ProfileActions.fetchStories(user.username, storyPagination.page + 1)
  }

}
