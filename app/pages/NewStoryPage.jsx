import AuthenticatedMixin from '../components/mixins/authenticated_mixin.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'

@AuthenticatedMixin()
export default class NewStoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    ContributorsActions.resetContributors(SessionStore.user)
    if (query.highlight) {
      // TODO load if page refreshed
    } else if (query.type=="helloWorld") {
      StoryFormActions.change({
        title: "Hello World",
        isPublic: true,
        contributors: [],
        body: "Hey @core\n\nI set up this Changelog so we can better share our daily work and collect feedback amongst our group.\n\nIt's simple to use; just log a quick note everytime you finish something or have something to share. You can also add a quick description, image, or link if you want too. Here are some examples.\n\n* 'Emojified all the things, replaced all nouns with an emoji'\n* 'Just finished the new homepage design, feedback?'\n* 'Released Version 2 in production'\n\nWhat do you think?"
      })
    }
    else {
      StoryFormActions.clearAll()
    }
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  render() {
    return (
      <div className="container py2">
        <StoryForm onPublish={this.handleOnPublish.bind(this)} autoFocusEmoji={true} />
      </div>
    )
  }

  handleOnPublish(e) {
    e.preventDefault()
    const payload = {
      body:  StoryFormStore.body,
      contributors: ContributorsStore.validTokensAsString,
      created_at: StoryFormStore.created_at,
      emoji_id: StoryFormStore.emoji_id,
      team_member_only: !StoryFormStore.isPublic,
      title: StoryFormStore.title,
    }
    StoryActions.publish(this.props.changelogId, payload)
  }
}
