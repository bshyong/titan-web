import authenticated from './mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import classnames from 'classnames'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from 'ui/Icon.jsx'
import ProfileActions from '../actions/profile_actions.js'
import ProfileStore from '../stores/profile_store.js'
import React from 'react'
import TwitterActions from 'actions/oauth/TwitterActions'

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

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleSubmit = this._handleSubmit.bind(this)
    this.linkTwitterAccount = this._linkTwitterAccount.bind(this)
    this.unlinkTwitterAccount = this._unlinkTwitterAccount.bind(this)
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
        },
        gif_url: {
          value: next.profile.gif_url
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
                onChange={this.handleChange('email')} />
            </label>
          </div>

          <div className="mb2">
            <label>
              Bio
              <input className={this.fieldClasses('blurb')}
                type="text" value={this.state.blurb.value}
                onChange={this.handleChange('blurb')}
                placeholder="Short bio about yourself" />
            </label>
          </div>

          <div className="mb2">
            <label>
              Profile GIF URL
              <input className={this.fieldClasses('gif_url')}
                type="text" value={this.state.gif_url.value}
                onChange={this.handleChange('gif_url')}
                placeholder="https://media.giphy.com/media/GehetVRdV5EAw/giphy.gif" />
            </label>
          </div>

          <Button action={this.handleSubmit}>Save Settings</Button>
          {this.renderStatus()}
        </form>

        <div className="mb2">
          <h4 className="mt3 bold">Connections</h4>
          {this.renderTwitterButton()}
        </div>
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

  renderTwitterButton() {
    const { profile: { twitter_username } } = this.props

    if (twitter_username) {
      return (
        <div className="clearfix">
          <div className="twitter-blue mr1 left">
            <Icon icon="twitter" />
          </div>
          <span className="darken-4">
            You're connected as
            {' '}<a href={`https://twitter.com/${twitter_username}`}>
              @{twitter_username}
            </a>.
          </span>
          <div className="clearfix">
            <a href="javascript:void(0)" onClick={this.unlinkTwitterAccount}>
              Disconnect
            </a>
          </div>
        </div>
      )
    }

    return (
      <Button size="default" bg="twitter-blue" action={this.linkTwitterAccount}>
        <Icon icon="twitter" />
        <span className="ml2 h5">Connect to Twitter</span>
      </Button>
    )
  }

  fieldClasses(field) {
    return classnames("block full-width field-light", {
      "is-warning": this.state[field].dirty,
      "is-error": (this.props.errors && this.props.errors[field])
    })
  }

  _handleChange(field) {
    return (e) => {
      let change = {}
      change[field] = {
        dirty: true,
        value: e.target.value
      }
      this.setState(change)
    }
  }

  _handleSubmit(e) {
    e.preventDefault()
    let change = {}
    for (let field in this.state) {
      if (this.state[field].dirty) {
        change[field] = this.state[field].value
      }
    }
    ProfileActions.update(change)
  }

  _linkTwitterAccount(e) {
    TwitterActions.signIn({ user_id: this.props.profile.id })
  }

  _unlinkTwitterAccount(e) {
    TwitterActions.unlink(this.props.profile.id)
  }
}
