import React from 'react'
import Clipboard from 'react-zeroclipboard'
import Button from 'ui/Button.jsx'

const Timeout = 1200

export default class ChangelogInviteLink extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.object.isRequired,
    onReset: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    onReset: function() {}
  }

  constructor(props) {
    super(props)
    this.state = {
      copied: false,
      timeout: null,
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  render() {
    return (
      <div className="flex flex-center field-light overflow-hidden mb1">
        <div className="flex-auto">
          <input
            className="border-none full-width px1 truncate"
            style={{outline: 'none'}}
            value={this.url()}
            onClick={e => e.target.select()}
            ref="inviteLink"
            readOnly
           />
        </div>
        <Clipboard
          text={this.url()}
          onAfterCopy={this.handleAfterCopy.bind(this)}>
           <div className="pointer flex-none px2 py1 border-left border-silver center bg-whitesmoke orange">
             {this.state.copied ? 'Copied' : 'Copy'}
           </div>
        </Clipboard>
      </div>
    )
  }

  url() {
    const { changelog } = this.props
    return `${MAIN_HOST}/invitations/${changelog.invite_hash}`
  }

  handleAfterCopy() {
    this.setState({
      copied: true,
      timeout: setTimeout(() => {
        this.setState({copied: false})
      }, Timeout)
    })
  }
}
