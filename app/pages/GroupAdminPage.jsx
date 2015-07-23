import AppNavbar from 'components/App/AppNavbar.jsx'
import React from 'react'

export default class TermsPage extends React.Component {
  render() {
    return (
      <div>
        <AppNavbar title="Group admin page" />
        <div className="px4 py2">
          <h2 className="bold">Group admin page</h2>
        </div>
      </div>
    )
  }
}
