import React from 'react'
import Textarea from 'react-textarea-autosize'

import Button from './ui/button.js.jsx'
import PostsActionCreator from '../actions/posts_action_creator'

const NewPost = React.createClass({

  getInitialState() {
    return {
      body: ''
    }
  },

  render() {
    return <form onSubmit={this.handleSubmit}>
      <input className="full-width block field-light mb1" type="text" placeholder="GitHub username (this is until we have auth)" ref="username" />
      <Textarea className="full-width block field-light mb0" placeholder="What did you do?" onKeyDown={this.handleTextareaChange} onChange={this.handleTextareaChange} value={this.state.body} ref="body"></Textarea>
        <div className="clearfix">
          <div className="left py1 mr1">
            <div className="h6 light-gray">Recently:</div>
          </div>
          <div className="overflow-hidden">
            <ul className="list-reset">
              <li className="left">
                <a className="h6 p1 block" href="#" onClick={this.handleServiceClick}>
                  <span className="fa fa-github"></span> +12 commits
                </a>
              </li>

              <li className="left">
                <a className="h6 p1 block" href="#">
                  <span className="fa fa-dropbox"></span> +6 files
                </a>
              </li>

              <li className="left">
                <a className="h6 p1 block" href="#">
                  <span className="fa fa-twitter"></span> +2 tweets
                </a>
              </li>

              <li className="left">
                <a className="h6 p1 block" href="#">
                  <span className="fa fa-envelope"></span> +24 emails
                </a>
              </li>
            </ul>
          </div>
        </div>
      {this.renderAction()}
    </form>
  },

  renderAction() {
    if (this.state.body.length < 2) {
      return
    }
    return <div className="mt2">
      <Button>Post</Button>
    </div>
  },

  handleTextareaChange(e) {
    this.setState({body: this.refs.body.getDOMNode().value})
  },

  handleSubmit(e) {
    e.preventDefault()
    PostsActionCreator.create('8ace1942-bfc3-4d2e-95dc-8882785cf7f4', {
      body: this.refs.body.getDOMNode().value,
      username: this.refs.username.getDOMNode().value
    })
    this.setState({body: ''})
  },

  handleServiceClick(e) {
    e.preventDefault()
    this.appendToBody("[assemblymade/meta#79a3474](https://github.com/assemblymade/meta/commit/79a3474f1eb17f72f44f0b64a624244de8621486)")
  },

  appendToBody(text) {
    this.setState({
      body: this.state.body + text
    })
  }

})

export default NewPost
