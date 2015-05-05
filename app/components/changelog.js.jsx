import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import moment from 'moment'
import React from 'react'
import RouterContainer from 'lib/router_container'
import StoriesStore from 'stores/stories_store'
import Story from 'components/story.js.jsx'
import StoryActions from 'actions/story_actions'
import Timeline from 'components/ui/timeline.js.jsx'

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
      const date = key.format('l')
      let a = reduction.push(
        <Timeline.Date date={key} key={key.toISOString()} />
      )
      let b = a.push(
        value.map(story => (
          <Timeline.Item key={story.id}>
            <Story story={story} changelogId={changelogId} />
          </Timeline.Item>
        ))
      )
      return b
    }, List())

    return <Timeline>{a.toJS()}</Timeline>
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
