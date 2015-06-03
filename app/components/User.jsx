import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'
import Badge from './Badge.jsx'
import Button from '../ui/Button.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import Logo from './logo.jsx'
import paramsFor from '../lib/paramsFor'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import StoryCell from './Story/StoryCell.jsx'
import Table from '../ui/Table.jsx'
import UserCell from './User/UserCell.jsx'

@connectToStores(ProfileStore)
export default class ProfilePage extends React.Component {

  static getPropsFromStores() {
    // The reason these are all split out is that I imagine that they'll
    // eventually come from multiple stores so we can make the requests faster
    // and do smrt things like pagination. ~@chrislloyd
    return {
      user: ProfileStore.user,
      upvotes: ProfileStore.upvotes,
      stories: ProfileStore.stories,
      changelogs: ProfileStore.changelogs,
      following: ProfileStore.following,
    }
  }

  render() {
    const { user } = this.props

    if (!user) {
      return <div />
    }

    return (
      <div>
        <UserCell user={user} />

        <div className="container">
          <h4>Upvotes received</h4>
          {this.renderUpvotes()}

          <h4>Recent stories</h4>
          {this.renderStories()}

          <h4>Member of</h4>
          {this.renderChangelogs()}

          <h4>Following</h4>
          {this.renderFollowing()}
        </div>
      </div>
    )
  }

  renderUpvotes() {
    const { upvotes } = this.props
    const stickerSheet = List(upvotes).sortBy(s => -s.count)

    let totalUpvotesReceived = 0
    stickerSheet.forEach(s => totalUpvotesReceived += s.count)

    return (
      <Table>
        <div className="flex flex-wrap">
          {stickerSheet.map(s => {
            const {emoji, count} = s
            return (
              <div className="p2 center" key={emoji.id}>
                <div className="mb1">
                  <Badge badge={emoji} size="3rem" />
                </div>
                {count}
              </div>
            )
          })}
        </div>
      </Table>
    )
  }

  renderStories() {
    const { stories } = this.props
    return (
      <Table>
        {
          List(stories)
            .sortBy(story => story.created_at)
            .reverse()
            .take(3)
            .map(story => (
              <Table.Cell key={story.id} to="story" params={paramsFor.story({id: story.changelog}, story)}>
                <StoryCell story={story} />
              </Table.Cell>
            ))
        }
      </Table>
    )
  }

  renderChangelogs() {
    const { changelogs } = this.props
    return (
      <div className="flex mxn1">
        {changelogs.map(changelog =>
          <div className="p1" key={changelog.id}>
            <Link to="changelog" params={{changelogId: changelog.slug}}>
              <Logo changelog={changelog} size="2rem" />
            </Link>
          </div>
        )}
      </div>
    )
  }

  renderFollowing() {
    const { following: changelogs } = this.props
    return (
      <div className="flex mxn1">
        {changelogs.map(changelog =>
          <div className="p1" key={changelog.id}>
            <Link to="changelog" params={{changelogId: changelog.slug}}>
              <Logo changelog={changelog} size="2rem" />
            </Link>
          </div>
        )}
      </div>
    )
  }
}
