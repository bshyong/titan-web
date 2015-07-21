import { connect } from 'redux/react'
import Button from 'ui/Button.jsx'
import Icon from 'ui/Icon.jsx'
import LimitedTextarea from 'ui/LimitedTextarea.jsx'
import React, { Component, PropTypes } from 'react'
import TweetFormError from 'components/Social/TweetFormError.jsx'

const TWEET_LENGTH = 140

@connect(state => ({
  text: state.tweetForm.text,
}))
export default class TweetForm extends Component {
  static propTypes = {
    text: PropTypes.string,
    tweetFormChange: PropTypes.func.isRequired,
    tweetFormDismiss: PropTypes.func.isRequired,
    tweetFormError: PropTypes.func.isRequired,
    tweetFormSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
    this.handleTweet = this._handleTweet.bind(this)
    this.handleSkip = this._handleSkip.bind(this)
  }

  render() {
    return (
      <div className="flex">
        <div className="flex-none sm-col-6 mx-auto py4">
          <div className="twitter-blue h1">
            <Icon icon="twitter" />
          </div>
          <h2 className="mt0">
            Go ahead, tell the world.
          </h2>
          <TweetFormError />
          <form>
            <div className="py1">
              <LimitedTextarea allowOverflow={true}
                limit={140}
                className="field-light full-width"
                style={{ resize: 'none' }}
                value={this.props.text}
                onChange={this.handleChange}
                rows={4} />
            </div>

            <div className="py1 right">
              <Button size="big"
                bg="twitter-blue"
                color="white"
                action={this.handleTweet}>
                Tweet
              </Button>
            </div>

            <div className="py1 right mr1">
              <Button
                size="big"
                style="outline"
                color="twitter-blue"
                action={this.handleSkip}>
                Skip
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  _handleChange(e) {
    this.props.tweetFormChange(e.target.value)
  }

  _handleSkip(e) {
    e.preventDefault()
    this.props.tweetFormDismiss()
  }

  _handleTweet(e) {
    e.preventDefault()
    const {
      text,
      tweetFormError,
      tweetFormSubmit,
    } = this.props

    if (LimitedTextarea.getLength(text, true) > TWEET_LENGTH) {
      return tweetFormError(new Error('Your tweet is too long!'))
    }

    tweetFormSubmit(text)
  }
}
