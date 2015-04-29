import ChangelogStore from 'stores/changelog_store'
import React from 'react'
import Button from 'components/ui/button.js.jsx'
import Icon from 'components/ui/icon.js.jsx'
import HighlightsStore from 'stores/highlights_store'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import StoriesActionCreator from 'actions/story_actions'
import {Link} from 'react-router'
import RouterContainer from 'lib/router_container'
import Story from 'components/story.js.jsx'

import StoryFormStore from 'stores/story_form_store'

import StoryFormActions from 'actions/story_form_actions'

export default class StoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title:    StoryFormStore.title,
      body:     StoryFormStore.body,
      isPublic: StoryFormStore.isPublic,
    }

    this.handleChanged = this._handleChanged.bind(this)
    this.handlePublish = this._handlePublish.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    StoryFormStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    StoryFormStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {title, body, isPublic} = this.state
    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return (
      <div className="flex flex-column">

        <div className="mb2">
          <input type="text" className="field-light full-width block mb0" placeholder="What changed?" value={title} onChange={this.handleChanged} ref="title" />
        </div>

        <div className="mb2">
          <textarea
            className="field-light mb0 block full-width"
            placeholder="What did you do?"
            ref="body"
            value={body}
            onChange={this.handleChanged} />
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
            <Button bg="white" color={StoryFormStore.isValid() ? 'green' : 'gray' } onClick={this.handlePublish}>Publish</Button>
          </div>
        </div>
      </div>
    )
  }

  _handleChanged(e) {
    StoryFormActions.change({
      title: this.refs.title.getDOMNode().value,
      body:  this.refs.body.getDOMNode().value,
      isPublic: false
    })
  }

  _handlePublish(e) {
    e.preventDefault()
    StoriesActionCreator.publish(ChangelogStore.slug, {
      title: this.state.title,
      body:  this.state.body
    })
  }

  _onStoreChange() {
    this.setState({
      title:    StoryFormStore.title,
      body:     StoryFormStore.body,
      isPublic: StoryFormStore.isPublic
    })
  }

}
