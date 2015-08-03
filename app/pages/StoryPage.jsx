import {bindActionCreators} from 'redux'
import {connect} from 'redux/react'
import {List} from 'immutable'
import * as storyActions from 'actions/storyActions'
import Avatar from 'ui/Avatar.jsx'
import Badge from 'components/Badge.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Discussion from 'components/discussion.jsx'
import {fetchAll} from 'actions/discussionActions'
import DocumentTitle from 'react-document-title'
import fetchData from 'decorators/fetchData'
import FlairClicker from 'components/FlairClicker.jsx'
import Guest from 'ui/Guest.jsx'
import Heart from 'components/Heart.jsx'
import Icon from 'ui/Icon.jsx'
import invite from 'lib/invite'
import Link from 'components/Link.jsx'
import Markdown from 'ui/Markdown.jsx'
import moment from 'config/moment'
import paramsFor from 'lib/paramsFor'
import PinPostButton from 'components/PinPostButton.jsx'
import Popover from 'ui/Popover.jsx'
import React from 'react'
import Router from 'lib/router_container'
import Stack from 'ui/Stack.jsx'
import StaffOnly from 'components/StaffOnly.jsx'
import Sticky from 'ui/Sticky.jsx'
import StoryBooster from 'components/staff/StoryBooster.jsx'
import StoryReadersStore from 'stores/story_readers_store'

export class StoryPage extends React.Component {
  render() {
    const { story, changelog } = this.props
    let body

    if (!story) {
      return <div />
    }

    if (story.body) {
      if (story.body.length > 0) {
        body = <Markdown markdown={story.parsed_body || story.body} />
      }
    }

    return (
      <DocumentTitle title={[story.title, (changelog && changelog.name)].join(' · ')}>
        <div className="flex flex-column" style={{minHeight: 'calc(100vh - 3.5rem)'}}>
          <ChangelogNavbar changelog={changelog} size="small" />

          {this.renderInvite()}

          <div className="p2 sm-px0 sm-py3 md-py4">
            <div className="container sm-flex">
              <div className="sm-col-9">

                <div className="mb3">
                  <div className="mb2">
                    <Badge badge={story.emoji} size="2rem" />
                  </div>

                  <h1 className="mt0 mb2">
                    {(story.team_member_only && !changelog.is_members_only) ? <Icon icon="lock" /> : null}
                    {' '}
                    {story.title}
                  </h1>
                  {body}
                </div>

                <div className="mb3">
                  <Stack items={this.avatars()} />
                </div>

                <div className="h5 gray sm-flex">
                  <div className="flex-auto mb1 sm-mb0">
                    {moment(story.created_at).format('ll @ LT')} <br />
                    by <Link to="profile" params={{userId: story.user.username}} className="bold gray">@{story.user.username}</Link>
                  </div>

                  <div>
                    <ul className="list-reset mb0 mxn1 h5 flex">
                      <li className="px1">
                        <span className="silver"><Icon icon="eye" /></span> {this.props.totalReads}
                      </li>
                      <li className="px1">
                        <span className="silver"><Icon icon="comment" /></span> {story.live_comments_count}
                      </li>
                      {this.renderPinToggler()}
                      {this.renderEditLink()}
                      {this.renderDeleteLink()}
                      {this.renderShareLink()}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex-first sm-col-2" style={{marginTop: '-1rem', marginBottom: '-1rem'}}>
                <Sticky>
                  <div className="flex flex-column flex-center p2 center">
                    <div className="mb3">
                      <Heart heartable={story} orientation="vertical" size="big" />
                    </div>

                    <FlairClicker flairable={story} changelog={changelog} orientation="vertical" size="big" />
                  </div>
                </Sticky>
              </div>
            </div>
          </div>

          <div className="flex-auto bg-smoke">
            <div className="container flex sm-flex">
              <div className="sm-col-9 mt4" style={{marginBottom: '20rem'}}>
                <Discussion story={this.props.story} changelogId={this.props.changelogId} />
              </div>
              <div className="flex-first sm-col-2"></div>
            </div>
          </div>

          <StaffOnly>
            <div className="clearfix bg-light-gray py4">
              <div className="container">
                <h4>👊 Super Admin Power Panel™</h4>
                <StoryBooster changelogId={this.props.changelogId} story={this.props.story} />
              </div>
            </div>
          </StaffOnly>

        </div>

      </DocumentTitle>
    )
  }

  renderPinToggler() {
    const { story, changelog } = this.props
    if (changelog.user_is_team_member) {
      return <PinPostButton post={story} changelogId={changelog.slug} />
    }
  }

  renderDeleteLink() {
    if (this.props.changelog.viewer_can_edit) {
      return (
        <li className="px1">
          <span className="gray gray-hover pointer" onClick={this.deleteStory.bind(this)} ref="del">
            <Icon icon="trash" /> Delete
          </span>
        </li>
      )
    }
  }

  renderEditLink() {
    const { changelog, story } = this.props
    if (changelog.viewer_can_edit) {
      return (
        <li className="px1">
          <Link to="edit" params={paramsFor.story(changelog, story)}>
            <span className="gray gray-hover"><Icon icon="pencil" /> Edit</span>
          </Link>
        </li>
      )
    }
  }

  renderShareLink() {
    const { story } = this.props

    const buttons = <div className="p1 center">
      <h5 className="mt0">share with</h5>
      <ul className="list-reset flex mb0 h3">
        <li className="px1">
          <a target="_blank"
            className="gray gray-hover"
            href={`/deeplinks/twitter?text=${encodeURIComponent(story.title)}%20-%20${window.location}%20via%20%40asm`}>
            <Icon icon="twitter" />
          </a>
        </li>
        <li className="px1">
          <a target="_blank" className="gray gray-hover" href={`https://www.facebook.com/sharer/sharer.php?u=${window.location}`}>
            <Icon icon="facebook-square" />
          </a>
        </li>
        <li className="px1">
          <a className="gray gray-hover" href={`mailto:?subject=${story.title} on Assembly&body=${window.location}`}>
            <Icon icon="envelope" />
          </a>
        </li>
      </ul>
    </div>

    return (
      <Popover content={buttons}>
        <li className="px1">
          <span className="gray gray-hover"><Icon icon="share-square-o" /> Share</span>
        </li>
      </Popover>
    )
  }

  renderInvite() {
    if (!this.props.story.invited) {
      return null
    }

    return (
      <div className="bold center p2 white bg-green rounded">
        You were invited as a guest contributor on this story. Sign up to be more awesome
      </div>
    )
  }

  avatars() {
    const { story } = this.props
    const guests = List(new Array(story.guests_count || 0)).map(() => <Guest size={32} />)

    return List(story.contributors).
      map(user => (
        <Link to="profile" params={{userId: user.username}} className="bold gray">
          <Avatar user={user} size={32} />
        </Link>)
      ).concat(guests)
  }

  deleteStory() {
    const { changelogId, story } = this.props
    if (window.confirm('Are you sure you want to delete this story?')) {
      this.props.deleteStory(changelogId, story.slug)
    }
  }
}

function getStory(stories, slug) {
  const group = stories.find(g => g.stories.get(slug))
  if (group) {
    return group.stories.get(slug)
  }
}


@fetchData((params, query) => {
  if (query.i) {
    invite.set(query.i)
  }
  return [
    storyActions.fetch(Router.changelogSlug(params), params.storyId),
    fetchAll(Router.changelogSlug(params), params.storyId),
  ]
})
@connect(state => ({
  changelog: state.currentChangelog.changelog,
  story: getStory(state.groupedStories.grouped, state.router.params.storyId),
}))
@connectToStores(StoryReadersStore)
export default class Wrapper extends React.Component {
  static getPropsFromStores() {
    return {
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
    }
  }

  render() {
    return <StoryPage {...this.props}
                      {...bindActionCreators(storyActions, this.props.dispatch)} />
  }
}
