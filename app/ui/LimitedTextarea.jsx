import classnames from 'classnames'
import React, { Component, PropTypes } from 'react'

const LINK_REGEX = /http?s[\S]+/

export default class LimitedTextarea extends Component {
  static propTypes = {
    allowOverflow: PropTypes.bool,
    limit: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    shortenLinks: PropTypes.bool,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    allowOverflow: false,
    onChange: () => {},
    shortenLinks: true,
  }

  static getLength(s = '', shortenLinks = false) {
    if (shortenLinks) {
      // shorten links as on Twitter
      const match = s.match(LINK_REGEX)

      if (match && match[0].length > 22) {
        return s.replace(match[0], '').length + 22
      }
    }

    return s.length
  }

  constructor(props) {
    super(props)

    this.handleChange = this._handleChange.bind(this)
  }

  render() {
    return (
      <div className="clearfix">
        <textarea {...this.props} onChange={this.handleChange} />
        <div className="right">
          {this.renderRemainingCharacters()}
        </div>
      </div>
    )
  }

  renderRemainingCharacters() {
    const { limit, shortenLinks, value } = this.props
    const remaining = limit - LimitedTextarea.getLength(value, shortenLinks)
    const classes = classnames({
      gray: remaining >= 10,
      red: remaining < 10,
    })

    return (
      <div className={classes}>{remaining}</div>
    )
  }

  _handleChange(e) {
    const {
      allowOverflow,
      onChange,
      limit,
      shortenLinks,
    } = this.props
    if (LimitedTextarea.getLength(e.target.value, shortenLinks) > limit &&
        !allowOverflow) {
      return
    }

    onChange(e)
  }
}
