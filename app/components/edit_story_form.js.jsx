import ApplicationNavbar from './application_navbar.jsx'
import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import connectToStores from '../lib/connectToStores.jsx'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryForm from './Story/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryActions from '../actions/story_actions'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import Button from '../ui/Button.jsx'

@AuthenticatedMixin()
@connectToStores(StoryFormStore)
export default class EditStoryForm extends React.Component {
  static get defaultProps() {
    return RouterContainer.get().getCurrentParams()
  }

  static getPropsFromStores(props) {
    return {
      story: StoryFormStore.data,
      storyLoaded: !!StoryFormStore.created_at
    }
  }

  componentDidMount() {
    this.getExistingStory()
  }

  render() {
    if (!this.props.storyLoaded) {
      return <div />
    }
    return (
      <div className="container py4">
        <StoryForm story={this.props.story} onChange={this.handleOnChange.bind(this)} />
        <div className="py2 right-align">
          <Button
            color="orange"
            style="outline"
            action={this.handleOnUpdate.bind(this)} disabled={!StoryFormStore.isValid()}>
            Update
          </Button>
        </div>
      </div>
    )
  }

  getExistingStory() {
    const story = GroupedStoriesStore.get(this.props.storyId)

    if (story) {
      StoryFormActions.change({
        body: story.body,
        contributors: story.contributors.map(u => `@${u.username}`).join(', '),
        created_at: story.created_at,
        emoji_id: story.emoji.id,
        isPublic: !story.team_member_only,
        title: story.title,
      })
    } else {
      StoryActions.fetch(this.props.changelogId, this.props.storyId)
    }
  }

  handleOnChange(fields) {
    StoryFormActions.change(fields)
  }

  handleOnUpdate() {
    StoryActions.edit(this.props.changelogId, this.props.storyId, StoryFormStore.data)
  }
}
