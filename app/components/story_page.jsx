import React from 'react'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import Router from 'lib/router_container'
import Markdown from 'components/ui/markdown.jsx'

export default class StoryPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      story: StoryPageStore.story
    }
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    StoryPageStore.addChangeListener(this.onStoreChange)

    const {changelogId, storyId} = Router.get().getCurrentParams()

    StoryActions.fetch(changelogId, storyId)
  }

  componentWillUnmount() {
    StoryPageStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {story} = this.state
    if (!story) {
      return <div />
    }

    return (
      <div className="px2">
        <h1>{story.title}</h1>
        <Markdown markdown={story.body} />
      </div>
    )
  }

  _onStoreChange() {
    this.setState({
      story: StoryPageStore.story
    })
  }
}
