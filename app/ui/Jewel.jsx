import React from 'react'
import classnames from 'classnames'

export default class Jewel extends React.Component {
  render() {
    const { count, icon } = this.props

    const cn = classnames('center border border-silver h6 bold circle relative', {
      'orange border-orange': count > 0,
      'silver': count === 0
    })

    const style = {
      width: 'calc(2rem - 2px)',
      height: 'calc(2rem - 2px)',
      // using an approximate magic number value for browsers that don't
      // support `calc` in `line-height` (I'm looking at you, Firefox)
      lineHeight: canUseCSSCalcInLineHeight() ? 'calc(2rem - 2px)' : '1.9rem'
    }

    const normalizedCount = count > 10 ? '10+' : count.toString()

    const label = count > 0 ? normalizedCount : icon

    return <div className={cn} style={style}>
      {label}
    </div>
  }
}

Jewel.propTypes = {
  count: React.PropTypes.number.isRequired,
  icon: React.PropTypes.node.isRequired
}

// Defining this function privately here, since
// it has relatively limited use and should
// hopefully be resolved in Firefox soon.
// See https://bugzilla.mozilla.org/show_bug.cgi?id=594933
//
// We need to use browser detection and not
// feature detection because Firefox _does_ support `calc`,
// it just doesn't support `calc` in `line-height`.
function canUseCSSCalcInLineHeight() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    return false
  }

  // http://stackoverflow.com/a/9851769 -- ugh
  if (typeof InstallTrigger !== 'undefined') {
    return false
  }

  return true
}
