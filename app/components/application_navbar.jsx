import {Link} from 'react-router'
import Avatar from 'components/ui/avatar.jsx'
import Icon from 'components/ui/icon.js.jsx'
import List from 'components/ui/list.jsx'
import Navbar from 'components/ui/navbar.jsx'
import Popover from 'components/ui/popover.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionActions from 'actions/session_actions'
import SessionStore from 'stores/session_store'

// Logo versions:

import LogoSrc from 'images/logo.svg'

export default class ApplicatioNavbar extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
    this.onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    SessionStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return <Navbar title="Changelog"
                   left={this.left()}
                   right={this.right()} />
  }

  left() {
    return (
      <Link to="root" className="flex">
        <img className="flex-none mr2" src={LogoSrc} style={{height: '1.5rem'}} />
        <div className="black sm-show">Assembly</div>
      </Link>
    )
  }

  right() {
    const { user } = this.state

    if (!user) {
      return <a className="pointer" onClick={SessionActions.signin}>Sign in</a>
    }

    const changelogId = RouterContainer.get().getCurrentParams().changelogId
    const avatar = <Avatar user={user} size={24} />

    return (
      <Popover trigger={avatar}>
        <List>
          <List.Item>
            <Link to="new" params={{changelogId}}>
              <Icon icon="pencil" fw={true} /> New story
            </Link>
          </List.Item>
        </List>
        <hr className="mt1 border-top mb1" />
        <List type="small">
          <List.Item>
            <a href="https://assembly.com/about">About</a>
          </List.Item>
          <List.Item>
            <a href="#" onClick={this._handleSignout}>Sign out</a>
          </List.Item>
        </List>
      </Popover>
    )
  }

  _onStoreChange() {
    this.setState(this.getStateFromStores())
  }

  _handleSignout() {
    SessionActions.signout()
  }

  getStateFromStores() {
    return {
      user: SessionStore.user
    }
  }
}
