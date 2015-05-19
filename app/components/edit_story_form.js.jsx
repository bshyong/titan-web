import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryForm from './new_story_form.js.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryActions from '../actions/story_actions'
import StoryStore from '../stores/story_store'

export default AuthenticatedMixin(class EditStoryForm extends React.Component {
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
    const story = StoryStore.get(this.props.storyId)

    if (story) {
      StoryFormActions.change({
        title: story.title,
        isPublic: !story.team_member_only,
        contributors: story.contributors.map(u => `@${u.username}`).join(', '),
        body: story.body
      })
    } else {
      StoryActions.fetch(this.props.changelogId, this.props.storyId)
    }
  }

  handleOnPublish() {
    StoryActions.edit(this.props.changelogId, this.props.storyId, {
      title: StoryFormStore.title,
      body:  StoryFormStore.body,
      contributors: StoryFormStore.contributors,
      team_member_only: !StoryFormStore.isPublic
    })
  }
})
