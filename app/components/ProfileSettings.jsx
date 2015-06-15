import authenticated from './mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'

@authenticated()
@connectToStores(ProfileStore)
export default class ProfileSettings extends React.Component {
  static getPropsFromStores(props) {
    return {
      errors: ProfileStore.updateErrors,
      profile: ProfileStore.user,
      updateSuccessful: ProfileStore.updateSuccessful
    }
  }

  static willTransitionTo() {
    ProfileActions.fetch()
  }

  componentWillReceiveProps(next) {
    if (!this.props.profile && next.profile) {
      this.setState({
        blurb: {
          value: next.profile.blurb
        },
        email: {
          value: next.profile.email
        },
        username: {
          value: next.profile.username
        }
      })
    } else {
      if (!this.props.updateSuccessful && next.updateSuccessful) {
        let change = {}
        for (var k of Object.keys(this.state)) {
          change[k] = {
            value: this.state[k].value,
            dirty: false
          }
        }
        this.setState(change)
      }
    }
  }

  render() {
    if (!this.props.profile) {
      return <div />
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="mb2">
            <label>
              Email
              <input className={this.fieldClasses('email')}
                type="email" value={this.state.email.value}
                onChange={this.handleChange('email').bind(this)} />
            </label>
          </div>

          <div className="mb2">
            <label>
              Blurb
              <input className={this.fieldClasses('blurb')}
                type="text" value={this.state.blurb.value}
                onChange={this.handleChange('blurb').bind(this)}
                placeholder="Short blurb about yourself" />
            </label>
          </div>

          <Button action={this.handleSubmit.bind(this)}>Save Settings</Button>
          {this.renderStatus()}
        </form>
      </div>
    )
  }

  renderStatus() {
    if (this.props.updateSuccessful) {
      return <span className="ml1 green">Update successful</span>
    }
    if (this.props.updateSuccessful === false) {
      if (this.props.errors.username == 'has already been taken') {
        return <span className="ml1 red">Username has been taken</span>
      }
      return <span className="ml1 red">Update failed</span>
    }
    return null
  }

  fieldClasses(field) {
    return classnames("block full-width field-light", {
      "is-warning": this.state[field].dirty,
      "is-error": (this.props.errors && this.props.errors[field])
    })
  }

  handleChange(field) {
    return (e) => {
      let change = {}
      change[field] = {
        dirty: true,
        value: e.target.value
      }
      this.setState(change)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    let change = {}
    for (let field in this.state) {
      if (this.state[field].dirty) {
        change[field] = this.state[field].value
      }
    }
    ProfileActions.update(change)
  }
}
