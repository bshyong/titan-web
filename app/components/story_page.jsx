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

    setTimeout(() => { this.setState({isFakeLoading: false})}, 5000)
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

    if (!this.state.isFakeLoading && story.body.length > 0) {
      body = <div className="p3">
        <Markdown markdown={story.body} />
      </div>
    }

    return (
      <div className="px2 py4">
        <div className="mxn3 rounded border overflow-hidden" style={{boxShadow: '0 0 1rem rgba(0,0,0,.05)'}}>
          <div className="p3">
            <div className="mb1">
              {this.labels()}
            </div>

        <Markdown markdown={story.body} />
            <div className="flex">
              <div className="flex-auto">
                <h1 className="mt0 mb0">{story.title}</h1>
              </div>
              <div className="flex-none ml3">
                <Stack items={[<Avatar user={story.user} size={40} />]} />
              </div>
            </div>

          </div>

            <div className="flex h5 gray px3" style={{backgroundColor: 'rgba(0,0,0,.05)'}}>

              <div className="flex-none p1" style={{opacity: 0.5}}>
                <Avatar user={story.user} size={19} />
              </div>
              <div className="flex-auto p1">
                Done {moment(story.created_at).fromNow()}
              </div>
              <a className="flex-none p1 block gray">
                Share
              </a>

              <a className="flex-none p1 block gray" href="#">
                <Icon icon="pencil" />
              </a>

              <a className="flex-none p1 block gray" href="#">
                <Icon icon="trash" />
              </a>
            </div>

            {body}

            {this.state.totalReads > 0 ? <div className="gray mt4">
              Read {this.pluralize(this.state.totalReads, 'time ', 'times ')}
              by {this.pluralize(this.state.uniqueReads, 'person ', 'people ')}
            </div> : null}

          <LoadingBar loading={this.state.isFakeLoading} />
        </div>
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
      uniqueReads: StoryReadersStore.uniqueReads,
      isFakeLoading: true
    }
  }

  _onStoreChange() {
    this.setState(this._stateFromStores())
  }
}
