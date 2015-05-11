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
    const changelogId = Router.get().getCurrentParams().changelogId
    let body

    if (!story) {
      return <div />
    }

    if (story.body.length > 0) {
      body = <Markdown markdown={story.body} />
    }

    return (
      <div className="container">
        <div className="sm-col-10 md-col-8 mx-auto">

          <Link className="py2 block" to="changelog" params={{changelogId}}>
            <Icon icon="chevron-left" /> {changelogId[0].toUpperCase() + changelogId.slice(1)}
          </Link>

          <div className="mb3 border-bottom py2">
            <div className="flex">
              <Emoji story={story} size={36} />
              <div className="ml1 h5" style={{lineHeight:'2rem'}}>
                {story.hearts_count}
              </div>
            </div>
          </div>


          <div className="border rounded bg-white border-silver p2 sm-p3">

            <div className="mb2 sm-mb3">
              <h2 className="mt0 mb1">{story.title}</h2>
              {body}
            </div>

            <div className="mb2 sm-mb3">
              <Stack items={story.contributors.map(user => <Avatar user={user} size={32} />)} />
            </div>


            <div className="flex h5 gray">
              <div className="flex-auto h5">
                {moment(story.created_at).format('ll - LT')} by <span className="bold">@{story.user.username}</span>
              </div>

              <div className="flex-none">
                <ul className="list-reset mb0 mxn1 h5 flex">
                  <li className="px1">
                    <span className="silver"><Icon icon="eye" /></span> {this.state.totalReads}
                  </li>
                  <li className="px1">
                    <span className="silver"><Icon icon="comment" /></span> {story.comments_count}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p2 sm-p3">
            <Discussion storyId={this.state.story.id} changelogId={this.props.changelogId} />
          </div>
        </div>
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
