import {List, Set} from 'immutable'
import {RouteHandler, Link} from 'react-router'
import moment from 'moment'
import React from 'react'
import RouterContainer from 'lib/router_container'
import StoriesStore from 'stores/stories_store'
import Story from 'components/story.js.jsx'
import StoryActions from 'actions/story_actions'
import Table from 'components/ui/table.js.jsx'
import Avatar from 'components/ui/avatar.jsx'
import Stack from 'components/ui/stack.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Emoji from 'components/ui/emoji.jsx'
import Jumbotron from 'components/ui/jumbotron.jsx'
import FollowButton from 'components/follow_button.jsx'
import Logo from 'components/logo.jsx'

import MetaBannerUrl from 'images/meta-banner.jpg'

export default class Changelog extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(params.changelogId)
  }

  constructor(props) {
    super(props)
    this.stores = [StoriesStore]
    this.state = this.getStateFromStores()
    this.handleStoresChanged = this.handleStoresChanged.bind(this)
  }

  getStateFromStores() {
    return {
      stories: StoriesStore.all()
    }
  }

  render() {
    const {changelogId} = this.props
    const stories = List(this.state.stories)
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf('day'))

    const a = stories.reduce(function (reduction, value, key, iter) {
      let a = reduction.push(
        <Table.Separator label={key.calendar()} key={key.toISOString()} />
      )
      let b = a.push(
        value.map((story) => {
          const contributors = Set(story.contributors)
          return (
            <Table.Cell key={story.id} image={<div className="p2"><Emoji story={story} size={36} /></div>} to="story" params={{changelogId, storyId: story.id}}>
              <div className="flex">
                <div className="flex-auto">
                  {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
                </div>
                <div className="flex-none sm-show ml2">
                  <Stack items={contributors.map(user => <Avatar user={user} size={24} />).toJS()} />
                </div>

                <div className="flex-none ml2">
                  <div className="h5 gray mxn1 flex">
                    <div className="px1">
                      <span className="silver"><Icon icon="heart" /></span>
                      {' '}
                      {story.hearts_count}
                    </div>
                    <div className="px1">
                      <span className=" silver"><Icon icon="comment" /></span>
                      {' '}
                      {story.comments_count}
                    </div>
                  </div>
                </div>
              </div>
            </Table.Cell>
          )
        })
      )
      return b
    }, List())

    return <div>
      <Jumbotron bgColor="blue" bgImageUrl={MetaBannerUrl}>
        <div className="sm-flex flex-center">

          <div className="flex-none mb2 sm-mb0">
            <div className="mx-auto" style={{width: '4rem'}}><Logo size="4rem"/></div>
          </div>

          <Link className="block flex-auto mb2 md-mb0 sm-px3 center sm-left-align white" to="changelog" params={{changelogId}}>
            <h2 className="mt0 mb0">Meta</h2>
            <div>Building Assembly on Assembly.</div>

          </Link>

          <div className="flex-none sm-ml2">
            <FollowButton changelog={this.state.changelog}/>
          </div>
        </div>
      </Jumbotron>
      <div className="container">
        <Table>{a.toJS()}</Table>
      </div>
    </div>
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
