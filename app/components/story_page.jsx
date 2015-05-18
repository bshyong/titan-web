import {List} from 'immutable'
import Avatar from './ui/avatar.jsx'
import Label from './ui/label.jsx'
import Icon from './ui/icon.js.jsx'
import Markdown from './ui/markdown.jsx'
import moment from '../config/moment'
import React from 'react'
import Router from '../lib/router_container'
import SessionStore from '../stores/session_store'
import Stack from './ui/stack.jsx'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'
import StoryReadersStore from '../stores/story_readers_store'
import LoadingBar from './ui/loading_bar.jsx'
import pluralize from '../lib/pluralize'
import Emoji from './ui/emoji.jsx'
import {Link} from 'react-router'
import Discussion from './discussion.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import ChangelogStore from '../stores/changelog_store'

export default class StoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetch(params.changelogId, params.storyId)
  }

  constructor(props) {
    super(props)
    this.stores = [StoryStore, StoryReadersStore, ChangelogStore]

    this.state = this.getStateFromStores()

    this.handleStoresChanged = this.handleStoresChanged.bind(this)
    this.renderEditLink = this.renderEditLink.bind(this)
  }

  render() {
    const {story} = this.state
    const changelogId = Router.get().getCurrentParams().changelogId
    let body

    if (!story) {
      return <div />
    }

    if (story.body.length > 0) {
      body = <Markdown markdown={story.parsed_body || story.body} />
    }

    return (
      <div className="flex flex-column" style={{minHeight: 'calc(100vh - 3.5rem)'}}>

        <Link className="p2" to="changelog" params={{changelogId}}>
          <Icon icon="angle-left" /> Meta
        </Link>

        <div className="p2 sm-px0 sm-py3 md-py4">
          <div className="container sm-flex">
            <div className="sm-col-8">

              <div className="mb2 sm-mb3">
                <h1 className="mt0 mb2">
                  {story.team_member_only ? <Icon icon="lock" /> : null}
                  {' '}
                  {story.title}
                </h1>
                {body}
              </div>

              <div className="mb2 sm-mb3">
                <Stack items={story.allContributors.map(user => <Avatar user={user} size={32} />).toJS()} />
              </div>

              <div className="flex h5 gray">
                <div className="flex-auto h5">
                  {moment(story.created_at).format('ll @ LT')} by <span className="bold">@{story.user.username}</span>
                </div>

                <div className="flex-none">
                  <ul className="list-reset mb0 mxn1 h5 flex">
                    <li className="px1">
                      <span className="silver"><Icon icon="eye" /></span> {this.state.totalReads}
                    </li>
                    <li className="px1">
                      <span className="silver"><Icon icon="comment" /></span> {story.comments_count}
                    </li>
                    {this.renderEditLink()}
                  </ul>
                </div>
              </div>
            </div>


            <div className="flex-first sm-col-2">

              <div className="flex flex-column flex-center px2 center">
                <Emoji story={story}
                       size="lg"
                       hearted={story.viewer_has_hearted}
                       onClick={() => StoryActions.clickHeart(story)} />
              </div>

            </div>

          </div>
        </div>

        <div className="flex-auto" style={{background: '#FAF9F8'}}>
          <div className="container">
            <div className="sm-col-8 mx-auto">
              <Discussion storyId={this.state.story.id} changelogId={this.props.changelogId} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderEditLink() {
    if (this.state.changelog.user_is_team_member) {
      return (
        <li className="px1">
          <Link to="edit" params={{changelogId: ChangelogStore.slug, storyId: this.state.story.id}}>
            <span className="gray"><Icon icon="pencil" /> Edit</span>
          </Link>
        </li>
      )
    }
  }

  getStateFromStores() {
    const storyId = Router.get().getCurrentParams().storyId
    return {
      story: StoryStore.get(storyId),
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
      changelog: ChangelogStore.changelog
    }
  }

  // Stores mixin
  componentWillMount() {
    this.stores.forEach(store =>
      store.addChangeListener(this.handleStoresChanged)
    );
  }

  componentWillUnmount() {
    this.stores.forEach(store =>
      store.removeChangeListener(this.handleStoresChanged)
    );
  }

  handleStoresChanged() {
    this.setState(this.getStateFromStores(this.props));
  }
}
