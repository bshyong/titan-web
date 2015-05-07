import {List} from 'immutable'
import Avatar from 'components/ui/avatar.jsx'
import Label from 'components/ui/label.jsx'
import Icon from 'components/ui/icon.js.jsx'
import Markdown from 'components/ui/markdown.jsx'
import moment from 'moment'
import React from 'react'
import Router from 'lib/router_container'
import Stack from 'components/ui/stack.jsx'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import StoryReadersStore from 'stores/story_readers_store'
import LoadingBar from 'components/ui/loading_bar.jsx'
import pluralize from 'lib/pluralize'
import Emoji from 'components/ui/emoji.jsx'
import {Link} from 'react-router'
import Discussion from 'components/discussion.jsx'

const EmojiMappings = {
  'discussion': '💬',
  'improvement': '✅',
  'feature': '✅',
  'update': '🎉',
  'bugfix': '🐛',
  'doc': '📄',
  'default': '✅'
}

export default class StoryPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = this._getStateFromStores()
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    StoryPageStore.addChangeListener(this.onStoreChange)
    StoryReadersStore.addChangeListener(this.onStoreChange)

    const {
      changelogId,
      storyId
    } = Router.get().getCurrentParams()
    StoryActions.fetch(changelogId, storyId)
  }

  componentWillUnmount() {
    StoryPageStore.removeChangeListener(this.onStoreChange)
    StoryReadersStore.removeChangeListener(this.onStoreChange)
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
      <div>
        <div className="flex mb2 pointer" onClick={this.handleToggle}>
          <div className="flex-none mr2">
            {this.emoji()}
          </div>

          <div className="flex-auto">
            <h2 className="mt0 mb0">{story.title}</h2>
          </div>
          <div className="flex-none ml3">
            <Stack items={story.contributors.map(user => <Avatar user={user} size={40} />)} />
          </div>
        </div>

        <div className="flex h5 gray mxn3 px3 mb3">

          <div className="flex-none p1">
            <Avatar user={story.user} size={19} />
          </div>
          <div className="flex-auto p1">
            Written {moment(story.created_at).fromNow()}
          </div>
        </div>

        {body}


        {this.state.totalReads > 0 ? <div className="gray mt4">
          Read {pluralize(this.state.totalReads, 'time ', 'times ')}
          by {pluralize(this.state.uniqueReads, 'person ', 'people ')}
        </div> : null}

        <hr />

        <Discussion storyId={story.id} changelogId={this.props.changelogId} />
      </div>
    )
  }

  emoji(story) {
    const {story: {labels}} = this.state
    const label = labels[0] || 'default'
    const emojiChar = EmojiMappings[label.toLowerCase()]
    return <Emoji char={emojiChar} size={36} />
  }

  _getStateFromStores() {
    return {
      story: StoryPageStore.story,
      totalReads: StoryReadersStore.totalReads,
      uniqueReads: StoryReadersStore.uniqueReads,
      isFakeLoading: true
    }
  }

  _onStoreChange() {
    this.setState(this._getStateFromStores())
  }
}
