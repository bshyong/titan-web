import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import ChangelogStore from 'stores/changelog_store'
import DocumentTitle from 'react-document-title'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import StoryForm from './Story/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import connectToStores from '../lib/connectToStores.jsx'

@AuthenticatedMixin()
@connectToStores(StoryFormStore)
export default class EditStoryForm extends React.Component {
  static get defaultProps() {
    return RouterContainer.get().getCurrentParams()
  }

  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
      story: StoryFormStore.data,
      storyLoaded: !!StoryFormStore.created_at
    }
  }

  componentDidMount() {
    this.getExistingStory()
  }

  render() {
    const { changelog, storyLoaded } = this.props

    if (!storyLoaded) {
      return <div />
    }
    return (
      <DocumentTitle title={["Edit story", changelog.name].join(' · ')}>
        <div>
          <ChangelogNavbar changelog={this.props.changelog} size="small" />
          <div className="container py4">
            <StoryForm changelog={this.props.changelog} story={this.props.story} onChange={this.handleOnChange.bind(this)} />
            <div className="py2 right-align">
              <Button
                color="orange"
                style="outline"
                action={this.handleOnUpdate.bind(this)} disabled={!StoryFormStore.isValid()}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </DocumentTitle>
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
        team_member_only: story.team_member_only,
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
    const story = StoryFormStore.data
    StoryActions.edit(this.props.changelogId, this.props.storyId, story)
  }
}
