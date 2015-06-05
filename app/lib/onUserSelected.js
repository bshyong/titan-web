import MENTION_REGEX from '../lib/mention_regex'
import React from 'react'

export default function(nodeRef, user, callback) {
  const value = this.props.value
  const beginning = value.substr(0, this.selectionStart).trim()

  let toReplace = beginning
  let finalChar = ''
  if (toReplace.match(/[^A-Za-z0-9_@\s]$/g)) {
    finalChar = toReplace[toReplace.length - 1]
    toReplace = toReplace.substr(0, toReplace.length - 1)
  }

  const newBeginning = toReplace.replace(
    MENTION_REGEX,
    (callback || function(match, space, username, offset, string) {
      return `${space}@${user.username} `
    })
  )

  let end = value.substr(this.selectionStart)

  if (end === beginning) {
    end = ''
  }

  const simulatedEvent = {
    target: {
      value: newBeginning + finalChar + end
    }
  }

  const start = this.selectionStart = newBeginning.length

  this.props.onChange(simulatedEvent)

  // Put the cursor where the user expects it to be,
  // not necessarily at the end of the input
  React.findDOMNode(nodeRef).
    setSelectionRange(start, start)
}
