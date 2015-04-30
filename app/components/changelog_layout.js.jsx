import {Link, RouteHandler} from 'react-router'
import classnames from 'classnames'
import ChangelogActions from 'actions/changelog_actions'
import ChangelogStore from 'stores/changelog_store'
import React from 'react'
import RouterContainer from 'lib/router_container'

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

    const color = "black"
    const bg = "white"
    const cn = classnames("py2 border-bottom", `bg-${bg}`, color)
    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return (
      <div>
        <div className={cn}>
          <div className="container sm-col-8 clearfix">
            <h3 className="mt0 mb0 left" style={{lineHeight: '2.5rem'}}>
              {this.state.changelog.name}
            </h3>

            <div className="right">
              <Link className="block py1 px2" to="highlights" params={{changelogId: changelogId}}>Write</Link>
            </div>
          </div>
        </div>
        <div className="container sm-col-8 relative">
          <RouteHandler />
        </div>
      </div>
    )
  }

  _onChange() {
    this.setState({ changelog: ChangelogStore.changelog })
  }
}
