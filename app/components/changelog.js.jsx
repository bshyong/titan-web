import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from './ui/avatar.jsx'
import ChangelogStore from '../stores/changelog_store'
import Emoji from './ui/emoji.jsx'
import FollowButton from './follow_button.jsx'
import Icon from './ui/icon.js.jsx'
import Jumbotron from './ui/jumbotron.jsx'
import LoadingBar from './ui/loading_bar.jsx'
import Logo from './logo.jsx'
import moment from '../config/moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from './ui/scroll_paginator.jsx'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from './ui/stack.jsx'
import StoryStore from '../stores/story_store'
import StoryActions from '../actions/story_actions'
import Table from './ui/table.js.jsx'
import TimePicker from './ui/time_picker.jsx'

import MetaBannerUrl from '../images/meta-banner.jpg'

export default class Changelog extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(params.changelogId, ChangelogStore.timeLength)
  }
  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  constructor(props) {
    super(props)
    this.stores = [ChangelogStore, StoryStore]
    this.state = this.getStateFromStores()
    this.handleStoresChanged = this.handleStoresChanged.bind(this)
    this.renderShowMore = this.renderShowMore.bind(this)
  }

  getStateFromStores() {
    return {
      page: StoryStore.page,
      stories: StoryStore.all(),
      moreAvailable: StoryStore.moreAvailable,
      loading: StoryStore.loading,
      following: ChangelogStore.following,
      timeLength: ChangelogStore.timeLength
    }
  }

  parseCalendarDate(key) {
    var timeLength = this.state.timeLength
    if (timeLength=="day")
    {
      return (
        key.calendar()
      )
    }
    if (timeLength=="week") {
      var start_date = moment(key)
      var end_date = moment(key).add(1, 'weeks')
      return (
        start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
      )
    }
    if (timeLength=="month") {
      var start_date = moment(key)
      var end_date = moment(key).add(1, 'months')
      return (
        start_date.format('MMMM D, YYYY').concat(" - ").concat(end_date.format('MMMM D, YYYY'))
      )
    }
  }

  render() {
    const { changelogId } = this.props
    const stories = this.state.stories
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf(this.state.timeLength))


    const a = stories.reduce((reduction, value, key, iter) => {
      let a = reduction.push(
        <Table.Separator label={this.parseCalendarDate(key)} key={key.toISOString()} />
      )

      if (this.state.timeLength != "day")
        {value = value.slice(0,5)}

      let b = a.push(
        value.sortBy(story => -story.hearts_count).map(story => {
          const emoji = (
            <Emoji story={story} size="sm"
                   hearted={story.viewer_has_hearted}
                   onClick={() => StoryActions.clickHeart(story)} />
          )


          return (
            <Table.Cell key={story.id} image={emoji} to="story" params={{changelogId, storyId: story.id}}>
              <div className="flex">
                <div className="flex-auto">
                  {story.team_member_only ? <Icon icon="lock" /> : null} {story.title}
                </div>
                <div className="flex-none sm-show ml2">
                  <Stack items={story.allContributors.map(user => <Avatar user={user} size={24} />)} align="right" />
                </div>

                <div className="flex-none ml2">
                  <div className="h5 gray  mxn1 flex">
                    <div className="px1 no-underline">
                      <span className=" silver"><Icon icon="comment" /></span>
                      {' '}
                      {story.live_comments_count}
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
      {this.state.moreAvailable ?
        <ScrollPaginator page={this.state.page}
          onScrollBottom={() => StoryActions.fetchAll(this.props.changelogId, this.state.page + 1)} /> : null}

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
            <FollowButton changelogId={this.props.changelogId} toggled={this.state.following}/>
          </div>
        </div>
      </Jumbotron>

      <div className="container">
        <TimePicker />
        <Table>{a}</Table>
        <LoadingBar loading={this.state.loading} />
      </div>
    </div>
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
