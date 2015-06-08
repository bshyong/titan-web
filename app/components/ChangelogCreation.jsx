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
import shallowEqual from 'react-pure-render/shallowEqual'
import Stack from '../ui/Stack.jsx'
import Table from '../ui/Table.jsx'
import TextareaAutosize from 'react-textarea-autosize'

@connectToStores(ChangelogStore)
export default class ChangelogCreation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      logo_url: null,
      banner_url: null,
      name: null,
      tagline: null,
      slug: null,
      recently_typed: false
    }
  }

  static getPropsFromStores(props) {
    return {
      errors: ChangelogStore.errors
    }
  }

  render() {
    return <div>
      <div className="container py2">
        <div className="sm-col-8 mx-auto px2">
          <h2>Create a new changelog</h2>

          <div className="border-bottom border-smoke mb2">
            <div className="clearfix">
              Name
              <input type="text"
                className="full-width input-invisible border-bottom border-smoke mb2"
                placeholder="My Product"
                value={this.state.name}
                onChange={this.handleNameChange().bind(this)}
                ref="name"
                style={{
                  fontSize: '1.5rem',
                  height: 'auto'
                }} />
            </div>
            <br/>

            <div className="clearfix">
              URL
              <div className="flex flex-grow border-bottom" style={{fontSize: '1.5rem', height: 'auto'}}>
                changelog.assembly.com/
                <input type="text"
                  className="input-invisible border-smoke"
                  placeholder="my_changelog"
                  value={this.state.slug}
                  onChange={this.handleSlugChange().bind(this)}
                  ref="tagline"
                  style={{
                    fontSize: '1.5rem'
                  }} />
              </div>
            </div>
            <br/><br/>
            <div className="clearfix">
              Tagline
              <input type="text"
                className="full-width input-invisible border-bottom border-smoke mb2"
                placeholder="My Product's Tagline eg. 'Bigger than Big'"
                value={this.state.tagline}
                onChange={this.handleTaglineChange().bind(this)}
                ref="tagline"
                style={{
                  fontSize: '1.5rem',
                  height: 'auto'
                }} />
            </div>

          </div>
          {this.renderCreateButton()}
        </div>
      </div>
    </div>
  }

  renderCreateButton() {
    let valid = this.state.name != null
    let onPublish=this.handlePublish.bind(this)
    let err = this.props.errors

    if (!err || this.state.recently_typed) {
      return (
        <div className="sm-col-4 mx-auto">
          <Button style="outline"
            block={true}
            color={"orange"}
            disabled={!valid}
            action={valid ? onPublish : null}>
            Create Changelog
          </Button>
        </div>
      )
    } else if (err['slug']=="has already been taken" && !this.state.recently_typed) {
      return (
      <div className="sm-col-4 mx-auto">
        <Button style="outline"
          block={true}
          color={"orange"}
          disabled={true}>
          URL is taken
        </Button>
      </div>
      )
    }


  }

  NameChange(e) {
    this.setState({name: e.target.value, recently_typed: true})
  }

  handleNameChange(e) {
    return (e) => this.NameChange(e)
  }

  TaglineChange(e) {
    this.setState({tagline: e.target.value, recently_typed: true})
  }

  handleTaglineChange(e) {
    return (e) => this.TaglineChange(e)
  }

  handleSlugChange(e) {
    return (e) => this.SlugChange(e)
  }

  SlugChange(e) {
    this.setState({slug: e.target.value, recently_typed: true})
  }

  handlePublish() {
    let name = this.state.name
    let tagline = this.state.tagline
    let slug = this.state.slug
    this.setState({recently_typed: false})
    ChangelogActions.create(name, tagline, slug)
  }
}
