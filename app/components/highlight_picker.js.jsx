import React from 'react'
import Highlight from 'components/highlight.js.jsx'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import HighlightsStore from 'stores/highlights_store'
import {Link} from 'react-router'
import RouterContainer from 'lib/router_container'
import Icon from 'components/ui/icon.js.jsx'

export default class HighlightPicker extends React.Component {

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
    const highlights = this.state.highlights.map((highlight) => {
      return <div className="border-bottom" key={highlight.id} >
        <Highlight highlight={highlight} />
      </div>
    })

    return (
      <div className="bg-white">
        <div className="px2 py1 bg-light-gray">
          <Link to="new" params={{changelogId: changelogId}}>
            <Icon icon="angle-left" /> Back
          </Link>
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
}
