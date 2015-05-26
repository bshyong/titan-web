import {Link} from 'react-router'
import {List, Map} from 'immutable'
import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from './autocomplete_user_input.jsx'
import Button from './ui/button.js.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import EmojiPicker from './ui/emoji_picker.jsx'
import EmojiStore from '../stores/emoji_store'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from './ui/icon.js.jsx'
import MarkdownArea from './ui/markdown_area.jsx'
import React from 'react'
import Router from '../lib/router_container'
import RouterContainer from '../lib/router_container'
import shouldPureComponentUpdate from 'react-pure-render/function'
import StoriesActionCreator from '../actions/story_actions'
import StoryActions from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryStore from '../stores/story_store'

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
      <div className="flex flex-column">

        <div className="mb2">
          <input type="text"
            className="full-width block mb0 border-none outline-none"
            placeholder="What?"
            value={title}
            onChange={this.handleChanged('title').bind(this)}
            ref="title"
            style={{
              fontSize: '2rem',
              height: '100%',
            }} />

          <hr className="mt0 mb0" />

          <MarkdownArea
            id={storyId || "new_story"}
            placeholder="Why? How?"
            ref="body"
            value={body}
            onChange={this.handleChanged('body').bind(this)}
            border={false} />
        </div>

        <div className="mb2">
          <AutocompleteUserInput
            placeholder="Who? (@mention collaborators)"
            value={contributors}
            onChange={this.handleChanged('contributors').bind(this)}
            ref="contributors" />
        </div>

        <div className="clearfix mb1">
          <div className="left">
            <EmojiPicker />
          </div>
        </div>

        <div className="clearfix border-top">
          <div className="left">

            <div className="clearfix">
              <a className="block left p1 black pointer" onClick={this.handleTogglePrivacy.bind(this)} onTouchStart={this.handleTogglePrivacy.bind(this)}>
                <Icon icon={isPublic ? 'globe' : 'lock'} fw={true} /> {isPublic ? 'Public' : 'Private'}
              </a>
            </div>

          </div>

          <div className="right">
            <Button style="transparent"
              color={StoryFormStore.isValid() ? 'green' : 'gray' }
              action={this.props.onPublish}>
              {storyId ? 'Update' : 'Post'}
            </Button>
          </div>

        </div>

        <div className="mt2">
          <Link to="highlights" params={{changelogId: this.props.changelogId}}>
            View Highlights
          </Link>
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

  updateForm(field, value) {
    StoryFormActions.change(Map(this.props).set(field, value).toJS())
  }
}
