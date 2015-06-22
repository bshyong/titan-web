import ApplicationNavbar from './application_navbar.jsx'
import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryForm from './NewStoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryActions from '../actions/story_actions'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'

@AuthenticatedMixin()
export default class EditStoryForm extends React.Component {
  static get defaultProps() {
    return RouterContainer.get().getCurrentParams()
  }

  componentDidMount() {
    this.getExistingStory()
  }

  render() {
    return (
      <div className="container p2">
        <StoryForm onPublish={this.handleOnPublish.bind(this)} />
      </div>
    )
  }

  getExistingStory() {
    const story = GroupedStoriesStore.get(this.props.storyId)

    if (story) {
      StoryFormActions.change({
        title: story.title,
        isPublic: !story.team_member_only,
        contributors: story.contributors.map(u => `@${u.username}`).join(', '),
        body: story.body,
        emoji_id: story.emoji.id
      })
    } else {
      StoryActions.fetch(this.props.changelogId, this.props.storyId)
    }
  }

  handleOnPublish() {
    StoryActions.edit(this.props.changelogId, this.props.storyId, StoryFormStore.data)
  }
}
