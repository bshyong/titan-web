import ChangelogDateRange from 'components/ChangelogDateRange.js.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import fetchData from 'decorators/fetchData'
import moment from 'moment'
import React from 'react'
import RouterContainer from 'lib/router_container'
import {fetchSpecificDate} from 'actions/storyActions'

@fetchData(params => fetchSpecificDate(
    RouterContainer.changelogSlug(params),
    params.date,
    params.timeInterval
  )
)
export default class SingleDateChangelogPage extends React.Component {
  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug(),
      date: moment(RouterContainer.get().getCurrentParams().date, "MM DD YYYY"),
      timeInterval: RouterContainer.get().getCurrentParams().timeInterval,
    }
  }

  render() {
    const { changelogId, date, timeInterval } = this.props

    return <div>
      <ChangelogNavbar changelogId={changelogId} />
      <ChangelogDateRange changelogId={changelogId} start_date={date} timeInterval={timeInterval} />
    </div>
  }
}
