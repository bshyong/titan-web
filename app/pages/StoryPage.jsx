import {List} from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import Discussion from '../components/discussion.jsx'
import DiscussionActions from '../actions/discussion_actions'
import DocumentTitle from 'react-document-title'
import GifPicker from '../components/gif_picker.jsx'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import Guest from '../ui/Guest.jsx'
import Icon from '../ui/Icon.jsx'
import invite from '../lib/invite'
import Label from '../ui/Label.jsx'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import Markdown from '../ui/Markdown.jsx'
import moment from '../config/moment'
import paramsFor from '../lib/paramsFor'
import pluralize from '../lib/pluralize'
import Popover from '../ui/Popover.jsx'
import React from 'react'
import Router from '../lib/router_container'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryReadersStore from '../stores/story_readers_store'
import UpvoteToggler from '../components/UpvoteToggler.jsx'

@connectToStores(GroupedStoriesStore, StoryReadersStore, ChangelogStore)
export default class StoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (query.i) {
      invite.set(query.i)
    }
    StoryActions.fetch(Router.changelogSlug(params), params.storyId)
    DiscussionActions.fetchAll(Router.changelogSlug(params), params.storyId)
  }

  static getPropsFromStores() {
    const params = Router.get().getCurrentParams()
    const storyId = params.storyId
    return {
      changelog: ChangelogStore.changelog,
      story: GroupedStoriesStore.get(storyId),
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
    }
  }

  render() {
    const { story, changelog } = this.props
    const changelogId = Router.get().getCurrentParams().changelogId
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
          {this.renderInvite()}

          <Link className="p2 gray orange-hover" to="changelog" params={{changelogId}}>
            <Icon icon="angle-left" /> { changelog.name }
          </Link>

          <div className="p2 sm-px0 sm-py3 md-py4">
            <div className="container sm-flex">
              <div className="sm-col-8">

                <div className="mb3">
                  <div className="mb2">
                    <Badge badge={story.emoji} size="2rem" />
                  </div>

                  <h1 className="mt0 mb2">
                    {story.team_member_only ? <Icon icon="lock" /> : null}
                    {' '}
                    {story.title}
                  </h1>
                  {body}
                </div>

                <div className="mb3">
                  <Stack items={this.avatars()} />
                </div>

                <div className="clearfix h5 gray">
                  <div className="col col-12 sm-col-6 mb1 sm-mb0">
                    {moment(story.created_at).format('ll @ LT')} by <Link to="profile" params={{userId: story.user.username}} className="bold gray">@{story.user.username}</Link>
                  </div>

                  <div className="col col-12 sm-col-6 mb1 sm-mb0">
                    <ul className="list-reset mb0 mxn1 h5 flex">
                      <li className="px1">
                        <span className="silver"><Icon icon="eye" /></span> {this.props.totalReads}
                      </li>
                      <li className="px1">
                        <span className="silver"><Icon icon="comment" /></span> {story.live_comments_count}
                      </li>
                      {this.renderEditLink()}
                      {this.renderDeleteLink()}
                      {this.renderShareLink()}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex-first sm-col-2">
                <div className="flex flex-column flex-center px2 center">
                  <UpvoteToggler story={story}
                         size="lg"
                         hearted={story.viewer_has_hearted} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-auto bg-whitesmoke">
            <div className="container">
              <div className="sm-col-8 mx-auto mt4" style={{marginBottom: '20rem'}}>
                <Discussion story={this.props.story} changelogId={this.props.changelogId} />
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  renderDeleteLink() {
    if (this.props.changelog.viewer_can_edit) {
      return (
        <li className="px1">
          <span className="gray gray-hover pointer" onClick={this.deleteStory}><Icon icon="trash" /> Delete</span>
        </li>
      )
    }
  }

  renderEditLink() {
    if (this.props.changelog.user_is_team_member) {
      return (
        <li className="px1">
          <Link to="edit" params={paramsFor.story(ChangelogStore.changelog, this.props.story)}>
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
          <a target="_blank" className="gray gray-hover" href={`https://twitter.com/home?status=${story.title}%20-%20${window.location}%20via%20%40asm`}>
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

  handleTwitterShare() {

  }

  renderInvite() {
    if (!this.props.story.invited) {
      return
    }

    return (
      <div className="bold center p2 white bg-green rounded">
        You were invited as a guest contributor on this story. Sign up to be more awesome
      </div>
    )
  }

  avatars() {
    const { story } = this.props
    let guests = List(new Array(story.guests_count || 0)).map(() => <Guest size={32} />)

    return List(story.contributors).
      map(user => (
        <Link to="profile" params={{userId: user.username}} className="bold gray">
          <Avatar user={user} size={32} />
        </Link>)
      ).concat(guests)
  }

  deleteStory() {
    const { changelogId, story: { slug } } = this.props
    if (window.confirm('Are you sure you want to delete this story?')) {
      StoryActions.delete(changelogId, slug)
    }
  }
}
