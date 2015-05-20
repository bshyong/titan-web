import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import React from 'react'
import Highlight from './highlight.js.jsx'
import HighlightActions from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from './ui/icon.js.jsx'
import {Link} from 'react-router'
import {List} from 'immutable'
import RouterContainer from '../lib/router_container'
import ScrollPaginator from './ui/scroll_paginator.jsx'
import SessionStore from '../stores/session_store'
import shallowEqual from 'react-pure-render/shallowEqual'

@AuthenticatedMixin()
export default class HighlightPicker extends React.Component {

  constructor(props) {
    super(props)
    this.stores = [HighlightsStore]
    this.state = this.getStateFromStores()
    this.handleStoresChanged = this.handleStoresChanged.bind(this)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  getStateFromStores() {
    return {
      highlights: HighlightsStore.all(),
      page: HighlightsStore.page,
      moreAvailable: HighlightsStore.moreAvailable
    }
  }

  render() {
    const changelogId = RouterContainer.get().getCurrentParams().changelogId
    const filter = RouterContainer.get().getCurrentParams().filter
    const highlights = List(this.state.highlights)
      .filter(highlight => {
        if (filter != 'mine') { return true }

        return List(highlight.mentioned_users).some((user) => {
          return user.username == SessionStore.user.username
        })
      })
      .sortBy(highlight => highlight.occurred_at)
      .reverse()
      .map((highlight) => {
        return <div className="border-bottom" key={highlight.id} >
          <Highlight highlight={highlight} />
        </div>
      })

    return (
      <div className="bg-white">
        {this.state.moreAvailable ?
          <ScrollPaginator page={this.state.page}
            onScrollBottom={() => HighlightActions.fetchAll(this.props.changelogId, this.state.page + 1)} /> : null}

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
        {highlights}
      </div>
    )
  }

  // Stores mixin
  componentWillMount() {
    this.stores.forEach(store =>
      store.addChangeListener(this.handleStoresChanged)
    );
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!shallowEqual(nextProps, this.props)) {
  //     this.setState(getState(nextProps));
  //   }
  // }

  componentWillUnmount() {
    this.stores.forEach(store =>
      store.removeChangeListener(this.handleStoresChanged)
    );
  }

  handleStoresChanged() {
    this.setState(this.getStateFromStores(this.props));
  }
}
