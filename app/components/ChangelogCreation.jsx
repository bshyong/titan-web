import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import classnames from 'classnames'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import Switch from '../ui/Switch.jsx'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'

@connectToStores(NewChangelogStore, SessionStore)
export default class ChangelogCreation extends React.Component {

  constructor(props) {
    super(props)
  }

  static getPropsFromStores(props) {
    return {
      errors: NewChangelogStore.errors,
      user: SessionStore.user,
      changelog: NewChangelogStore.changelog,
    }
  }

  render() {
    return (
      <div className="md-col-8 mx-auto">
        {this.renderNameField()}
        <div className="mb3">
          <label htmlFor="new-changelog-tagline">Tagline</label>
          <input type="text"
            id="new-changelog-tagline"
            className="field-light full-width block"
            placeholder="Describe your Changelog"
            onChange={this.handleFormChange.bind(this, 'tagline')}
            ref="name"
            style={{
              fontSize: '1rem',
              height: 'auto'
            }} />
        </div>

        {this.renderSlugField()}

        <div className="mb3">
          <label htmlFor="new-changelog-website-url">Website</label>
          <input type="text"
            id="new-changelog-website-url"
            className="field-light block full-width"
            placeholder="External URL (optional)"
            onChange={this.handleFormChange.bind(this, 'website')}
            ref="name"
            style={{
              fontSize: '1rem',
              height: 'auto'
            }} />
        </div>

        <div className="mb3">
          {this.renderVisibilitySettings()}
        </div>
      </div>
    )
  }

  renderVisibilitySettings() {
    const { is_members_only } = this.props.changelog

    return (
      <div className="flex flex-center py2">
        <div className="flex-auto">
          <h4 className="mt0 mb0">Your Changelog is {is_members_only ? 'private' : 'public'}</h4>
          <p className="mb0 gray">
            {
              is_members_only ? "Only members can see this Changelog" : "Anybody may follow this Changelog"
            }
          </p>
        </div>
        <div>
          <Switch switched={!is_members_only} onSwitched={this.toggleVisibility.bind(this)} />
        </div>
      </div>
    )
  }

  handleFormChange(name, e) {
    NewChangelogActions.formChange(name, e.target.value)
  }

  toggleVisibility() {
    const { changelog } = this.props
    NewChangelogActions.formChange('is_members_only', !changelog.is_members_only)
  }

  renderNameField() {
    const nameValid = NewChangelogStore.nameValid
    const cs = classnames("flex full-width field-light", {
      'is-error': !nameValid
    })

    const nameErrorText = nameValid ? '&nbsp;' : NewChangelogStore.errors.name || "invalid name"

    return (
      <div className="mb2">
        <label htmlFor="new-changelog-name">Name</label>
        <div className={cs} style={{height: 'auto'}}>
          <input type="text"
            id="new-changelog-name"
            className="field-light full-width block"
            placeholder="Your Changelog name"
            onChange={this.handleFormChange.bind(this, 'name')}
            ref="name"
            style={{height: 'auto'}} />
        </div>
        <div className="red h5" dangerouslySetInnerHTML={{__html: nameErrorText}} />
      </div>
    )
  }

  renderSlugField() {
    const slugValid = NewChangelogStore.slugValid
    const cs = classnames("flex full-width field-light", {
      'is-error': !slugValid
    })

    const slugErrorText = slugValid ? '&nbsp;' : NewChangelogStore.errors.slug || "can't be blank"

    return (
      <div className="mb2">
        <label htmlFor="new-changelog-url">changelog.assembly.com/..</label>
        <div className={cs} style={{height: 'auto'}}>
          <input type="text"
            id="new-changelog-url"
            className="field-light block full-width"
            placeholder="Your Changelog slug"
            onChange={this.handleFormChange.bind(this, 'slug')}
            ref="tagline"
            style={{
              height: 'auto'
            }} />
        </div>
        <div className="red h5" dangerouslySetInnerHTML={{__html: slugErrorText}} />
      </div>
    )
  }

  sanitizeSlug(slugText) {
    let s = slugText.replace(/[|&;?$%@"<>/\()+,]/g, "").replace(/\s/, "-");
    return s
  }

  handlePublish() {
    const { name, tagline, website, membersOnly } = this.state
    const slug = this.sanitizeSlug(this.state.slug)
    const user_id = this.props.user.id
    const successCallback = this.props

    this.setState({recently_typed: false})
    ChangelogActions.create(name, tagline, slug, user_id, website, membersOnly, successCallback)
  }
}
