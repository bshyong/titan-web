import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from './autocomplete_user_input.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import EmojiPicker from './EmojiPicker.jsx'
import EmojiStore from '../stores/emoji_store'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import Router from '../lib/router_container'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoriesActionCreator from '../actions/story_actions'
import StoryActions from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryStore from '../stores/story_store'
import connectToStores from '../lib/connectToStores.jsx'
import shouldPureComponentUpdate from 'react-pure-render/function'
import {Link} from 'react-router'
import {List, Map} from 'immutable'

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
    const { storyId, changelogId } = Router.get().getCurrentParams()
    return {
      storyId:      storyId,
      changelogId:  changelogId,
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      contributors: StoryFormStore.contributors,
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
      <div className="clearfix mt2">
        <div className="sm-col-8 col-10 mx-auto">
          <div className="flex flex-column">
            <EmojiPicker />

            <div>
              <hr className="mt2 mb2" />
            </div>

            <div className="mb2">
              <input type="text"
                className="full-width border-none outline-none"
                placeholder="Write a short header"
                value={title}
                onChange={this.handleChanged('title').bind(this)}
                ref="title"
                style={{
                  fontSize: '2rem',
                  height: '100%',
                  padding: 0
                }} />

              <hr className="mt2 mb2" />

              <MarkdownArea id={storyId || "new_story"}
                placeholder="Describe your story (optional)"
                ref="body"
                value={body}
                onChange={this.handleChanged('body').bind(this)}
                border={false}
                style={{ padding: 0 }}
                rows={8} />
            </div>

            <div>
              <hr className="mt2 mb2" />
            </div>

            <div className="mb2">
              <AutocompleteUserInput
                style={{ padding: 0 }}
                placeholder="List contributors"
                value={contributors}
                onChange={this.handleChanged('contributors').bind(this)}
                ref="contributors" />
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
                       className="ml1">
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

    return (
      <Button style="outline"
        block={true}
        color={valid ? "orange" : "gray"}
        action={valid ? this.props.onPublish : null}>
        Post
      </Button>
    )
  }

  renderPrivacyText(isPublic) {
    return isPublic ? 'Everyone may view.' : 'Only core team can view.'
  }

  updateForm(field, value) {
    if (field === 'body') {
      let MENTION_REGEX = /(?!^|\s)@(\w*)/gi
      let contributors = List(value.match(MENTION_REGEX))

      if (!contributors.contains(`@${SessionStore.user.username}`)) {
        contributors = contributors.push(`@${SessionStore.user.username}`)
      }

      let contributorsString = contributors.toSet().join(', ') + ', '

      StoryFormActions.change(
        Map(this.props).
        set(field, value).
        set('contributors', contributorsString).
        toJS()
      )
    } else {
      StoryFormActions.change(Map(this.props).set(field, value).toJS())
    }
  }
}
