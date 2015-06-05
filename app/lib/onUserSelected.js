import MENTION_REGEX from '../lib/mention_regex'
import React from 'react'

// This function is basically meant to be mixed in to a text component
// that needs to replace an @mention string with a full username.
// But the thing is, ES6 React classes don't support mixins. So instead,
// you should `call` this function explicitly and give it your component's
// context:
// onUserSelected.call(this, nodeRef, user[, callback])

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
