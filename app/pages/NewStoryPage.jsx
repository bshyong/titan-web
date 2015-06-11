import AuthenticatedMixin from '../components/mixins/authenticated_mixin.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/NewStoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'

@AuthenticatedMixin()
export default class NewStoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ContributorsActions.resetContributors()
    if (query.highlight) {
      // TODO load if page refreshed
    } else if (query.type=="helloWorld") {
      StoryFormActions.change({
        title: "Hello World",
        isPublic: true,
        contributors: [],
        body: "My first post!"
      })
    }
    else {
      StoryFormActions.clearAll()
    }
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  render() {
    return (
      <div className="container py2">
        <StoryForm onPublish={this.handleOnPublish.bind(this)} />
      </div>
    )
  }

  handleOnPublish(e) {
    e.preventDefault()
    StoryActions.publish(this.props.changelogId, {
      title: StoryFormStore.title,
      body:  StoryFormStore.body,
      contributors: ContributorsStore.contributorsAsString(),
      team_member_only: !StoryFormStore.isPublic,
      emoji_id: EmojiStore.selectedEmoji
    })
  }
}
