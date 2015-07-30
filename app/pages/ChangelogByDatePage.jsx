import Changelog from '../components/changelog.js.jsx'
import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'

import fetchData from 'decorators/fetchData'
import {connect} from 'redux/react'

@fetchData(params => {
  StoryActions.fetchAll(RouterContainer.changelogSlug(params), {
    group_by: 'calendar',
  })
  StoryActions.fetchPinned(RouterContainer.changelogSlug(params))
})
@connect(state => ({
  changelogName: state.currentChangelog.changelog && state.currentChangelog.changelog.name,
}))
export default class ChangelogByDatePage extends React.Component {
  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug(),
    }
  }

  render() {
    const { changelogId, changelogName } = this.props
    return <DocumentTitle title={["Posts", changelogName].join(' · ')}>
      <div>
        <Changelog changelogId={changelogId} groupBy="calendar" />
      </div>
    </DocumentTitle>
  }
}
