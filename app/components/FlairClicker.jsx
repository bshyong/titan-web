import React from 'react'
import TallyCounter from 'ui/TallyCounter.jsx'
import {flair} from 'actions/FlairActions'
import {connect} from 'redux/react'
import Flair from 'components/Flair.jsx'

@connect(state => ({}))
export default class FlairClicker extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.object.isRequired,
    flairable: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(['default', 'big']),
  }

  static defaultProps = {
    size: 'default',
  }

  render() {
    const { changelog, flairable, size } = this.props

    if (!changelog.flair_url || !changelog.user_is_team_member && flairable.flairs_count === 0) {
      return null
    }

    const image = (
      <Flair changelog={changelog}
        muted={!flairable.viewer_has_flaired}
        size={size === 'default' ? 16 : 20} />
    )

    return (
      <TallyCounter
        {...this.props}
        image={image}
        enabled={changelog.user_is_team_member}
        tally={flairable.flairs_count}
        onClick={this.handleClick.bind(this)} />
    )
  }

  handleClick(e) {
    const action = flair(this.props.flairable)
    this.props.dispatch(action)
  }
}
