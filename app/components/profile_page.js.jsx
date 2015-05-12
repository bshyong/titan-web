import React from 'react'
import Button from 'components/ui/button.js.jsx'
import Avatar from 'components/ui/avatar.jsx'

export default class ProfilePage extends React.Component {
  static willTransitionTo(transition, params, query) {
    console.log(params)
    // StoryActions.fetch(params.changelogId, params.storyId)
  }

  constructor(props) {
    super(props)
    this.state = {
      following: false
    }

  }



  componentDidMount() {
    // FollowersStore.addChangeListener(this.onStoreChange)
    // FollowActions.fetchAll(this.props.changelogId)
  }

  componentWillUnmount() {
  //  FollowersStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    return (
      <div>
        <h1>hi</h1>
      //  <Avatar user={this.props.user} size={24} />
      </div>
    )
  }

}

ProfilePage.propTypes = {
  user: React.PropTypes.object.isRequired
}
