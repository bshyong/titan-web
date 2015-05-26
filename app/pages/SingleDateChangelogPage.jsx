import ChangelogDateRange from '../components/ChangelogDateRange.js.jsx'
import ChangelogHeader from '../components/ChangelogHeader.jsx'
import ChangelogStore from '../stores/changelog_store'
import moment from 'moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'

export default class SingleDateChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    //StoryActions.fetchSpecificDate(params.changelogId, params.date, ChangelogStore.timeInterval)
    console.log('changelogid', params.changelogId)
    console.log('timeinterval', ChangelogStore.timeInterval)
    StoryActions.fetchAll(params.changelogId, ChangelogStore.timeInterval)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId,
      date: moment(RouterContainer.get().getCurrentParams().date, "MM DD YYYY"),
      timeInterval: RouterContainer.get().getCurrentParams().timeInterval
    }
  }

  render() {
    const { changelogId, date, timeInterval } = this.props

    return <div>
      <ChangelogHeader changelogId={changelogId} />
      <ChangelogDateRange changelogId={changelogId} start_date={date} timeInterval={timeInterval} />
    </div>
  }
}
