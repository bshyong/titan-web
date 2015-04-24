require('basscss/css/basscss.css')
import AuthenticatedComponent from 'components/authenticated_component.js.jsx'
import Avatar from 'components/avatar.js.jsx'
import Button from 'components/ui/button.js.jsx'
import Highlight from 'components/highlight.js.jsx'
import HighlightsActionCreator from 'actions/highlights_action_creator'
import HighlightsStore from 'stores/highlights_store'
import StoriesActionCreator from 'actions/stories_action_creator'
import React from 'react'
import Textarea from 'react-textarea-autosize'
import Tile from 'components/ui/tile.js.jsx'

import {List} from 'immutable'

export default AuthenticatedComponent(class NewStory extends React.Component {
  constructor() {
    this.state = {
      body: '',
      highlights: []
    }
  }

  componentDidMount() {
    HighlightsStore.addChangeListener(this.onHighlightsChange.bind(this))
    HighlightsActionCreator.fetchAll(this.props.org.id)
  }

  componentWillUnmount() {
    HighlightsStore.removeChangeListener(this.onHighlightsChange)
  }

  render() {
    const {org} = this.props

    return (
      <div className="mxn2 mb3">
        <Tile>
          <div className="clearfix py2 px2">
            <div className="left">
              <Avatar user={this.props.user} size="2rem" />
            </div>
            <div className="px2 overflow-hidden">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <Textarea
                  className="full-width block field-light mb0"
                  placeholder="What did you ship?" onKeyDown={this.handleTextareaChange.bind(this)} onChange={this.handleTextareaChange.bind(this)}
                  value={this.state.body}
                  ref="body"
                  rows={1} />
                <div className="mt1">
                  {this.renderHighlights()}
                </div>
                {this.renderAction()}
              </form>
            </div>
          </div>

        </Tile>
      </div>
    )
  }

  renderHighlights() {
    const {highlights} = this.state

    return List(highlights).map((highlight) => {
      const handleHighlightAction = this.genHandleHighlightAction(highlight.content)

      return (
        <a className="block p1" href="#" onClick={handleHighlightAction}>
          <Highlight highlight={highlight} />
        </a>
      )
    })
  }

  renderAction() {
    if (this.state.body.length > 0) {
      return <div className="mt2">
        <Button>Post</Button>
      </div>
    }
  }

  onHighlightsChange() {
    this.setState({
      highlights: HighlightsStore.all()
    })
  }

  handleTextareaChange(e) {
    this.setState({body: this.refs.body.getDOMNode().value})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {org: {id: id}} = this.props
    StoriesActionCreator.create(id, {
      body: this.refs.body.getDOMNode().value,
    })
    this.setState({body: ''})
  }

  genHandleHighlightAction(text) {
    return (e) => {
      e.preventDefault()
      this.appendToBody(text)
    }
  }

  appendToBody(text) {
    this.setState({
      body: this.state.body + text
    })
  }

})
