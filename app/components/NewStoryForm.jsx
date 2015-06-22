import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from './autocomplete_user_input.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsInput from './ContributorsInput.jsx'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import shouldPureComponentUpdate from 'react-pure-render/function'
import StoriesActionCreator from '../actions/story_actions'
import StoryActions from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import Link from '../components/Link.jsx'
import {List, Map, Set} from 'immutable'

import EmojiStore from '../stores/emoji_store'
import EmojiInput from './EmojiInput.jsx'

@AuthenticatedMixin()
@connectToStores(EmojiStore, StoryFormStore)
export default class NewStoryForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug(),
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
      emoji_id:     StoryFormStore.emoji_id
    }
  }

  render() {
    const {
      title,
      body,
      isPublic,
      storyId,
      contributors,
      emoji_id,
    } = this.props

    return (
      <div className="mx-auto px2">

        <div className="">

          <div className="flex flex-center mxn1 mb2">
            <div className="p1">
              <EmojiInput
                value={emoji_id}
                onChange={this.handleChanged('emoji_id').bind(this)} />
            </div>
            <div className="flex-auto p1">
              <input type="text"
                className="field-light block full-width"
                placeholder="What did your team do lately?"
                value={title}
                onChange={this.handleChanged('title').bind(this)}
                ref="title"
                style={{
                  fontSize: '2rem',
                  height: 'auto'
                }} />
            </div>
          </div>

          <div className="mb2">
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
            <ContributorsInput className="field-light block full-width" />
            <p className="mt0 h5 gray">@mention friends or add their emails comma separated.</p>
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
