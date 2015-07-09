import {bindActionCreators} from 'redux';
import {connect} from 'redux/react'
import * as storyActions from 'actions/storyActions'
import React, {PropTypes} from 'react'

export class StoryBooster extends React.Component {
  static propTypes = {
    changelogId: PropTypes.object.isRequired,
    story: PropTypes.object.isRequired,
  }

  render() {
    const { story } = this.props
    return (
      <div>
        <label className="mr1">Boost</label>
        <input type="number" step="0.1" className="field field-light"
          value={story.boost} onChange={this.handleChange.bind(this)} />
      </div>
    )
  }

  handleChange(e) {
    this.props.update(this.props.changelogId, this.props.story.id, {boost: e.target.value})
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
export default class StoryBoosterWrapper extends React.Component {
  render() {
    return <StoryBooster {...this.props}
                        {...bindActionCreators(storyActions, this.props.dispatch)} />
  }
}
