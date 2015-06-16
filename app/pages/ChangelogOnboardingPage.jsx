import React from 'react'
import ChangelogBootstrapFlow from '../components/ChangelogBootstrapFlow.jsx'

export default class ChangelogOnboardingPage extends React.Component {
  render() {
    return (
      <div className="flex flex-center full-width" style={{height: "100vh"}}>
        <div className="container full-width p2">
          <div className="col-8 mx-auto">
            <ChangelogBootstrapFlow />
          </div>
        </div>
      </div>
    )
  }
}
