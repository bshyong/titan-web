import AuthenticatedMixin from '../mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from '../autocomplete_user_input.jsx'
import Button from '../../ui/Button.jsx'
import ChangelogStore from '../../stores/changelog_store'
import ContributorsActions from '../../actions/ContributorsActions'
import ContributorsInput from '../ContributorsInput.jsx'
import EmojiInput from '../EmojiInput.jsx'
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
import {List, Map, Set} from 'immutable'
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment'
import Calendar from 'rc-calendar'
import enUS from 'rc-calendar/lib/locale/en-us'

import '../../stylesheets/components/calendar.css'

@connectToStores(EmojiStore, StoryFormStore)
export default class StoryForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  static get propTypes() {
    return {
      onSubmit: React.PropTypes.func.isRequired,
    }
  }

  static getPropsFromStores() {
    return {
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      isPublic:     StoryFormStore.isPublic,
      emoji_id:     StoryFormStore.emoji_id,
      created_at:   StoryFormStore.created_at,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      showDetails: false,
      showCalendar: false,
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
      created_at,
    } = this.props

    return (
      <div>
        <div className="flex mb3 mxn1">
          <div className="flex-none px1">
            <EmojiInput
                value={emoji_id}
                onChange={this.handleChanged('emoji_id').bind(this)} />
          </div>

          <div className="flex-auto px1">
            <div className="mb2">
              <TextareaAutosize
                className="field-light block full-width h2 border-bottom"
                placeholder="What happened?"
                value={title}
                onChange={this.handleChanged('title').bind(this)}
                ref="title" />
            </div>

            <div>
              <ContributorsInput />
            </div>

            <div className="py1 h5 flex mxn1">
              <div className="p1">
                <Icon icon="eye" color="silver" />
                {' '}
                <a className="gray underline bold pointer" onClick={this.handleTogglePrivacy.bind(this)}>
                  {isPublic ? 'Everyone' : 'Team only'}
                </a>
              </div>
              <div className="p1">
                <Icon icon="calendar" color="silver" />
                {' '}
                <a className="gray underline bold pointer" onClick={this.handleToggleCalendar.bind(this)}>
                  {moment(created_at).format('MMM, DD YYYY')}
                </a>
                {this.state.showCalendar &&
                  <Calendar
                    style={{zIndex: 1000}}
                    locale={enUS}
                    onSelect={this.handleCalendarSelect.bind(this)} />}
              </div>
              <div className="flex-grow" />
              <div className="p1">
                {this.renderDetailsToggle()}
              </div>
            </div>

            {this.renderDetails()}
          </div>
        </div>
      </div>
    )
  }

  renderDetailsToggle() {
    return (
      <a className="pointer gray" onClick={this.handleToggleDetails.bind(this)}>
        <Icon icon={this.state.showDetails ? 'caret-up' : 'caret-down'} color="silver" />
        {' '}
        {!this.state.showDetails ? 'Show extra' : 'Hide extra'}
      </a>
    )
  }

  renderDetails() {
    if (!this.state.showDetails) {
      return
    }

    return (
      <div className="mb2">
        <MarkdownArea id={this.props.storyId || "new_story"}
                  placeholder="Describe your story (optional)"
                  gifPickerPosition="bottom"
                  ref="body"
                  value={this.props.body}
                  rows={4} />
        <div className="right-align">
          <a className="mt1 h6 silver" href="http://daringfireball.net/projects/markdown/basics" target="_blank">
            <strong>*Markdown*</strong> <i>_syntax_</i>
          </a>
        </div>
      </div>
    )
  }

  handleToggleCalendar(e) {
    this.setState({showCalendar: !this.state.showCalendar})
  }

  handleToggleDetails(e) {
    this.setState({showDetails: !this.state.showDetails})
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

  handleCalendarSelect(value) {
    this.updateForm('created_at', moment(value.time).toISOString())
  }
}
