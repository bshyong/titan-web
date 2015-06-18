import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from './autocomplete_user_input.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsInput from './ContributorsInput.jsx'
import EmojiPicker from './EmojiPicker.jsx'
import EmojiStore from '../stores/emoji_store'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoriesActionCreator from '../actions/story_actions'
import StoryActions from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import connectToStores from '../lib/connectToStores.jsx'
import shouldPureComponentUpdate from 'react-pure-render/function'
import {Link} from 'react-router'
import {List, Map, Set} from 'immutable'

@AuthenticatedMixin()
@connectToStores(EmojiStore, StoryFormStore)
export default class NewStoryForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId,
      isPublic: true
    }
  }

  static getPropsFromStores() {
    const { storyId, changelogId } = RouterContainer.get().getCurrentParams()
    return {
      storyId:      storyId,
      changelogId:  changelogId,
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
      <div className="sm-col-8 mx-auto px2">
        <div className="flex flex-column">
          <EmojiPicker />

          <div className="mt1 mb2 border-bottom border-smoke red h5">
            {StoryFormStore.titleHasEmoji() ? "Pick a badge above! Emojis in the title will be stripped out" : "\u00a0"}
          </div>
          <div className="mb2 border-bottom border-smoke">
            <div className="border-bottom border-smoke mb2">
              <input type="text"
                className="full-width input-invisible border-bottom border-smoke mb2"
                placeholder="Write a short header"
                value={title}
                onChange={this.handleChanged('title').bind(this)}
                ref="title"
                style={{
                  fontSize: '2rem',
                  height: 'auto'
                }} />
            </div>

            <MarkdownArea id={storyId || "new_story"}
              placeholder="Describe your story (optional)"
              gifPickerPosition="bottom"
              ref="body"
              value={body}
              onChange={this.handleChanged('body').bind(this)}
              border={false}
              style={{ padding: 0 }}
              rows={8} />
            <div className="right-align">
              <a className="mt1 h6 light-gray" href="http://daringfireball.net/projects/markdown/basics" target="_blank">
                Markdown <strong>*syntax*</strong> <i>_supported_</i>
              </a>
            </div>
          </div>

          <div className="mb2">
            <ContributorsInput />
          </div>
          <div className="clearfix border-top py3" style={{ borderColor: '#aaa' }}>
            <div className="left">
              <div className="clearfix">
                <span className="block left py1 black">
                  <Icon icon={isPublic ? 'unlock-alt' : 'lock'} fw={true} />
                  {this.renderPrivacyText(isPublic)}
                  <a href="javascript:void(0)"
                     onClick={this.handleTogglePrivacy.bind(this)}
                     onTouchStart={this.handleTogglePrivacy.bind(this)}
                     className="ml1"
                     ref="isPublic">
                    Change
                  </a>
                </span>
              </div>
            </div>
            <div className="right">
              {this.renderPostButton()}
            </div>
          </div>
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
      <Button style="outline"
        block={true}
        color={"orange"}
        disabled={!valid}
        action={valid ? onPublish : null}>
        {storyId ? 'Update' : 'Post'}
      </Button>
    )
  }

  renderPrivacyText(isPublic) {
    return isPublic ? 'Everyone may view.' : 'Only core team can view.'
  }

  updateForm(field, value) {
    StoryFormActions.change(Map(this.props).set(field, value).toJS())
  }
}
