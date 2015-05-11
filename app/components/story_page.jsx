import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import Heart from 'components/ui/heart.jsx'
import Label from 'components/ui/label.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Markdown from 'components/ui/markdown.jsx'
import moment from 'moment'
import React from 'react'
import Router from 'lib/router_container'
import SessionStore from 'stores/session_store'
import Stack from 'components/ui/stack.jsx'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import StoryReadersStore from 'stores/story_readers_store'
import LoadingBar from 'components/ui/loading_bar.jsx'
import pluralize from 'lib/pluralize'
import Emoji from 'components/ui/emoji.jsx'
import {Link} from 'react-router'
import Discussion from 'components/discussion.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'

export default class StoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetch(params.changelogId, params.storyId)
  }

  constructor(props) {
    super(props)
    this.stores = [StoryPageStore, StoryReadersStore]
    this.state = this.getStateFromStores()
    this.handleStoresChanged = this.handleStoresChanged.bind(this)
  }

  render() {
    const {story} = this.state
    let body

    if (!story) {
      return <div />
    }

    if (story.body.length > 0) {
      body = <Markdown markdown={story.body} />
    }

    return (
      <div className="container p2">

        <div className="mb1">
          <div className="pill bg-light-gray inline-block px2" style={{paddingTop: ".25rem", paddingBottom: '.25rem'}}>
            <div className="left mr1">
              <Emoji story={story} size={36} />
            </div> Bugfix
          </div>

        </div>

        <div className="mb2">
          <div className="h6">
            Posted {moment(story.created_at).fromNow()} by <span className="orange">{story.user.username}</span>
          </div>
          <div className="h6 gray">
            {pluralize(this.state.totalReads, 'view', 'views')}
          </div>
        </div>

        <div className="mb3">
          <h2 className="mt0 mb0">{story.title}</h2>
          {body}
        </div>

        <div className="mb3">
          <Stack items={story.contributors.map(user => <Avatar user={user} size={32} />)} />
        </div>

        <div className="mb3">
          <Heart
            count={story.hearts_count}
            onClick={() => this.heartClicked(story)}
            hearted={story.viewer_has_hearted} />
        </div>

        <hr />

        <Discussion storyId={this.state.story.id} changelogId={this.props.changelogId} />
      </div>
    )
  }

  heartClicked(story) {
    if (SessionStore.isSignedIn()) {
      if (story.viewer_has_hearted) {
        StoryActions.unheart(story.id)
      } else {
        StoryActions.heart(story.id)
      }
    }
  }

  getStateFromStores() {
    const storyId = Router.get().getCurrentParams().storyId
    return {
      story: StoryPageStore.get(storyId),
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
      isFakeLoading: true
    }
  }

  // Stores mixin
  componentWillMount() {
    this.stores.forEach(store =>
      store.addChangeListener(this.handleStoresChanged)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      this.setState(getState(nextProps));
    }
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
