require('basscss/css/basscss.css')
import {Link} from 'react-router'
import classnames from 'classnames'
import React from 'react'
import RouterContainer from 'lib/router_container'

export default class OrgHeader extends React.Component {
  render() {
    const color = "black"
    const bg = "white"
    const cn = classnames("py2 border-bottom", `bg-${bg}`, color)
    const changelogId = RouterContainer.get().getCurrentParams().changelogId

    return (
      <div className={cn}>
        <div className="container sm-col-8 clearfix">
          <h3 className="mt0 mb0 left" style={{lineHeight: '2.5rem'}}>
            Meta
          </h3>

          <div className="right">
            <Link className="block py1 px2" to="new" params={{changelogId: changelogId}}>Write</Link>
          </div>
        </div>
      </div>
    )
  }
}
