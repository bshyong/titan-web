require('basscss/css/basscss.css')
import classnames from 'classnames'
import React from 'react'

const OrgHeader = React.createClass({
  render() {
    const color = "black"
    const bg = "white"
    const cn = classnames("py2 border-bottom", `bg-${bg}`, color)
    return (
      <div className={cn}>
        <div className="container sm-col-8 clearfix">
          <h3 className="mt0 mb0 left" style={{lineHeight: '2.5rem'}}>
            Meta
          </h3>
        </div>
      </div>
    )
  }
})

export default OrgHeader
