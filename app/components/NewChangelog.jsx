import { RouteHandler } from 'react-router'
import {List, Set} from 'immutable'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import RadioGroup from 'react-radio-group'
import React, {PropTypes} from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import Switch from '../ui/Switch.jsx'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'
import VisibilityToggler from '../components/VisibilityToggler.jsx'

export class NewChangelog extends React.Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    formChange: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    errors: PropTypes.array,
    successful: PropTypes.bool,
    updating: PropTypes.bool,
  }

  render() {
    return (
      <div className="md-col-7 mx-auto">
        {this.renderNameField()}
        {this.renderSlugField()}
    		{this.renderDescriptionField()}

        <div className="mb3">
          <VisibilityToggler ref="vis" changelog={this.props.fields.toJS()} onChange={this.handleVisibilityChanged.bind(this)} />
        </div>
      </div>
    )
  }

  handleFormChange(name, e) {
    this.props.formChange(name, e.target.value)
  }

  renderDescriptionField(){
    return (
      <div className="mb3">
        <label className="new-changelog-tagline bold">Tell everyone what it&#39;s about</label>
        <textarea
          id="new-changelog-tagline"
          className="field-light full-width block"
          placeholder="5 words or less is best"
          onChange={this.handleFormChange.bind(this, 'tagline')}
          ref="tagline"
          style={{
            fontSize: '1rem',
            height: 'auto'
          }} />
      </div>
    )
  }

  renderNameField() {
    const field = 'name'
    let error = this.props.errors && this.props.errors[field]
    if (error == 'required') {
      error = "We share your excitement but we need a name first."
    }
    const cs = classnames("flex full-width", {
      'is-error': error
    })

    return (
      <div className="mb2">
        <label className="bold">Name your Changelog</label>
        <div className={cs} style={{height: 'auto'}}>
          <input type="text"
            id="new-changelog-name"
            className="field-light full-width block"
            placeholder="Usually a company or product name"
            onChange={this.handleFormChange.bind(this, 'name')}
            ref="name"
            style={{height: 'auto'}} />
        </div>
        <div className="red h5">{error}</div>
      </div>
    )
  }

  renderSlugField() {
    const field = 'slug'
    const error = this.props.errors && this.props.errors[field]

    const cs = classnames("flex full-width", {
      'is-error': error
    })

    const slugClasses = classnames('break-word', {
      'gray': true
    })

    return (
      <div className="mb2">
        <div>
          <div>
            <label className="bold mr1 pointer">
              URL: <span className="gray">assembly.com/..</span>
            </label>
          </div>
        </div>
        <div className={cs} style={{height: 'auto'}}>
        {
          true ? <input type="text"
            id="new-changelog-url"
            className="field-light block full-width"
            placeholder="Letters, numbers, and dashes only"
            value={this.props.fields.get('slug')}
            onChange={this.handleFormChange.bind(this, 'slug')}
            ref="slug"
            style={{
              height: 'auto'
            }} /> : null
        }
        </div>
        <p className={`mb2 h5 ${error ? 'red' : 'gray'}`}>{error}</p>
      </div>
    )
  }

  handleVisibilityChanged(state) {
    const { formChange, fields } = this.props
    formChange('is_members_only', state === 'private')
  }
}

import * as newChangelogActions from 'actions/newChangelogActions'
import {bindActionCreators} from 'redux';
import {connect} from 'redux/react'

@connect(state => ({
  errors: state.newChangelog.errors,
  updating: state.newChangelog.updating,
  successful: state.newChangelog.successful,
  fields: state.newChangelog.fields
}))
export default class NewChangelogContainer extends React.Component {
  render() {
    return <NewChangelog
      {...this.props}
      {...bindActionCreators(newChangelogActions, this.props.dispatch)} />
  }
}
