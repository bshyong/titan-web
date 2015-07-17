import React from 'react'

export default class Flair extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.shape({
      logo_url: React.PropTypes.string.isRequired,
      flair_url: React.PropTypes.string,
    }).isRequired,
    muted: React.PropTypes.bool.isRequired,
    size: React.PropTypes.number.isRequired,
  }

  static defaultProps = {
    muted: false,
    size: 16,
  }

  render() {
    const { changelog: { flair_url, logo_url }, size, muted } = this.props
    const defaultUrl = 'https://assembly.imgix.net/c4187edf-fa89-4c15-a5cc-e509c8e34877/rfpmarker.png'

    return (
      <img className="block circle" src={`${flair_url || defaultUrl}?crop=${size}&${muted ? "sat=-50&blend=DEE0E3" : ''}`} width={size} height={size} />
    )
  }
}
