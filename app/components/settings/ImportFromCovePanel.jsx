import * as importActions from 'actions/ImportActions'
import Button from 'ui/Button.jsx'
import ChangelogActions from 'actions/changelog_actions'
import ChangelogStore from 'stores/changelog_store'
import classnames from 'classnames'
import connectToStores from 'lib/connectToStores.jsx'
import moment from 'moment'
import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'redux/react'

export class ImportFromCovePanel extends React.Component {
  static propTypes = {
    changelog: PropTypes.object,
    errors: PropTypes.array,
    importProject: PropTypes.func.isRequired,
    successful: PropTypes.bool,
    updating: PropTypes.bool,
  }

  render() {
    const { changelog } = this.props
    const disabled = this.props.updating || this.importing()
    if (!changelog) {
      return <div />
    }
    return <div>
      <h4 className="mt0 mb0 bold">Import from Assembly V1</h4>
      <p className="gray">Import your bounties, posts and comments from Assembly V1.</p>

      <form onSubmit={this.handleSubmit.bind(this)} className="mr3" ref="form">
        <div className="mb2">
          <h4 className="bold">Project URL</h4>

          <input className={this.fieldClasses('url')} type="text"
            defaultValue={changelog.import_url}
            disabled={disabled} ref="url"
            placeholder="https://assembly.com/my-project" />
        </div>

        <Button disabled={disabled}>
          {disabled ? 'Processing...' : 'Start Import'}
        </Button>
        {this.renderStatus()}
      </form>
    </div>
  }

  renderStatus() {
    const { errors, successful } = this.props
    const { changelog } = this.props
    const importing = this.importing()

    if (successful === false) {
      return <span className="ml1 red">
        {errors && errors.url}
      </span>
    }
    if (importing) {
      return <span className="ml1 gray">
        Import started {moment(changelog.import_started_at).fromNow(true)} ago
      </span>
    }
    if (changelog.import_completed_at) {
      return <span className="ml1 gray">
        Import completed {moment(changelog.import_completed_at).fromNow(true)} ago
      </span>
    }
    return null
  }

  fieldClasses(field) {
    return classnames("block full-width field-light", {
      "is-error": (this.props.errors && this.props.errors[field])
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    let value = React.findDOMNode(this.refs.url).value
    this.props.importProject(this.props.changelog.id, value)
  }

  importing() {
    const { changelog } = this.props
    return changelog.import_started_at && !changelog.import_completed_at
  }
}

@connect(state => ({
  errors: state.changelogImport.errors,
  updating: state.changelogImport.updating,
  successful: state.changelogImport.successful
}))
export default class ImportContainer extends React.Component {
  render() {
    const { errors, updating, changelog, successful, dispatch } = this.props
    return <ImportFromCovePanel
      changelog={changelog}
      errors={errors}
      updating={updating}
      successful={successful}
      {...bindActionCreators(importActions, dispatch)} />
  }
}
