import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import Highlight from 'components/Highlight.jsx'
import HighlightActions from 'actions/highlight_actions'
import HighlightsStore from 'stores/highlights_store'
import Icon from 'ui/Icon.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import ScrollPaginator from 'ui/ScrollPaginator.jsx'
import SessionStore from 'stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'
import Link from 'components/Link.jsx'
import {List} from 'immutable'

@AuthenticatedMixin()
@connectToStores(HighlightsStore)
export default class HighlightPicker extends React.Component {
  static getPropsFromStores(props) {
    return {
      highlights: HighlightsStore.all(),
      page: HighlightsStore.page,
      moreAvailable: HighlightsStore.moreAvailable
    }
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  constructor(props) {
    super(props)

    this.onScrollBottom = this._onScrollBottom.bind(this)
  }

  render() {
    const changelogId = this.props.changelogId

    return (
      <div className="bg-white">
        {this.renderPaginator()}
        <div className="px2 py1 bg-light-gray clearfix">
          <div className="left">
            <Link to="changelog" params={{changelogId: changelogId}}>
              <Icon icon="angle-left" /> Back
            </Link>
          </div>
          <div className="right px2">
            <Link to="highlights" params={{changelogId: changelogId}}>
              All Highlights
            </Link>
          </div>
          <div className="right">
            <Link to="highlights" params={{changelogId: changelogId, filter: 'mine'}}>
              Mine
            </Link>
          </div>
        </div>
        {this.renderHighlights()}
      </div>
    )
  }

  renderHighlights() {
    const filter = RouterContainer.get().getCurrentParams().filter
    return List(this.props.highlights).filter(highlight => {
      if (filter !== 'mine') { return true }

      return List(highlight.mentioned_users).some((user) => {
        return user.username === SessionStore.user.username
      })
    }).sortBy(highlight => -highlight.occurred_at).map((highlight) => {
      return (
        <div className="border-bottom" key={`highlight-${highlight.id}`}>
          <Highlight highlight={highlight} />
        </div>
      )
    })
  }

  renderPaginator() {
    if (this.props.moreAvailable) {
      return <ScrollPaginator page={this.props.page}
        onScrollBottom={this.onScrollBottom} />
    }
  }

  _onScrollBottom() {
    HighlightActions.fetchAll(this.props.changelogId, this.props.page + 1)
  }
}
