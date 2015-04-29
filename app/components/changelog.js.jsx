require('basscss/css/basscss.css')
import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import AuthenticatedComponent from 'components/authenticated_component.js.jsx'
import NewStory from 'components/new_story.js.jsx'
import Story from 'components/story.js.jsx'
import StoryActions from 'actions/story_actions'
import StoriesStore from 'stores/stories_store'
import React from 'react'
import RouterContainer from 'lib/router_container'
import Timeline from 'components/ui/timeline.js.jsx'
import moment from 'moment'

function renderDate(date) {
  return <div className="py2 mid-gray bold j">
    {date.format('LL')}
  </div>
}

export default AuthenticatedComponent(class Changelog extends React.Component {
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
    const stories = List(this.state.stories)
                    .sortBy(story => story.created_at)
                    .reverse()
                    .groupBy(story => moment(story.created_at).startOf('day'))

    const a = stories.reduce(function (reduction, value, key, iter) {
      let a = reduction.push(
        renderDate(key)
      )
      let b = a.push(
        value.map(story => (
          <div className="mb2" key={story.id}>
            <Story story={story} />
          </div>
        ))
      )
      return b
    }, List())

    return <Timeline>{a.toJS()}</Timeline>
  }

})
