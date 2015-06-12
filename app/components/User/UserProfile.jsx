import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'
import Badge from '../Badge.jsx'
import Button from '../../ui/Button.jsx'
import ClickablePaginator from '../../ui/ClickablePaginator.jsx'
import connectToStores from '../../lib/connectToStores.jsx'
import Divider from '../Divider.jsx'
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

        <Divider />

        {this.renderThingyCounts(upvoteCount, this.props.user.contribution_count, this.props.following.length)}

        <div className="container">
          {this.renderSection('Upvotes earned', upvoteCount, this.renderUpvotes)}
          {this.renderSection('Public posts', this.props.user.contribution_count, this.renderStories)}
          {this.renderSection('Following', this.props.following.length, this.renderFollowingChangelogs)}
        </div>
      </div>
    )
  }

  renderThingyCounts(upvotes, posts, changelogs) {
    if (upvotes === 0 && posts === 0 && changelogs === 0) {
      return (
        <div className="px2 md-px0 py4 gray">
          <p className="h2 mt0 mb0 center">
            “Genius is 1% inspiration, 99% perspiration.”
          </p>
          <p className="mt0 mb0 center">— Thomas Edison</p>
        </div>
      )
    }

    return (
      <div className="px2 md-px0 py4">
        <p className="h3 mt0 mb0 center">
          Earned <strong>{pluralize(upvotes, 'upvote', 'upvotes')}</strong>,
          contributed to <strong>{pluralize(posts, 'post', 'posts')}</strong>,
          and following <strong>{pluralize(changelogs, 'changelog', 'changelogs')}</strong>.
        </p>
      </div>
    )
  }

  renderSection(title, count, body) {
    return (
      <div className="mb4">
        <h4 className="px2 md-px0 py1 caps gray h5 mt0 mb0 border-bottom">{title}</h4>
        {body.bind(this)(count)}
      </div>
    )
  }

  renderBlankState(emoji, message) {
    return (
      <div className="py3 gray">
        <img src={`https://twemoji.maxcdn.com/svg/${emoji}.svg`} className="block left mr1" style={{width: '1.5rem'}} />
        {message}
      </div>
    )
  }

  renderUpvotes(nUpvotes) {
    const { upvotes } = this.props
    const stickerSheet = List(upvotes).sortBy(s => -s.count)

    if (nUpvotes === 0) {
      return this.renderBlankState(
        '1f496',
        "Earn upvotes on your posts and get that warm, fuzzy feeling."
      )
    }

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
    if (stories.size==0) {
      return this.renderBlankState(
        '1f4dc',
        "Contribute by posting to a changelog."
      )
    }

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

  renderFollowingChangelogs(nFollowing) {
    const { following: changelogs } = this.props

    if (nFollowing === 0) {
      return this.renderBlankState(
        '1f60e',
        "Follow changelogs that you work on and find interesting."
      )
    }

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
