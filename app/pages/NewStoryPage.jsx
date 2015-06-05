import AuthenticatedMixin from '../components/mixins/authenticated_mixin.jsx'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/NewStoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'

@AuthenticatedMixin()
export default class NewStoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (query.highlight) {
      // TODO load if page refreshed
    } else {
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
      contributors: StoryFormStore.contributors,
      team_member_only: !StoryFormStore.isPublic,
      emoji_id: EmojiStore.selectedEmoji
    })
  }
}
