require('basscss/css/basscss.css')
import classnames from 'classnames'
import React from 'react'
import {Link} from 'react-router'

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

          <div className="right">
            <Link className="block py1 px2" to="new">Write</Link>
          </div>
        </div>
      </div>
    )
  }
})

export default OrgHeader
