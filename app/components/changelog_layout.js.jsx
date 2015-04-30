import {Link, RouteHandler} from 'react-router'
import classnames from 'classnames'
import ChangelogActions from 'actions/changelog_actions'
import ChangelogStore from 'stores/changelog_store'
import React from 'react'
import RouterContainer from 'lib/router_container'
import Navbar from 'components/ui/navbar.js.jsx'

export default class ChangelogLayout extends React.Component {
  constructor() {
    this.state = {
      changelog: ChangelogStore.changelog
    }
    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    ChangelogActions.select(RouterContainer.get().getCurrentParams().changelogId)
    ChangelogStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    ChangelogStore.removeChangeListener(this._onChange)
  }

  render() {
    if (!this.state.changelog) {
      return <div />
    }

    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return (
      <div>
        <Navbar>
          <h3 className="flex-auto mt0 mb0" style={{lineHeight: '2.5rem'}}>
            {this.state.changelog.name}
          </h3>

          <div className="flex-none">
            <Link className="block py1 px2" to="highlights" params={{changelogId: changelogId}}>Write</Link>
          </div>
        </Navbar>
        <div className="container">
          <RouteHandler />
        </div>
      </div>
    )
  }

  _onChange() {
    this.setState({ changelog: ChangelogStore.changelog })
  }
}
