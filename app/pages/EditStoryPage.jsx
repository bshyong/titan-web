import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import Button from 'ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import ChangelogStore from 'stores/changelog_store'
import connectToStores from 'lib/connectToStores.jsx'
import DocumentTitle from 'react-document-title'
import GroupedStoriesStore from 'stores/GroupedStoriesStore'
import LoadingBar from 'ui/LoadingBar.jsx'
import React from 'react'
import RouterContainer from 'lib/router_container'
import StoryActions from 'actions/story_actions'
import * as storyActions from 'actions/storyActions'
import StoryForm from 'components/Story/StoryForm.jsx'
import * as storyFormActions from 'actions/storyFormActions'
import { connect } from 'redux/react'
import fetchData from 'decorators/fetchData'

@fetchData((params, query, state) => {
  if (!state.story.id) {
    return storyActions.fetch(RouterContainer.changelogSlug(params), params.storyId)
  } else {
    return storyActions.editStory(state.story)
  }
})
@AuthenticatedMixin()
@connect(state => ({
  storyFields: state.storyFields,
  storyLoaded: !!state.storyFields.title
}))
@connectToStores(ChangelogStore)
export default class EditStoryPage extends React.Component {
  static get defaultProps() {
    return RouterContainer.get().getCurrentParams()
  }

  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
    }
  }

  render() {
    const { changelog, storyLoaded, storyFields } = this.props

    if (!storyLoaded) {
      return <LoadingBar loading={true} />
    }
    return (
      <DocumentTitle title={["Edit story", changelog.name].join(' · ')}>
        <div>
          <ChangelogNavbar changelog={this.props.changelog} size="small" />
          <div className="container py4">
            <StoryForm ref="form"
              changelog={this.props.changelog}
              story={storyFields}
              onChange={this.handleOnChange.bind(this)} />
            <div className="py2 right-align">
              <Button
                color="orange"
                style="outline"
                action={this.handleOnUpdate.bind(this)} disabled={!storyFields.title}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  handleOnChange(fields) {
    this.props.dispatch(storyFormActions.change(fields))
  }

  handleOnUpdate() {
    const story = this.props.storyFields
    StoryActions.edit(this.props.changelogId, this.props.storyId, story)
  }
}
