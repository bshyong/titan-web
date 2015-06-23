import Button from '../../ui/Button.jsx'
import ChangelogActions from '../../actions/changelog_actions'
import ChangelogStore from '../../stores/changelog_store'
import connectToStores from '../../lib/connectToStores.jsx'
import classnames from 'classnames'
import React from 'react'

@connectToStores(ChangelogStore)
export default class CustomDomainSettingsPanel extends React.Component {
  static getPropsFromStores() {
    return {
      changelog: ChangelogStore.changelog,
      errors: ChangelogStore.errors,
      saving: ChangelogStore.saving,
      updateSuccessful: ChangelogStore.updateSuccessful
    }
  }

  render() {
    if (!this.props.changelog) {
      return <div />
    }
    return <div>
      <h4 className="mt0 mb0 bold">Custom Domain</h4>
      <p className="gray">You can configure changelogs to run on your own domain.</p>

      <form onSubmit={this.handleSubmit.bind(this)} className="mr3">
        <div className="mb2">
          <h4 className="bold">Domain</h4>

          <input className={this.fieldClasses('domain')} type="text"
            defaultValue={this.props.changelog.domain}
            ref="domain" placeholder="changelog.mycompany.com" />
        </div>

        <Button action={this.handleSubmit.bind(this)} disabled={this.props.saving}>
          {this.props.saving ? 'Processing...' : 'Set domain'}
        </Button>
        {this.renderStatus()}
      </form>
      {this.renderInstructions()}
    </div>
  }

  renderInstructions() {
    if (!this.props.changelog.cname_target) {
      return
    }

    return (
      <p className="gray">Use your DNS provider to create a CNAME to {this.props.changelog.cname_target}.</p>
    )
  }

  renderStatus() {
    if (this.props.updateSuccessful) {
      return <span className="ml1 green">Update successful</span>
    }
    if (this.props.updateSuccessful === false) {
      return <span className="ml1 red">{this.props.errors && this.props.errors.domain}</span>
    }
    return null
  }

  handleSubmit(e) {
    e.preventDefault()
    let value = React.findDOMNode(this.refs.domain).value
    ChangelogActions.update(this.props.changelog.id, { domain: value })
  }

  fieldClasses(field) {
    return classnames("block full-width field-light", {
      "is-error": (this.props.errors && this.props.errors[field])
    })
  }
}
