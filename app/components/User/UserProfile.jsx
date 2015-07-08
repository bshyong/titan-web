import {List} from 'immutable'
import Badge from '../Badge.jsx'
import ClickablePaginator from '../../ui/ClickablePaginator.jsx'
import connectToStores from '../../lib/connectToStores.jsx'
import Divider from '../Divider.jsx'
import Link from '../../components/Link.jsx'
import Logo from '../logo.jsx'
import paramsFor from '../../lib/paramsFor'
import pluralize from '../../lib/pluralize'
import ProfileActions from '../../actions/profile_actions.js'
import ProfileStore from '../../stores/profile_store.js'
import ProfileStories from '../../stores/profile_stories_store'
import React from 'react'
import StoryCell from '../Story/StoryCell.jsx'
import Subheader from 'ui/Subheader.jsx'
import Table from '../../ui/Table.jsx'
import UserCell from '../User/UserCell.jsx'
import SessionStore from '../../stores/session_store'

@connectToStores(ProfileStore, ProfileStories, SessionStore)
export default class ProfilePage extends React.Component {

  static getPropsFromStores() {
    // The reason these are all split out is that I imagine that they'll
    // eventually come from multiple stores so we can make the requests faster
    // and do smart things like pagination. ~@chrislloyd
    return {
      changelogs: ProfileStore.changelogs,
      currentUser: SessionStore.user,
      following: ProfileStore.following,
      stories: ProfileStories.stories,
      storyPagination: ProfileStories.pagination,
      upvotes: ProfileStore.upvotes,
      user: ProfileStore.user,
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
        <div className="full-width overflow-hidden">
          <Divider />
        </div>

        {this.renderThingyCounts(upvoteCount, this.props.user.contribution_count, this.props.following.length)}

        <div className="container">
          {this.renderSection('Public posts', this.renderStories.bind(this))}
          {this.renderSection('Following', this.renderFollowingChangelogs.bind(this))}
        </div>
      </div>
    )
  }

  renderThingyCounts() {
    const {
      user: {contribution_count, hearts_count, followings_count}
    } = this.props

    if (hearts_count === 0 && contribution_count === 0 && followings_count === 0) {
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
          Earned <strong>{pluralize(hearts_count, 'upvote', 'upvotes')}</strong>,
          contributed to <strong>{pluralize(contribution_count, 'post', 'posts')}</strong>,
          and followed <strong>{pluralize(followings_count, 'changelog', 'changelogs')}</strong>.
        </p>
      </div>
    )
  }

  renderSection(title, body) {
    return (
      <div className="mb4">
        <Subheader text={title} />
        {body()}
      </div>
    )
  }

  renderBlankState(emoji, publicMessage, ownerMessage) {
    const { user, currentUser } = this.props
    return (
      <div className="py3 gray">
        <img src={`https://twemoji.maxcdn.com/svg/${emoji}.svg`} className="block left mr1" style={{width: '1.5rem'}} />
        { currentUser && (user.id === currentUser.id) ? (ownerMessage || publicMessage) : publicMessage}
      </div>
    )
  }

  renderUpvotes() {
    const { user: {hearts_count: nUpvotes}, upvotes } = this.props
    const stickerSheet = List(upvotes).sortBy(s => -s.count)

    return (
      <div className="overflow-hidden">
        <div className="flex flex-wrap mxn2">
          {stickerSheet.map(s => {
            const {emoji, count} = s
            return (
              <div className="p3 center" key={emoji.id}>
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
    const { stories, storyPagination, user: {contribution_count} } = this.props
    if (contribution_count === 0) {
      return this.renderBlankState(
        '1f4dc',
        "No public posts",
        "Contribute by posting to a changelog."
      )
    }

    return (
      <div>
        {this.renderUpvotes()}
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
                    <StoryCell story={story} changelog={story.changelog} />
                  </Table.Cell>
                ))
            }
          </Table>
        </ClickablePaginator>
      </div>
    )
  }

  renderFollowingChangelogs() {
    const { following: changelogs, user: {followings_count} } = this.props

    if (followings_count === 0) {
      return this.renderBlankState(
        '1f60e',
        "Not following any changelogs",
        "Follow changelogs that you work on and find interesting."
      )
    }

    return (
      <div className="flex flex-wrap p1 py2">
        {changelogs.map(changelog =>
          <div className="ml1 mb1" key={changelog.id}>
            <Link to="changelog" params={paramsFor.changelog(changelog)}>
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
