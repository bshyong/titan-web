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
  constructor(props) {
    props.changelogId = RouterContainer.get().getCurrentParams().changelogId
    super(props)
    this.state = {
      stories: []
    }
  }

  componentDidMount() {
    this.changeListener = this.onStoryAdded.bind(this)
    StoriesStore.addChangeListener(this.changeListener)
    StoryActions.fetchAll(this.props.changelogId)
  }

  componentWillUnmount() {
    StoriesStore.removeChangeListener(this.changeListener)
  }

  onStoryAdded() {
    this.setState({
      stories: StoriesStore.all()
    })
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
          <div className="mb2" key={story.id}>
            <Story story={story} changelogId={changelogId} />
          </div>
        ))
      )
      return b
    }, List())

    return <Timeline>{a.toJS()}</Timeline>
  }

}
