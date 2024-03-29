import onMobile from 'lib/on_mobile'
import React, { Component } from 'react'
import Router from 'lib/router_container'

export default class DeepLinkTwitter extends Component {
  static willTransitionTo(transition, params, query) {
    const { text } = query
    const encodedText = encodeURIComponent(text)

    transition.abort()

    window.location.href = `twitter://post?message=${encodedText}`

    setTimeout(() => {
      window.location.href = `https://twitter.com/intent/tweet?text=${encodedText}`
    }, 2500)
  }

  render() {
    return null
  }
}
