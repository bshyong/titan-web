import {Link} from 'react-router'
import {List, Map} from 'immutable'
import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import Button from './ui/button.js.jsx'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from './ui/icon.js.jsx'
import Router from '../lib/router_container'
import RouterContainer from '../lib/router_container'
import shouldPureComponentUpdate from 'react-pure-render/function';
import StoriesActionCreator from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'
import MarkdownArea from './ui/markdown_area.jsx'
import React from 'react'
import EmojiPicker from './ui/emoji_picker.jsx'
import EmojiStore from '../stores/emoji_store'

@AuthenticatedMixin()
@connectToStores(EmojiStore, StoryFormStore)
export default class NewStoryForm extends React.Component {
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
            className="field-light full-width block mb0"
            placeholder="What changed?"
            value={title}
            onChange={this.handleChanged('title').bind(this)}
            ref="title" />
        </div>

        <div className="mb2">
          <MarkdownArea
            id={storyId || "new_story"}
            placeholder="What did you do?"
            ref="body"
            value={body}
            onChange={this.handleChanged('body').bind(this)} />
        </div>

        <div className="mb2">
          <input type="text"
            className="field-light full-width block mb0"
            placeholder="@mention any contributors who helped"
            value={contributors}
            onChange={this.handleChanged('contributors').bind(this)}
            ref="contributors" />
        </div>

        <div className="clearfix">
          <div className="left">
            <EmojiPicker />
          </div>
        </div>
        <br />
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
              {storyId ? 'Update' : 'Publish'}
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
