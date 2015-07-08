import {bindActionCreators} from 'redux';
import {connect} from 'redux/react'
import * as storyActions from 'actions/storyActions'
import React, {PropTypes} from 'react'

export class FlagStory extends React.Component {
  static propTypes = {
    changelogId: PropTypes.object.isRequired,
    story: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.story.flagged_at) {
      return <a className="pointer" onClick={this.unfeature.bind(this)}>Un-flag post</a>
    }
    return <a className="pointer" onClick={this.feature.bind(this)}>Flag post</a>
  }

  feature() {
    this.update({flagged_at: new Date()})
  }

  unfeature() {
    this.update({flagged_at: null})
  }

  update(params) {
    this.props.update(this.props.changelogId, this.props.story.id, params)
  }
}

@connect(state => ({}))
export default class FlagStoryWrapper extends React.Component {
  render() {
    return <FlagStory {...this.props}
                        {...bindActionCreators(storyActions, this.props.dispatch)} />
  }
}
