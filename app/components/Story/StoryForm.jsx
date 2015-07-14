import Button from '../../ui/Button.jsx'
import Calendar from 'rc-calendar'
import ChangelogName from 'components/Changelog/ChangelogName.jsx'
import ContributorsInput from '../ContributorsInput.jsx'
import Dialog from 'ui/Dialog.jsx'
import EmojiInput from '../EmojiInput.jsx'
import enUS from 'rc-calendar/lib/locale/en-us'
import Icon from '../../ui/Icon.jsx'
import MarkdownArea from '../../ui/markdown_area.jsx'
import MembersOnly from 'components/MembersOnly.jsx'
import moment from 'moment'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import TextareaAutosize from 'react-textarea-autosize'

import '../../stylesheets/components/calendar.css'

export default class StoryForm extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    changelog: React.PropTypes.shape({
      is_members_only: React.PropTypes.bool.isRequired,
    }),
    story: React.PropTypes.shape({
      title: React.PropTypes.string,
      body:  React.PropTypes.string,
      team_member_only: React.PropTypes.bool,
      contributors: React.PropTypes.string,
      emoji_id: React.PropTypes.string,
      created_at: React.PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showDetails: true,
      showCalendar: false,
    }
  }

  render() {
    const {
      changelog,
      story: {
        title,
        body,
        team_member_only,
        contributors,
        emoji_id,
        created_at,
        errorMessage,
      }
    } = this.props

    return (
      <div>
        {this.renderErrorMessage()}
        <div className="sm-flex mxn1">
          <div className="flex-none px1 mb2">
            <EmojiInput
                value={emoji_id}
                onChange={this.handleEmojiChanged.bind(this)} />
          </div>

          <div className="flex-auto px1">
            <div>
              <TextareaAutosize
                className="field-light block full-width h2"
                placeholder="What happened?"
                value={title}
                onChange={this.handleTitleChanged.bind(this)}
                ref="title" />
            </div>

            {this.renderDetails()}

            <div className="py1">
              <a className="pointer gray h5 bold" onClick={this.handleDetailsToggled.bind(this)} ref="toggleDetails">
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
                  <a className="gray underline bold pointer" onClick={this.handleCalendarToggled.bind(this)}>
                    {moment(created_at).format('MMM, DD YYYY')}
                  </a>
                  {this.state.showCalendar &&
                    <Dialog onCloseRequested={this.handleCalendarToggled.bind(this)} invisible={true}>
                      <div className="absolute">
                        <Calendar
                          style={{zIndex: 1000}}
                          locale={enUS}
                          onSelect={this.handleCreatedAtChanged.bind(this)} />
                      </div>
                    </Dialog>
                  }
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
    const { story: { errorMessage }, showErrorMessage } = this.props
    if (showErrorMessage && errorMessage) {
      return <div className="h4 p1 mb2 center bg-red white rounded">
        {errorMessage}
      </div>
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
        <a className="gray underline bold pointer" onClick={this.handlePrivacyToggled.bind(this)}
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
                  onChange={this.handleBodyChanged.bind(this)}/>
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

  dispatchChange(values) {
    this.props.onChange && this.props.onChange({
      ...this.props.story,
      ...values
    })
  }
}
