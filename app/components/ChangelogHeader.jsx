import { Link } from 'react-router'
import FollowButton from './follow_button.jsx'
import Jumbotron from '../ui/jumbotron.jsx'
import Logo from './logo.jsx'
import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'
import ChangelogStore from '../stores/changelog_store'

import MetaBannerUrl from '../images/meta-banner.jpg'

@connectToStores(ChangelogStore)
export default class ChangelogHeader extends React.Component {

  static getPropsFromStores(props) {
    return {
      following: ChangelogStore.following,
    }
  }

  render() {
    const { changelogId, following } = this.props

    return (
      <Jumbotron bgColor="blue" bgImageUrl={MetaBannerUrl}>
        <div className="sm-flex flex-center">
          <div className="flex-none mb2 sm-mb0">
            <div className="mx-auto" style={{width: '4rem'}}><Logo size="4rem"/></div>
          </div>
          <Link className="block flex-auto mb2 md-mb0 sm-px3 center sm-left-align white" to="changelog" params={{changelogId}}>
            <h2 className="mt0 mb0">Assembly</h2>
            <div>Building Assembly on Assembly.</div>
          </Link>
          <div className="flex-none sm-ml2">
            <FollowButton changelogId={changelogId} toggled={following}/>
          </div>
        </div>
      </Jumbotron>
    )
  }

}
