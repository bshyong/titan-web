import ChangelogStore from '../stores/changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import ChangelogDateRange from '../components/ChangelogDateRange.js.jsx'
import ChangelogHeader from '../components/ChangelogHeader.jsx'

export default class SingleDateChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchAll(params.changelogId, ChangelogStore.timeInterval)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId,
      date: RouterContainer.get().getCurrentParams().date,
      timeInterval: RouterContainer.get().getCurrentParams().timeInterval
    }
  }

  render() {
    const { changelogId, date, timeInterval } = this.props
    return <div>
      <ChangelogHeader changelogId={changelogId} />
      <ChangelogDateRange changelogId={changelogId} date={date} timeInterval={timeInterval} />
    </div>
  }
}
