import React from 'react'
import Icon from 'components/ui/icon.js.jsx'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import SessionStore from 'stores/session_store'
import ProfileActions from 'actions/profile_actions.js'

export default class BlurbBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false, text: this.props.text}
    this.changeShow = this.changeShow.bind(this)
    this.handleBodyChanged = this._handleBodyChanged.bind(this)
  }

  changeShow() {
    if(this.state.show) {
      var blurbtext = document.getElementById("textarea").value
      this.setState({text: blurbtext})
      ProfileActions.update_blurb(this.props.owner, blurbtext)
    }
    this.setState({show: !this.state.show})
  }

  _handleBodyChanged(e) {
    this.updateForm('body', e.target.value)
  }

  renderTextBox() {
    return (
      <textarea id="textarea" rows="2" cols="15">
        {this.state.text}
      </textarea>
    )
  }

  render() {
    var authed = SessionStore.user.username == this.props.owner
    var blurbEditButton = authed ? <Icon icon='edit' fw={true} /> : ""
    if(this.state.show) {
      return (
        <div>
          {this.renderTextBox()}
          <div onClick={this.changeShow}>
            {blurbEditButton}
          </div>
        </div>
      )
    }
    else {
      return (
        <div onClick={this.changeShow}>
          <div>
            {this.state.text}
          </div>
          <div onClick={this.changeShow}>
            {blurbEditButton}
          </div>
        </div>
      )
    }
  }
}

BlurbBox.propTypes = {
  text: React.PropTypes.object.string,
  owner: React.PropTypes.object.string
}
