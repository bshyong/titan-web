import * as TweetFormActions from 'actions/TweetFormActions'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import React, { Component, PropTypes } from 'react'
import Scrim from 'ui/Scrim.jsx'
import TweetForm from 'components/Social/TweetForm.jsx'

@connect(state => ({
  shown: state.tweetScrim.shown,
}))
export default class TweetScrim extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shown: PropTypes.bool,
  }

  componentDidUpdate() {
    if (this.props.shown) {
      document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
    } else {
      document.getElementsByTagName('body')[0].style.overflowY = 'scroll'
    }
  }

  render() {
    const { shown } = this.props
    if (!shown) {
      return null
    }

    return (
      <Scrim>
        <TweetForm {...bindActionCreators(TweetFormActions, this.props.dispatch)} />
      </Scrim>
    )
  }
}
