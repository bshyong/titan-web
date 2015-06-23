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
import RadioGroup from 'react-radio-group'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import Switch from '../ui/Switch.jsx'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'
import VisibilityToggler from '../components/VisibilityToggler.jsx'

@connectToStores(NewChangelogStore, SessionStore)
export default class ChangelogCreation extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      slugFieldExpanded: false
    }
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
          <VisibilityToggler changelog={this.props.changelog} onChange={this.toggleVisibility.bind(this)} />
        </div>
      </div>
    )
  }

  handleFormChange(name, e) {
    NewChangelogActions.formChange(name, e.target.value)
  }

  renderDescriptionField(){
    return (
      <div className="mb3">
        <label htmlFor="new-changelog-tagline">Tell everyone what it's about</label>
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
      </div>
    )
  }

  renderNameField() {
    const nameValid = NewChangelogStore.nameValid
    const cs = classnames("flex full-width field-light", {
      'is-error': !nameValid
    })

    const nameErrorText = nameValid ? '&nbsp;' : NewChangelogStore.errors.name || "We share your excitement but we need a name first."

    return (
      <div className="mb2">
        <label htmlFor="new-changelog-name">Name your Changelog</label>
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

    const slugClasses = classnames('break-word', {
      'gray': true
    })

    const slugErrorText = slugValid ? '&nbsp;' : NewChangelogStore.errors.slug || "You'll want this later, it can't be blank."

    return (
      <div className="mb2">
        <div onClick={this.handleEditClicked.bind(this)}>
          <div>
            <label htmlFor="new-changelog-url" className="mr1 pointer">
              URL: <span className="gray">changelog.assembly.com/..</span>
            </label>
          </div>
        </div>
        <div className={cs} style={{height: 'auto'}}>
        {
          true ? <input type="text"
            id="new-changelog-url"
            className="field-light block full-width"
            placeholder="Letters, numbers, and dashes only"
            value={NewChangelogStore.slug}
            onChange={this.handleFormChange.bind(this, 'slug')}
            onFocus={this.handleSlugOnFocus.bind(this)}
            ref="slug"
            style={{
              height: 'auto'
            }} /> : null
        }
        </div>
        <p className={`mb2 h5 ${slugValid ? 'gray' : 'red'}`} dangerouslySetInnerHTML={{__html: slugErrorText}} />
      </div>
    )
  }

  handleEditClicked() {
    this.setState({
      slugFieldExpanded: true
    })
  }

  toggleVisibility() {
    const { changelog } = this.props
    NewChangelogActions.formChange('is_members_only', !changelog.is_members_only)
  }

  handleSlugOnFocus() {
    NewChangelogActions.focusField('slug')
  }
}
