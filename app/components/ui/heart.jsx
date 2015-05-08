import 'stylesheets/heart.css'
import React from 'react'

export default class Heart extends React.Component {
  render() {
    var classes = 'svg-icon svg-icon-heart'

    if (this.props.hearted) {
      classes += ' red'
    }

    var fill = 'M5.8,18.5c-1.5-1.5-2.6-3.1-3.3-4.7c-0.6-1.6-0.8-3-0.6-4.3c0.2-1.3,0.8-2.4,1.8-3.4C5.2,4.6,6.9,3.9,9,3.9c3.2,0,5.6,1.7,7,3c1.4-1.3,3.9-3.1,7-3.1c2,0,3.7,0.7,5.2,2.2c1,1,1.6,2.1,1.8,3.4c0.2,1.3,0,2.7-0.6,4.3c-0.6,1.6-1.7,3.2-3.3,4.7L16,28.9L5.8,18.5z'
    var stroke = 'M23,5.6c1.6,0,2.8,0.5,4,1.7c0.7,0.7,1.1,1.5,1.3,2.5c0.2,1,0,2.1-0.5,3.3c-0.6,1.4-1.5,2.8-2.9,4.1L16,26.4l-8.9-9.1c-1.4-1.4-2.3-2.8-2.9-4.1c-0.5-1.2-0.7-2.4-0.5-3.3C3.9,8.9,4.3,8,5,7.3C6.1,6.2,7.4,5.7,9,5.7c4.3,0,7,3.9,7,3.9S18.8,5.6,23,5.6M23,2.1c-2.9,0-5.3,1.2-7,2.5c-1.7-1.3-4.1-2.5-7-2.5c-2.5,0-4.7,0.9-6.4,2.7c-1.2,1.2-2,2.7-2.3,4.3c-0.3,1.6-0.1,3.4,0.7,5.3c0.7,1.8,1.9,3.6,3.6,5.3l8.9,9.1l2.5,2.5l2.5-2.5l8.9-9.1c1.7-1.7,2.9-3.5,3.6-5.3c0.8-1.9,1-3.6,0.7-5.3c-0.3-1.6-1.1-3.1-2.3-4.3C27.7,3.1,25.5,2.1,23,2.1L23,2.1z'

    return (
      <a className="heart hover-red inline-block pointer" onClick={this.props.onClick}>
        <svg className={classes} viewBox="0 0 32 32">
          <g>
            <path className="path1" d={fill}></path>
            <path className="path2" d={stroke}></path>
          </g>
        </svg>

        {this.props.count > 0 ? <span className="gray ml1">{this.props.count}</span> : null}
      </a>
    )
  }
}

Heart.propTypes = {
  count: React.PropTypes.number.isRequired,
  hearted: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired,
}
