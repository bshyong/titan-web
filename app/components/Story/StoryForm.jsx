import { connect } from 'redux/react'
import Calendar from 'rc-calendar'
import ContributorsInput from 'components/ContributorsInput.jsx'
import Dialog from 'ui/Dialog.jsx'
import EmojiInput from 'components/EmojiInput.jsx'
import enUS from 'rc-calendar/lib/locale/en-us'
import Icon from 'ui/Icon.jsx'
import MarkdownArea from 'ui/markdown_area.jsx'
import MembersOnly from 'components/MembersOnly.jsx'
import moment from 'moment'
import { setPublishToTwitter } from 'lib/publishToTwitter'
import React, { Component, PropTypes } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import 'stylesheets/components/calendar.css'

@connect(state => ({
  currentUser: state.currentUser,
}))
export default class StoryForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    changelog: PropTypes.shape({
      is_members_only: PropTypes.bool.isRequired,
    }),
    story: PropTypes.shape({
      body: PropTypes.string,
      contributors: PropTypes.string,
      created_at: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]),
      emoji_id: PropTypes.string,
      publishToTwitter: PropTypes.bool,
      team_member_only: PropTypes.bool,
      title: PropTypes.string,
    }).isRequired,
    showErrorMessage: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      showDetails: true,
      showCalendar: false,
    }

    this.handleBodyChanged = this.handleBodyChanged.bind(this)
    this.handleCalendarToggled = this.handleCalendarToggled.bind(this)
    this.handleCreatedAtChanged = this.handleCreatedAtChanged.bind(this)
    this.handleDetailsToggled = this.handleDetailsToggled.bind(this)
    this.handleEmojiChanged = this.handleEmojiChanged.bind(this)
    this.handlePrivacyToggled = this.handlePrivacyToggled.bind(this)
    this.handleTitleChanged = this.handleTitleChanged.bind(this)
    this.handleTwitterChange = this.handleTwitterChange.bind(this)
  }

  render() {
    const {
      changelog,
      story: {
        title,
        emoji_id,
        created_at,
        publishToTwitter
      }
    } = this.props

    return (
      <div>
        {this.renderErrorMessage()}
        <div className="sm-flex mxn1">
          <div className="flex-none px1 mb2">
            <EmojiInput
                value={emoji_id}
                onChange={this.handleEmojiChanged} />
          </div>

          <div className="flex-auto px1">
            <div>
              <TextareaAutosize
                className="field-light block full-width h2"
                placeholder="What happened?"
                value={title}
                onChange={this.handleTitleChanged}
                ref="title" />
            </div>

            {this.renderDetails()}

            <div className="py1">
              <a className="pointer gray h5 bold"
                onClick={this.handleDetailsToggled}
                ref="toggleDetails">
                <Icon icon={this.state.showDetails ? 'caret-up' : 'caret-down'} color="silver" />
                {' '}
                {!this.state.showDetails ? 'Add details' : 'Hide details'}
              </a>
            </div>

            <div>
              <ContributorsInput />
            </div>

            <MembersOnly changelog={changelog}>
              <div className="py1 h5 flex mxn1">
                {this.renderPrivacyToggler()}
                <div className="p1">
                  <Icon icon="calendar" color="silver" />
                  {' '}
                  <a className="gray underline bold pointer"
                    onClick={this.handleCalendarToggled}>
                    {moment(created_at).format('MMM, DD YYYY')}
                  </a>
                  {this.state.showCalendar &&
                    <Dialog onCloseRequested={this.handleCalendarToggled}
                      invisible={true}>
                      <div className="absolute">
                        <Calendar
                          style={{zIndex: 1000}}
                          locale={enUS}
                          onSelect={this.handleCreatedAtChanged} />
                      </div>
                    </Dialog>
                  }
                </div>
                <div className="p1">
                  <input className="field-light mr1"
                    type="checkbox"
                    onChange={this.handleTwitterChange}
                    checked={publishToTwitter} />
                  <a className="gray underline bold pointer"
                    onClick={this.handleTwitterChange}
                    ref="publishToTwitter">
                    Publish to Twitter
                  </a>
                </div>

                <div className="flex-grow" />
              </div>
            </MembersOnly>

          </div>
        </div>
      </div>
    )
  }

  renderErrorMessage() {
    const {
      story: {
        errorMessage
      },
      showErrorMessage,
    } = this.props
    if (showErrorMessage && errorMessage) {
      return (
        <div className="h4 p1 mb2 center bg-red white rounded">
          {errorMessage}
        </div>
      )
    }
    return <div />
  }

  renderPrivacyToggler() {
    const { changelog, story: {
      team_member_only
    } } = this.props

    if (changelog.is_members_only) {
      return
    }

    return (
      <div className="p1">
        <Icon icon="eye" color="silver" />
        {' '}
        <a className="gray underline bold pointer"
          onClick={this.handlePrivacyToggled}
          ref="isPublic">
          {team_member_only ? 'Changelog members only' : 'Everyone'}
        </a>
      </div>
    )
  }

  renderDetails() {
    if (!this.state.showDetails) {
      return
    }

    return (
      <div className="mt2">
        <MarkdownArea id={this.props.storyId || "new_story"}
          placeholder="Describe your story (optional)"
          gifPickerPosition="bottom"
          ref="body"
          value={this.props.story.body}
          rows={4}
          onChange={this.handleBodyChanged} />
        <div className="right-align">
          <a className="mt1 h6 silver" href="http://daringfireball.net/projects/markdown/basics" target="_blank">
            <strong>*Markdown*</strong> <i>_syntax_</i>
          </a>
        </div>
      </div>
    )
  }

  handleCalendarToggled(e) {
    this.setState({showCalendar: !this.state.showCalendar})
  }

  handleDetailsToggled(e) {
    this.setState({showDetails: !this.state.showDetails})
  }

  handleEmojiChanged(e) {
    this.dispatchChange({emoji_id: e.target.value})
  }

  handleTitleChanged(e) {
    this.dispatchChange({title: e.target.value})
  }

  handlePrivacyToggled(e) {
    this.dispatchChange({team_member_only: !this.props.story.team_member_only})
  }

  handleCreatedAtChanged(e) {
    this.dispatchChange({created_at: moment(e.time).toISOString()})
  }

  handleBodyChanged(e) {
    this.dispatchChange({body: e.target.value})
  }

  handleTwitterChange(e) {
    const { story: { publishToTwitter } } = this.props
    this.dispatchChange({ publishToTwitter: !publishToTwitter })
    setPublishToTwitter(!publishToTwitter)
  }

  dispatchChange(values) {
    this.props.onChange && this.props.onChange({
      ...this.props.story,
      ...values
    })
  }
}
