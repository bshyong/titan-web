import React from 'react'
import twemoji from 'twemoji'

export default class Emoji extends React.Component {

  render() {
    const {char} = this.props
    const html = twemoji.parse(char, (icon, options, variant) => {
       return `https://twemoji.maxcdn.com/36x36/${icon}.png`
     })

    return <div dangerouslySetInnerHTML={{__html: html}} />
  }

}

Emoji.propTypes = {
  char: React.PropTypes.string.isRequired
}
