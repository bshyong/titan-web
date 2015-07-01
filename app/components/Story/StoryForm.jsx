import Button from '../../ui/Button.jsx'
import Calendar from 'rc-calendar'
import ContributorsInput from '../ContributorsInput.jsx'
import EmojiInput from '../EmojiInput.jsx'
import Icon from '../../ui/Icon.jsx'
import MarkdownArea from '../../ui/markdown_area.jsx'
import React from 'react'
import RouterContainer from '../../lib/router_container'
import TextareaAutosize from 'react-textarea-autosize'
import enUS from 'rc-calendar/lib/locale/en-us'
import moment from 'moment'

import '../../stylesheets/components/calendar.css'

export default class StoryForm extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    story: React.PropTypes.shape({
      title: React.PropTypes.string,
      body:  React.PropTypes.string,
      team_member_only: React.PropTypes.string,
      contributors: React.PropTypes.string,
      emoji_id: React.PropTypes.string,
      created_at: React.PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showDetails: false || props.showDetails,
      showCalendar: false,
    }
  }

  render() {
    const {
      story: {
        title,
        body,
        team_member_only,
        contributors,
        emoji_id,
        created_at,
      }
    } = this.props

    return (
      <div>
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

            <div className="py1 h5 flex mxn1">
              <div className="p1">
                <Icon icon="eye" color="silver" />
                {' '}
                <a className="gray underline bold pointer" onClick={this.handlePrivacyToggled.bind(this)}
                  ref="isPublic">
                  {team_member_only ? 'Team only' : 'Everyone'}
                </a>
              </div>
              <div className="p1">
                <Icon icon="calendar" color="silver" />
                {' '}
                <a className="gray underline bold pointer" onClick={this.handleCalendarToggled.bind(this)}>
                  {moment(created_at).format('MMM, DD YYYY')}
                </a>
                {this.state.showCalendar &&
                  <Calendar
                    style={{zIndex: 1000}}
                    locale={enUS}
                    onSelect={this.handleCreatedAtChanged.bind(this)} />}
              </div>
              <div className="flex-grow" />
            </div>
          </div>
        </div>
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
