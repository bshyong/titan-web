import ChangelogCard from './Changelog/ChangelogCard.jsx'
import Link from '../components/Link.jsx'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import Subheader from 'ui/Subheader.jsx'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import * as changelogActions from 'actions/changelogActions'
import LoadingBar from 'ui/LoadingBar.jsx'

export class Dashboard extends React.Component {
  static propTypes = {
    featured: React.PropTypes.object,
    following: React.PropTypes.object,
  }

  render() {
    const { featured, page, moreAvailable } = this.props
    return (
      <div>
        <Subheader text="Trending Groups Co-Creating Products" />
        <div className="sm-flex flex-wrap mxn2">
          {(featured || []).map((changelog, i) =>
            <div className="sm-col-4 p2" key={changelog.id + i}>
              <Link to="changelog" params={paramsFor.changelog(changelog)}>
                <ChangelogCard changelog={changelog} />
              </Link>
            </div>
          )}
          {moreAvailable ? <ScrollPaginator page={page} onScrollBottom={this.fetchMore.bind(this)} /> : null}
        </div>
        <LoadingBar loading={moreAvailable} />
      </div>
    )
  }

  fetchMore() {
    const { page, per } = this.props
    this.props.fetchAll(page + 1, per)
  }
}


import {connect} from 'redux/react'
import {bindActionCreators} from 'redux'

@connect(state => {
  return {
    ...state.changelogs,
  }
})
export default class DashboardWrapper extends React.Component {
  render() {
    return <Dashboard {...this.props}
      {...bindActionCreators(changelogActions, this.props.dispatch)} />
  }
}
