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
import pluralize from '../lib/pluralize'

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

    const upvoteCount = List(this.props.upvotes).reduce((reduction, value) => {
      return reduction + value.count
    }, 0)

    console.log(upvoteCount)

    return (
      <div>
        <UserCell user={user} />

        <hr className="mt0 mb0" />

        <div className="container">
          <div className="py4">
            <h2 className="mt0 mb0">
              Working on <strong>{pluralize(this.props.changelogs.length, 'changelog', 'changelogs')}</strong>,
              earned <strong>{pluralize(upvoteCount, 'upvote', 'upvotes')}</strong>,
              contributed to <strong>{pluralize(this.props.stories.length, 'post', 'posts')}</strong>,
              and following <strong>{pluralize(this.props.following.length, 'changelog', 'changelogs')}</strong> changelogs.
            </h2>
          </div>
          {this.renderSection('Upvotes earned', this.renderUpvotes)}
          {this.renderSection('Recent contributions', this.renderStories)}
          {this.renderSection('Changelogs', this.renderChangelogs)}
        </div>
      </div>
    )
  }

  renderSection(title, body) {
    return (
      <div className="mb3">
        <h4 className="py1 border-bottom">{title}</h4>
        {body.bind(this)()}
      </div>
    )
  }

  renderUpvotes() {
    const { upvotes } = this.props
    const stickerSheet = List(upvotes).sortBy(s => -s.count)

    return (
      <div className="border-bottom">
        <div className="flex flex-wrap mxn2">
          {stickerSheet.map(s => {
            const {emoji, count} = s
            return (
              <div className="p2 center" key={emoji.id}>
                <div className="mb1">
                  <Badge badge={emoji} size="2rem" />
                </div>
                <div className="h5 gray">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
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
            .take(5)
            .map(story => (
              <Table.Cell key={story.id} to="story" params={paramsFor.story(story.changelog, story)}>
                <div className="flex">
                  <div className="mr2">
                    <Badge badge={story.emoji} size="1.5rem" />
                  </div>
                  <div className="flex-auto">
                    {story.title}
                  </div>
                  <div className="gray">
                    {story.changelog.name}
                  </div>
                </div>

              </Table.Cell>
            ))
        }
      </Table>
    )
  }

  renderChangelogs() {
    return (
      <div className="flex">
        <div className="half-width">
          <h5 className="mt1 mb0 gray">Working on</h5>
          {this.renderWorkingOnChangelogs()}
        </div>

        <div className="half-width">
          <h5 className="mt1 mb0 gray">Following</h5>
          {this.renderFollowingChangelogs()}
        </div>
      </div>
    )
  }

  renderWorkingOnChangelogs() {
    const { changelogs } = this.props
    return (
      <div className="flex flex-wrap mxn1">
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

  renderFollowingChangelogs() {
    const { following: changelogs } = this.props
    return (
      <div className="flex flex-wrap mxn1">
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
