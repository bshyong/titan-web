import React from 'react'
import authenticated from '../mixins/authenticated_mixin.jsx'

@authenticated()
export default class ChangelogSettings extends React.Component {
  render() {
    return (
      <div>
        <h2>Changelog Settings</h2>
      </div>
    )
  }

  handleSubmit() {

  }
}
