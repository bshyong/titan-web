import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import StoryForm from 'components/new_story_form.js.jsx'
import StoryFormActions from 'actions/story_form_actions'
import StoryFormStore from 'stores/story_form_store'
import StoryActions from 'actions/story_actions'
import StoryStore from 'stores/story_store'
import Router from 'lib/router_container'
import React from 'react'

export default AuthenticatedMixin(class EditStoryForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ...Router.get().getCurrentParams()
    }

    this.onStoreChange = this._onStoreChange.bind(this)
    this.onStoryFetched = this._onStoryFetched.bind(this)
    this.handleOnPublish = this._handleOnPublish.bind(this)
  }

  componentDidMount() {
    StoryStore.addChangeListener(this.onStoryFetched)
    StoryFormStore.addChangeListener(this.onStoreChange)
    this.getExistingStory()
  }

  componentWillUnmount() {
    StoryStore.removeChangeListener(this.onStoryFetched)
    StoryFormStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {contributors, isPublic, title, body} = this.state

    return (
      <div className="container p2">
        <StoryForm
          contributors={contributors}
          isPublic={isPublic}
          title={title}
          body={body}
          onPublish={this.handleOnPublish} />
      </div>
    )
  }

  getExistingStory() {
    const story = StoryStore.get(this.state.storyId)

    if (story) {
      StoryFormActions.change({
        title: story.title,
        isPublic: !story.team_member_only,
        contributors: story.contributors,
        body: story.body
      })
    } else {
      StoryActions.fetch(this.state.changelogId, this.state.storyId)
    }
  }

  getStateFromStores() {
    return {
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      contributors: StoryFormStore.contributors,
      isPublic:     StoryFormStore.isPublic
    }
  }

  _handleOnPublish() {
    StoryActions.edit(this.state.changelogId, this.state.storyId, {
      title: this.state.title,
      body:  this.state.body,
      contributors: this.state.contributors,
      team_member_only: !this.state.isPublic
    })
  }

  _onStoreChange() {
    this.setState(this.getStateFromStores())
  }

  _onStoryFetched() {
    const story = StoryStore.get(this.state.storyId)

    if (story) {
      setTimeout(() => {
        StoryFormActions.change({
          title: story.title,
          isPublic: !story.team_member_only,
          contributors: story.contributors,
          body: story.body
        })
      }, 0)
    }
  }

})
