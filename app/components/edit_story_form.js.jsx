import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import StoryForm from 'components/new_story_form.js.jsx'
import StoryFormStore from 'stores/story_form_store'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
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
    StoryPageStore.addChangeListener(this.onStoryFetched)
    StoryFormStore.addChangeListener(this.onStoreChange)
    this.getExistingStory()
  }

  componentWillUnmount() {
    StoryPageStore.removeChangeListener(this.onStoryFetched)
    StoryFormStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {contributors, isPublic, title, body} = this.state

    return (
      <StoryForm
        contributors={this.state.contributors}
        isPublic={this.state.isPublic}
        title={title}
        body={this.state.body}
        onPublish={this.handleOnPublish} />
    )
  }

  getExistingStory() {
    const story = StoryPageStore.get(this.state.storyId)

    if (story) {
      this.setState({
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
    const story = StoryPageStore.get(this.state.storyId)

    if (story) {
      this.setState({
        title: story.title,
        isPublic: !story.team_member_only,
        contributors: story.contributors,
        body: story.body
      })
    }
  }

})
