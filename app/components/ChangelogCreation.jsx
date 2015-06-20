import { RouteHandler } from 'react-router'
import {List, Set} from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
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
        {this.renderSlugField()}
		{this.renderDescriptionField()}

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
          <h4 className="mt0 mb0">Choose who can see your Changelog</h4>
          <p className="mb0 gray">
            {
              is_members_only ? "Make it private. Only those you invite will be able to see and comment on it. You can change this later." : "Make it public. Anyone will be able to see it, follow it, and comment on it. You can change this later."
            }
          </p>
        <div>
          <Switch switched={!is_members_only} onSwitched={this.toggleVisibility.bind(this)} />
        </div>
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

  renderDescriptionField(){
  return (<div className="mb3">
    <label htmlFor="new-changelog-tagline">Tell everyone what its about</label>
    <textarea
      id="new-changelog-tagline"
      className="field-light full-width block"
      placeholder="5 words or less is best"
      onChange={this.handleFormChange.bind(this, 'tagline')}
      ref="name"
      style={{
        fontSize: '1rem',
        height: 'auto'
      }} />
  </div>)
  	
  }

  renderNameField() {
    const nameValid = NewChangelogStore.nameValid
    const cs = classnames("flex full-width field-light", {
      'is-error': !nameValid
    })

    const nameErrorText = nameValid ? '&nbsp;' : NewChangelogStore.errors.name || "We share your excitment but we need a name first."

    return (
      <div className="mb2">
        <label htmlFor="new-changelog-name">Name your Changelog</label>
		<p className="mb0 gray">
		  It doesn't need to be formal, just fun and memorable.
		</p>		
        <div className={cs} style={{height: 'auto'}}>
          <input type="text"
            id="new-changelog-name"
            className="field-light full-width block"
            placeholder="Usually a company or product name"
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

    const slugErrorText = slugValid ? '&nbsp;' : NewChangelogStore.errors.slug || "You'll want this later, it can't be blank."

    return (
      <div className="mb2">
        <label htmlFor="new-changelog-url">Changelog URL</label>
		<p className="mb0 gray">
		  You can add your own customized url later on.
		</p>
        <div className={cs} style={{height: 'auto'}}>
          <input type="text"
            id="new-changelog-url"
            className="field-light block full-width"
            placeholder="slug"
            value={NewChangelogStore.slug}
            onChange={this.handleFormChange.bind(this, 'slug')}
            ref="slug"
            style={{
              height: 'auto'
            }} />
        </div>
        <div className="red h5" dangerouslySetInnerHTML={{__html: slugErrorText}} />
      </div>
    )
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
