import {Link} from 'react-router'
import {List} from 'immutable'
import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import Button from 'components/ui/button.js.jsx'
import ChangelogStore from 'stores/changelog_store'
import HighlightsActionCreator from 'actions/highlight_actions'
import HighlightsStore from 'stores/highlights_store'
import Icon from 'components/ui/icon.js.jsx'
import Router from 'lib/router_container'
import StoriesActionCreator from 'actions/story_actions'
import Story from 'components/story.js.jsx'
import StoryFormActions from 'actions/story_form_actions'
import StoryFormStore from 'stores/story_form_store'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import Textarea from 'react-textarea-autosize'
import React from 'react'

export default AuthenticatedMixin(class StoryForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.getStateFromStores()

    this.handleChanged = this._handleChanged.bind(this)
    this.handlePublish = this._handlePublish.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
    this.getStoryFromStore = this._getStoryFromStore.bind(this)
  }

  componentDidMount() {
    StoryFormStore.addChangeListener(this.onStoreChange)
    StoryPageStore.addChangeListener(this.getStoryFromStore)

    const {changelogId, storyId} = this.state
    if (storyId) {
      StoryActions.fetch(changelogId, storyId)
    }
  }

  componentWillUnmount() {
    StoryFormStore.removeChangeListener(this.onStoreChange)
    StoryPageStore.removeChangeListener(this.getStoryFromStore)
  }

  render() {
    const {title, body, isPublic, contributors, storyId} = this.state

    return (
      <div className="flex flex-column">

        <div className="mb2">
          <input type="text" className="field-light full-width block mb0" placeholder="What changed?" value={title} onChange={this.handleChanged} ref="title" />
        </div>

        <div className="mb2">
          <Textarea
            className="field-light mb0 block full-width"
            placeholder="What did you do?"
            ref="body"
            value={body}
            onChange={this.handleChanged} />
        </div>

        <div className="mb2">
          <input type="text" className="field-light full-width block mb0" placeholder="@mention any contributors who helped" value={contributors} onChange={this.handleChanged} ref="contributors" />
        </div>

        <div className="clearfix border-top">
          <div className="left">

            <div className="clearfix">
              <a className="block left p1 black" onClick={this.handleTogglePrivacy} onTouchStart={this.handleTogglePrivacy}>
                <Icon icon={this.state.isPublic ? 'globe' : 'lock'} fw={true} />
              </a>
            </div>

          </div>

          <div className="right">
            <Button bg="white" color={StoryFormStore.isValid() ? 'green' : 'gray' } onClick={this.handlePublish}>{storyId ? 'Update' : 'Publish'}</Button>
          </div>
        </div>
      </div>
    )
  }

  _handleChanged(e) {
    StoryFormActions.change({
      title: this.refs.title.getDOMNode().value,
      body:  this.refs.body.getDOMNode().value,
      contributors: this.refs.contributors.getDOMNode().value,
      isPublic: false
    })
  }

  _handlePublish(e) {
    e.preventDefault()

    if (this.state.storyId) {
      StoriesActionCreator.edit(ChangelogStore.slug, this.state.storyId, {
        title: this.state.title,
        body:  this.state.body,
        contributors: this.state.contributors
      })
    } else {
      StoriesActionCreator.publish(ChangelogStore.slug, {
        title: this.state.title,
        body:  this.state.body,
        contributors: this.state.contributors
      })
    }
  }

  getStateFromStores() {
    return {
      storyId:      Router.get().getCurrentParams().storyId,
      changelogId:  Router.get().getCurrentParams().changelogId,
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      contributors: StoryFormStore.contributors,
      isPublic:     StoryFormStore.isPublic
    }
  }

  _onStoreChange() {
    this.setState(this.getStateFromStores())
  }

  _getStoryFromStore() {
    const story = StoryPageStore.story

    this.setState({
      title: story.title,
      body: story.body,
      contributors: story.contributors.map(u => u.username),
      isPublic: story.isPublic
    })
  }

})
