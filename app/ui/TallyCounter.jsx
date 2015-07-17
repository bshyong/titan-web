import React from 'react'
import classnames from 'classnames'

export default class TallyCounter extends React.Component {
  static propTypes = {
    orientation: React.PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    size: React.PropTypes.oneOf(['default', 'big']).isRequired,
    enabled: React.PropTypes.bool.isRequired,
    tally: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    orientation: 'horizontal',
    size: 'default',
    enabled: true,
    tally: 0,
  }

  render() {
    const { orientation, enabled, size } = this.props

    const cs = {
      root: classnames('clicker', 'flex flex-center gray', {
        'clicker--enabled': enabled,
        'flex-column': orientation === 'vertical',
        'h3': size === 'big',
      }),
      image: classnames('clicker-image', {
        'pointer': enabled,
        'mr1': orientation === 'horizontal',
        'mb1': orientation === 'vertical',
      })
    }

    return (
      <div className={cs.root}>
        <div className={cs.image} onClick={this.handleClick.bind(this)}>
          {this.props.image}
        </div>
        {this.renderTally()}
      </div>
    )
  }

  renderTally() {
    const { tally } = this.props

    if (tally === 0) {
      return
    }

    return (
      <div>{tally}</div>
    )
  }

  handleClick(e) {
    if (!this.props.enabled) {
      return
    }
    this.props.onClick(e)
  }
}
