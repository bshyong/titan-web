import React from 'react'
import Button from 'components/ui/button.js.jsx'
import Editor from 'components/editor.js.jsx'
import Icon from 'components/ui/icon.js.jsx'
import HighlightsStore from 'stores/highlights_store'
import EditorStore from 'stores/editor_store'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import StoriesActionCreator from 'actions/stories_action_creator'
import {Link} from 'react-router'

export default class Playground extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      public: false,
      highlights: HighlightsStore.all(),
      text: EditorStore.text
    }

    this.handleTogglePrivacy = this._handleTogglePrivacy.bind(this)
    this.handlePublish = this._handlePublish.bind(this)

    this.onStoreChange = this._onStoreChange.bind(this)

    this.canPublish = this._canPublish.bind(this)
  }

  componentDidMount() {
    HighlightsStore.addChangeListener(this.onStoreChange)
    EditorStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    HighlightsStore.removeChangeListener(this.onStoreChange)
    EditorStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {highlights} = this.state

    let highlightsLink

    if (highlights.length > 0) {
      highlightsLink = <Link to="highlights" className="block left p1 blue">
        {highlights.length} highlights
      </Link>
    }

    return (
      <div className="flex flex-column full-width absolute top-0 bottom-0">
        <div className="flex-auto flex bg-light-gray">
          <Editor />
        </div>

        <div className="clearfix border-top">
          <div className="left">

            <div className="clearfix">
              <a className="block left p1 black" onClick={this.handleTogglePrivacy} onTouchStart={this.handleTogglePrivacy}>
                <Icon icon={this.state.public ? 'globe' : 'lock'} fw={true} />
              </a>
              {highlightsLink}
            </div>

          </div>

          <div className="right">
            <Button bg="white" color={this.canPublish() ? 'green' : 'gray' } onClick={this.handlePublish}>Publish</Button>
          </div>
        </div>
      </div>
    )
  }

  _handleTogglePrivacy(e) {
    e.preventDefault()
    this.setState({public: !this.state.public})
  }

  _handlePublish(e) {
    e.preventDefault()
    StoriesActionCreator.publish('assembly', {
      body: this.state.text
    })
  }

  _onStoreChange() {
    this.setState({
      highlights: HighlightsStore.all(),
      text: EditorStore.text
    })
  }

  _canPublish() {
    return this.state.text.length > 0
  }

}
