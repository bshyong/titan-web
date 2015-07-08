import Avatar from '../../ui/Avatar.jsx'
import Badge from '../Badge.jsx'
import ChangelogStore from '../../stores/changelog_store'
import Discussion from '../discussion.jsx'
import DiscussionActions from '../../actions/discussion_actions'
import Icon from '../../ui/Icon.jsx'
import Label from '../../ui/Label.jsx'
import LoadingBar from '../../ui/LoadingBar.jsx'
import Markdown from '../../ui/Markdown.jsx'
import React from 'react'
import Router from '../../lib/router_container'
import SessionStore from '../../stores/session_store'
import Stack from '../../ui/Stack.jsx'
import StoryActions from '../../actions/story_actions'
import StoryReadersStore from '../../stores/story_readers_store'
import GroupedStoriesStore from '../../stores/GroupedStoriesStore'
import SubscribeStoryButton from '../subscribe_story_button.jsx'
import UpvoteToggler from '../UpvoteToggler.jsx'
import connectToStores from '../../lib/connectToStores.jsx'
import moment from '../../config/moment'
import pluralize from '../../lib/pluralize'
import shallowEqual from 'react-pure-render/shallowEqual'
import {Link} from 'react-router'
import {List} from 'immutable'

@connectToStores(GroupedStoriesStore, StoryReadersStore, ChangelogStore)
export default class Story extends React.Component {

  static getPropsFromStores(props) {
    return {
      story: GroupedStoriesStore.get(props.storyId),
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
      changelog: ChangelogStore.changelog,
    }
  }

  constructor(props) {
    super(props)

    this.deleteStory = this._deleteStory.bind(this)
  }

  render() {
    const { story, changelog } = this.props
    const changelogId = changelog.id
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
      <div className="flex flex-column" style={{minHeight: 'calc(100vh - 3.5rem)'}}>
        <Link className="p2 gray orange-hover" to="changelog" params={{changelogId: changelog.slug}}>
          <Icon icon="angle-left" /> { changelog.name }
        </Link>

        <div className="p2 sm-px0 sm-py3 md-py4">
          <div className="container sm-flex">
            <div className="sm-col-8">

              <div className="mb2 sm-mb3">
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

              <div className="mb2 sm-mb3">
                <Stack items={this.avatars()} />
              </div>

              <div className="flex h5 gray">
                <div className="flex-auto h5">
                  {moment(story.created_at).format('ll @ LT')} by <span className="bold">@{story.user.username}</span>
                </div>

                <div className="flex-none">
                  <ul className="list-reset mb0 mxn1 h5 flex">
                    <li className="px1">
                      <span className="silver"><Icon icon="eye" /></span> {this.props.totalReads}
                    </li>
                    <li className="px1">
                      <span className="silver"><Icon icon="comment" /></span> {story.live_comments_count}
                    </li>
                    {this.renderEditLink()}
                    {this.renderDeleteLink()}
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

        <div className="flex-auto bg-smoke">
          <div className="container">
            <div className="sm-col-8 mx-auto">
              <Discussion storyId={this.props.story.slug} changelogId={this.props.changelogId} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  avatars() {
    let guests = List(new Array(4)).map(() => (
      <img
        className="block circle bg-mid-gray"
        src={'/default_avatar.png'}
        style={{width: 32, height: 32}}
        alt={username} />
      )
    )
    return story.contributors.
      map(user => <Avatar user={user} size={32} />).concat(guests)
  }

  renderDeleteLink() {
    if (this.props.changelog.viewer_can_edit) {
      return (
        <li className="px1">
          <span className="gray pointer" onClick={this.deleteStory}><Icon icon="trash" /> Delete</span>
        </li>
      )
    }
  }

  renderEditLink() {
    if (this.props.changelog.user_is_team_member) {
      return (
        <li className="px1">
          <Link to="edit" params={{changelogId: ChangelogStore.slug, storyId: this.props.story.id}}>
            <span className="gray"><Icon icon="pencil" /> Edit</span>
          </Link>
        </li>
      )
    }
  }

  _deleteStory() {
    const { changelogId, story: { slug } } = this.props
    StoryActions.delete(changelogId, slug)
  }
}
