import React from 'react'
import Highlight from 'components/highlight.js.jsx'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import HighlightsStore from 'stores/highlights_store'
import {Link} from 'react-router'

export default class HighlightPicker extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      highlights: HighlightsStore.all()
    }
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    // HighlightsActionCreator.fetchAll('assembly')
    HighlightsStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    HighlightsStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {highlights} = this.state
    let card

    if (highlights.length > 0) {
      card = <Highlight highlight={highlights[0]} />
    } else {
      card = <div className="flex-auto flex-center">
        <Link to="new">Done!</Link>
      </div>
    }

    return (
      <div className="flex flex-column absolute top-0 bottom-0 left-0 right-0 bg-light-gray p2 ">
        {card}
      </div>
    )
  }

  _onStoreChange() {
    this.setState({
      highlights: HighlightsStore.all()
    })
  }
}
