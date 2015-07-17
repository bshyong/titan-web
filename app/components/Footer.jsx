import React from 'react'
import Link from 'components/Link.jsx'
import Icon from 'ui/Icon.jsx'
import WorkmarkWhiteImgSrc from 'images/workmark-white.svg'

export default class Footer extends React.Component {
  render() {
    return (
      <div className="bg-charcoal">
        <div className="container px2">
          <div className="flex flex-center py2">
            <div className="flex-auto white">
              <Link className="block white" to="home">
                <img className="block" src={WorkmarkWhiteImgSrc} />
              </Link>
            </div>
            <div>
              <ul className="list-reset flex mxn2 mb0">
                <li>
                  <a className="block p2 gray white-hover" href="http://blog.assembly.com">Blog</a>
                </li>
                <li>
                  <Link className="block p2 gray white-hover" to="faq">FAQ</Link>
                </li>
                <li>
                  <Link className="block p2 gray white-hover" to="tos">Terms</Link>
                </li>				  
                <li>
                  <a className="block p2 gray white-hover" href="https://twitter.com/asm"><Icon icon="twitter" /></a>
                </li>
                <li>
                  <a className="block p2 gray white-hover" href="https://facebook.com/assemblymade"><Icon icon="facebook" /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
