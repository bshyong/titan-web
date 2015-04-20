require('basscss/css/basscss.css')
import AuthenticatedComponent from 'components/authenticated_component.js.jsx'
import Avatar from 'components/avatar.js.jsx'
import Button from 'components/ui/button.js.jsx'
import PostsActionCreator from 'actions/posts_action_creator'
import React from 'react'
import Textarea from 'react-textarea-autosize'
import Tile from 'components/ui/tile.js.jsx'

export default AuthenticatedComponent(class NewPost extends React.Component {
  constructor() {
    this.state = {
      body: ''
    }
  }

  render() {
    return (
      <div className="mxn2 mb3">
        <Tile>
          <div className="clearfix py2 px2">
            <div className="left">
              <Avatar user={{username: this.props.user.username}} size="2rem" />
            </div>
            <div className="px2 overflow-hidden">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <Textarea
                  className="full-width block field-light mb0"
                  placeholder="What did you ship?" onKeyDown={this.handleTextareaChange.bind(this)} onChange={this.handleTextareaChange.bind(this)}
                  value={this.state.body}
                  ref="body"
                  rows={1} />
                <div className="clearfix mt2">
                  <div className="left mr1 sm-show">
                    <div className="h6 light-gray">Recently:</div>
                  </div>
                  <div className="overflow-hidden">
                    <ul className="list-reset">
                      <li className="left">
                        <a className="h6 px1 block" href="#" onClick={this.handleServiceClick.bind(this)}>
                          <span className="fa fa-github"></span> +12 <span className="sm-show-inline">commits</span>
                        </a>
                      </li>

                      <li className="left">
                        <a className="h6 px1 block" href="#">
                          <span className="fa fa-dropbox"></span> +6 <span className="sm-show-inline">files</span>
                        </a>
                      </li>

                      <li className="left">
                        <a className="h6 px1 block" href="#">
                          <span className="fa fa-twitter"></span> +2 tweets
                        </a>
                      </li>

                      <li className="left">
                        <a className="h6 px1 block" href="#">
                          <span className="fa fa-envelope"></span> +24 emails
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {this.renderAction()}
              </form>
            </div>
          </div>

        </Tile>
      </div>
    )
  }

  renderAction() {
    if (this.state.body.length > 0) {
      return <div className="mt2">
        <Button>Post</Button>
      </div>
    }
  }

  handleTextareaChange(e) {
    this.setState({body: this.refs.body.getDOMNode().value})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {org: {id: id}} = this.props
    PostsActionCreator.create(id, {
      body: this.refs.body.getDOMNode().value,
    })
    this.setState({body: ''})
  }

  handleServiceClick(e) {
    e.preventDefault()
    this.appendToBody("[assemblymade/meta#79a3474](https://github.com/assemblymade/meta/commit/79a3474f1eb17f72f44f0b64a624244de8621486)")
  }

  appendToBody(text) {
    this.setState({
      body: this.state.body + text
    })
  }

})
