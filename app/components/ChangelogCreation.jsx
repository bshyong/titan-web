import {List, Set} from 'immutable'
import { RouteHandler, Link } from 'react-router'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogActions from '../actions/changelog_actions'
import ChangelogStore from '../stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import moment from '../config/moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from '../ui/ScrollPaginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'

@connectToStores(ChangelogStore)
export default class ChangelogCreation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: null,
      tagline: null,
      slug: null,
      recently_typed: false,
      website: null
    }
  }

  static getPropsFromStores(props) {
    return {
      errors: ChangelogStore.errors,
      user: SessionStore.user
    }
  }

  render() {
    return (
      <div className="container">
        <div className="mx-auto">
          <div className="clearfix">
            {this.renderHeader()}
          </div>

          <div className="clearfix">
            <div className="sm-col-5 mx-auto">
              Name
              <input type="text"
                className="full-width border border-smoke mb2"
                placeholder="My Product"
                value={this.state.name}
                onChange={this.NameChange.bind(this)}
                ref="name"
                style={{
                  fontSize: '1rem',
                  height: 'auto'
                }} />
            </div>
          </div>
          {this.renderTaglinePicker()}
          {this.renderWebsiteUrlPicker()}

          <div className="clearfix">
            <div className="sm-col-5 mx-auto">
              {this.renderUrlForm()}
            </div>

            <div className="sm-col-3 right">
              {this.renderSlugMessage()}
            </div>

            <div className="clearfix sm-col-5 mx-auto py2">
              {this.renderCreateButton()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderTaglinePicker() {
    return (
      <div className="clearfix">
        <div className="sm-col-5 mx-auto">
          Tagline
          <input type="text"
            className="full-width border border-smoke mb2"
            placeholder="Bigger than Big"
            value={this.state.tagline}
            onChange={this.TaglineChange.bind(this)}
            ref="name"
            style={{
              fontSize: '1rem',
              height: 'auto'
            }} />
        </div>
      </div>
    )
  }

  renderWebsiteUrlPicker() {
    return (
      <div className="clearfix">
        <div className="sm-col-5 mx-auto">
          Website URL
          <input type="text"
            className="full-width border border-smoke mb2"
            placeholder="www.myproduct.com"
            value={this.state.website}
            onChange={this.WebsiteChange.bind(this)}
            ref="name"
            style={{
              fontSize: '1rem',
              height: 'auto'
            }} />
        </div>
      </div>
    )
  }

  renderUrlForm() {
    let css = "flex flex-grow full-width border border-smoke"
    if (this.slugError()) {
      css = "flex flex-grow full-width border border-smoke border-red"
    }
    return (
      <div>
        URL
        <div className={css} style={{fontSize: '1rem', height: 'auto'}}>
          <div className="ml1 mr3 py1">
            changelog.assembly.com/
          </div>
          <input type="text"
            className="input-invisible border border-smoke"
            placeholder="MyChangelog"
            value={this.state.slug}
            onChange={this.SlugChange.bind(this)}
            ref="tagline"
            style={{
              fontSize: '1rem',
              height: 'auto'
            }} />
        </div>
      </div>
    )
  }

  renderHeader() {
    return (
      <h2 className="py4 mx-auto center" style={{fontSize: '2rem'}}>
        Start a Changelog
      </h2>
    )
  }

  slugError() {
    let err = this.props.errors
    if (err) {
      if (err['slug'] == "has already been taken" && !this.state.recently_typed) {
        return true
      }
    }
    return false
  }

  renderSlugMessage() {
    let err = this.props.errors
    if (this.slugError())
      {
        return (
            <div className="red" style={{fontSize: '1rem'}}>
              * slug taken
            </div>
          )
      }
  }

  renderCreateButton() {
    let valid = this.state.name != null && this.state.slug != null
    let onPublish=this.handlePublish.bind(this)

    return (
      <div className="mx-auto mt3 block">
        <Button style="outline"
          block={true}
          color={"orange"}
          disabled={!valid}
          action={valid ? onPublish : null}>
          Create Changelog
        </Button>
      </div>
    )
  }

  sanitizeSlug(slugText) {
    let s = slugText.replace(/[|&;? $%@"<>/\()+,]/g, "");
    return s
  }

  NameChange(e) {
    this.setState({name: e.target.value})
  }

  TaglineChange(e) {
    this.setState({tagline: e.target.value, recently_typed: true})
  }

  SlugChange(e) {
    this.setState({slug: e.target.value, recently_typed: true})
  }

  WebsiteChange(e) {
    this.setState({website: e.target.value, recently_typed: true})
  }

  handlePublish() {
    let name = this.state.name
    let tagline = this.state.tagline
    let slug = this.sanitizeSlug(this.state.slug)
    let website = this.state.website
    let user_id = this.props.user.id
    this.setState({recently_typed: false})
    ChangelogActions.create(name, tagline, slug, user_id, website)
  }
}
