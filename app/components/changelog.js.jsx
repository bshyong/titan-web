require('basscss/css/basscss.css')
import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import AuthenticatedComponent from 'components/authenticated_component.js.jsx'
import NewStory from 'components/new_story.js.jsx'
import OrgHeader from 'components/org_header.js.jsx'
import Story from 'components/story.js.jsx'
import StoryActions from 'actions/story_actions'
import StoriesStore from 'stores/stories_store'
import React from 'react'
import RouterContainer from 'lib/router_container'
import Timeline from 'components/ui/timeline.js.jsx'

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
    const stories = List(this.state.stories).
                    sortBy(story => story.created_at).
                    reverse().map(story => (
        <div className="mb2" key={story.id}>
          <Story story={story} />
        </div>
      )
    )

    return (
      <div>
        <OrgHeader />

        <div className="container sm-col-8">
          <Timeline>
            <div className="ml2 px3 py2 mid-gray">Today</div>
            {stories}
          </Timeline>

          <RouteHandler />
        </div>
      </div>
    )
  }
})
