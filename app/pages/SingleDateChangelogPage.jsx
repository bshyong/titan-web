import ChangelogDateRange from '../components/ChangelogDateRange.js.jsx'
import ChangelogHeader from '../components/ChangelogHeader.jsx'
import ChangelogStore from '../stores/changelog_store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import moment from 'moment'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'

export default class SingleDateChangelogPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    StoryActions.fetchSpecificDate(RouterContainer.changelogSlug(params), params.date, ChangelogStore.timeInterval)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug(),
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
