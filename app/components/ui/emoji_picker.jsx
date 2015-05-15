import React from 'react'
import Icon from 'components/ui/icon.js.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import SessionStore from 'stores/session_store'

export default class BlurbBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false, text: this.props.text}
    this.changeShow = this.changeShow.bind(this)
  }

  changeShow() {
    var authed = SessionStore.user.username == this.props.owner
    if (authed) {
      this.setState({show: !this.state.show})
    }

  }

  render() {
    var blurbEditButton = <Icon icon='edit' fw={true} />
    if(this.state.show) {
      return (
        <div>
          <MarkdownArea
            id={"blurb"}
            placeholder={this.state.text}
            ref="body"/>
          <div onClick={this.changeShow}>
            {blurbEditButton}
          </div>
        </div>
      )
    }
    else {
      return (
        <div onClick={this.changeShow}>
          {this.state.text}
          <div onClick={this.changeShow}>
            {blurbEditButton}
          </div>
        </div>
      )
    }
  }
}

EmojiPicker.propTypes = {
  text: React.PropTypes.object.string,
  owner: React.PropTypes.object.string
}
