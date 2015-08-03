import ChangelogCard from './Changelog/ChangelogCard.jsx'
import Link from '../components/Link.jsx'
import paramsFor from '../lib/paramsFor'
import React from 'react'
import Subheader from 'ui/Subheader.jsx'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import * as changelogActions from 'actions/changelogActions'
import LoadingBar from 'ui/LoadingBar.jsx'
import Button from 'ui/Button.jsx'

export class Dashboard extends React.Component {
  static propTypes = {
    featured: React.PropTypes.object,
    following: React.PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.fetchMore = this.fetchMore.bind(this)
  }

  render() {
    const { featured, fetching } = this.props
    return (
      <div>
        <Subheader text="Trending Groups Co-Creating Products" />
        <div className="sm-flex flex-wrap mxn2">
          {(featured || []).map((changelog, i) =>
            <div className="sm-col-12 p2" key={changelog.id + i}>
              <Link to="changelog" params={paramsFor.changelog(changelog)}>
                <ChangelogCard changelog={changelog} />
              </Link>
            </div>
          )}
        </div>
        <LoadingBar loading={fetching} />
        {this.renderPagination()}
      </div>
    )
  }

  renderPagination() {
    const { moreAvailable, page, fetchAll, per } = this.props

    if (!moreAvailable) { return null }

    if (page === 1) {
      return <div>
        <Button action={fetchAll.bind(this, 2, per)} style="solid" size="big" block={true}>
          Load more
        </Button>
      </div>
    } else {
      return <ScrollPaginator page={page} onScrollBottom={this.fetchMore} />
    }
  }

  fetchMore() {
    const { page, per, fetchAll } = this.props
    fetchAll(page + 1, per)
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
