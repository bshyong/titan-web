import Icon from 'ui/Icon.jsx'
import React from 'react'
import SessionStore from 'stores/session_store'
import TallyCounter from 'ui/TallyCounter.jsx'
import {toggleHeart} from 'actions/HeartActions'
import {connect} from 'redux/react'

@connect(state => ({}))
export default class Heart extends React.Component {
  static propTypes = {
    heartable: React.PropTypes.object.isRequired,
  }

  render() {
    const { heartable } = this.props
    const image = (
      <span style={{lineHeight: '14px', height: 14, overflow: 'hidden'}}>
        <Icon
          icon="heart"
          color={heartable.viewer_has_hearted ? 'orange' : null} />
      </span>
    )

    return (
      <TallyCounter
        {...this.props}
        image={image}
        tally={heartable.hearts_count}
        enabled={SessionStore.isSignedIn()}
        onClick={this.handleClick.bind(this)} />
    )
  }

  handleClick(e) {
    const action = toggleHeart(this.props.heartable)
    this.props.dispatch(action)
  }
}
