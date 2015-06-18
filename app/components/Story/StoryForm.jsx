import AuthenticatedMixin from '../mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from '../autocomplete_user_input.jsx'
import Button from '../../ui/Button.jsx'
import ChangelogStore from '../../stores/changelog_store'
import ContributorsActions from '../../actions/ContributorsActions'
import ContributorsInput from '../ContributorsInput.jsx'
import EmojiPicker from '../EmojiPicker.jsx'
import EmojiStore from '../../stores/emoji_store'
import HighlightsActionCreator from '../../actions/highlight_actions'
import HighlightsStore from '../../stores/highlights_store'
import Icon from '../../ui/Icon.jsx'
import MarkdownArea from '../../ui/markdown_area.jsx'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import SessionStore from '../../stores/session_store'
import StoriesActionCreator from '../../actions/story_actions'
import StoryActions from '../../actions/story_actions'
import StoryFormActions from '../../actions/story_form_actions'
import StoryFormStore from '../../stores/story_form_store'
import GroupedStoriesStore from '../../stores/GroupedStoriesStore'
import connectToStores from '../../lib/connectToStores.jsx'
import shouldPureComponentUpdate from 'react-pure-render/function'
import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'
import TextareaAutosize from 'react-textarea-autosize'

@connectToStores(EmojiStore, StoryFormStore)
export default class NewStoryForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static get propTypes() {
    return {
      onSubmit: React.PropTypes.func.isRequired,
    }
  }

  static get defaultProps() {
    return {
      isPublic: true
    }
  }

  static getPropsFromStores() {
    return {
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      isPublic:     StoryFormStore.isPublic,
      emoji_id:     EmojiStore.selectedEmoji
    }
  }

  render() {
    const {
      title,
      body,
      isPublic,
      storyId,
      contributors
    } = this.props

    return (
      <div>
        <div className="mb3">
          <TextareaAutosize
            className="field-light block full-width h2 border-bottom"
            placeholder="What did your team do lately?"
            value={title}
            onChange={this.handleChanged('title').bind(this)}
            ref="title"
            rows={2} />
          <p className="mt1 h5">Features, bug fixes, designs are all fair game.</p>
        </div>

        <div className="mb3">
          <EmojiPicker className="field-light block full-width" />
          <p className="mt1 h5 gray">
            Pick an emoji to describe the post. <a href="http://www.emoji-cheat-sheet.com/" target="_blank">
              Need a ✋?
            </a>
          </p>
        </div>

        <div className="mb3">
          <ContributorsInput className="field-light block full-width" />
          <p className="mt1 h5 gray">Who else helped out? @mention friends or add their emails comma separated.</p>
        </div>

      </div>
    )
  }

  handleChanged(field) {
    return (e) => this.updateForm(field, e.target.value)
  }

  handleTogglePrivacy(e) {
    this.updateForm('isPublic', !this.props.isPublic)
  }

  renderPostButton() {
    const valid = StoryFormStore.isValid()
    const { onPublish, storyId } = this.props

    return (
      <Button bg="green"
              disabled={!valid}
              action={this.handleOnSubmit.bind(this)}>
        {storyId ? 'Update' : 'Post'}
      </Button>
    )
  }

  updateForm(field, value) {
    StoryFormActions.change(Map(this.props).set(field, value).toJS())
  }

  handleOnSubmit(e) {
    this.props.onSubmit(e)
  }
}