import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import Label from 'components/ui/label.jsx'
import Markdown from 'components/ui/markdown.jsx'
import React from 'react'
import Router from 'lib/router_container'
import Stack from 'components/ui/stack.jsx'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import StoryReadersStore from 'stores/story_readers_store'

export default class StoryPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = this._stateFromStores()
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    StoryPageStore.addChangeListener(this.onStoreChange)
    StoryReadersStore.addChangeListener(this.onStoreChange)

    const {changelogId, storyId} = Router.get().getCurrentParams()

    StoryActions.fetch(changelogId, storyId)
  }

  componentWillUnmount() {
    StoryPageStore.removeChangeListener(this.onStoreChange)
    StoryReadersStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {story} = this.state
    if (!story) {
      return <div />
    }

    return (
      <div className="px2 mt4">
        <div className="mb2">
          {this.labels()}
        </div>
        <h1 className="mt0 mb3">{story.title}</h1>
        <div className="mb3">
          <Stack items={[<Avatar user={story.user} size={36} />]} />
        </div>

        <Markdown markdown={story.body} />

        {this.state.totalReads > 0 ? <div className="gray mt4">
          Read {this.pluralize(this.state.totalReads, 'time ', 'times ')}
          by {this.pluralize(this.state.uniqueReads, 'person ', 'people ')}
        </div> : null}
      </div>
    )
  }

  labels() {
    const {story: {labels}} = this.state
    return List(labels).map(label => {
      return <Label name={label} key={label} />
    }).toJS()
  }

  pluralize(count, singular, plural) {
    return `${count} ${count === 1 ? singular : plural}`
  }

  _stateFromStores() {
    return {
      story: StoryPageStore.story,
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads
    }
  }

  _onStoreChange() {
    this.setState(this._stateFromStores())
  }
}
