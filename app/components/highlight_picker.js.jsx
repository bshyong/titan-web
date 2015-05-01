import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import React from 'react'
import Highlight from 'components/highlight.js.jsx'
import HighlightsActionCreator from 'actions/highlight_actions'
import HighlightsStore from 'stores/highlights_store'
import Icon from 'components/ui/icon.js.jsx'
import {Link} from 'react-router'
import {List} from 'immutable'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'

export default AuthenticatedMixin(class HighlightPicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      highlights: HighlightsStore.all()
    }
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    HighlightsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    HighlightsStore.removeChangeListener(this.onStoreChange)
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
      .sortBy(highlight => Date.parse(highlight.occurred_at || highlight.created_at))
      .reverse()
      .map((highlight) => {
        return <div className="border-bottom" key={highlight.id} >
          <Highlight highlight={highlight} />
        </div>
      })

    return (
      <div className="bg-white">
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

  _onStoreChange() {
    this.setState({
      highlights: HighlightsStore.all()
    })
  }
})
