import * as EmojiInputActions from 'actions/EmojiInputActions'
import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import Button from 'ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import ChangelogStore from 'stores/changelog_store'
import connectToStores from 'lib/connectToStores.jsx'
import ContributorsActions from 'actions/ContributorsActions'
import ContributorsStore from 'stores/ContributorsStore'
import DocumentTitle from 'react-document-title'
import EmojiStore from 'stores/emoji_store'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'
import statics from 'lib/statics'
import StoryActions from 'actions/story_actions'
import StoryForm from 'components/Story/StoryForm.jsx'
import StoryFormActions from 'actions/story_form_actions'
import StoryFormStore from 'stores/story_form_store'
import StoryFormWalkthrough from 'components/Story/StoryFormWalkthrough.jsx'
import UploadingAttachmentStore from 'stores/uploading_attachment_store'
import { connect } from 'redux/react'

@statics({
  willTransitionTo(transition, params, query) {
    StoryFormActions.clearAll()
    ContributorsActions.resetContributors(SessionStore.user)
  }
})
@AuthenticatedMixin()
@connect(state => ({}))
@connectToStores(StoryFormStore, UploadingAttachmentStore)
export default class NewStoryPage extends React.Component {
  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showErrorMessage: false
    }
  }

  static getPropsFromStores(props) {
    return {
      ...props,
      changelog: ChangelogStore.changelog,
      isCreating: StoryFormStore.isCreating,
      story: {
        ...StoryFormStore.data,
        contributors: ContributorsStore.contributors,
        errorMessage: StoryFormStore.errorMessage
      },
      uploadsFinished: UploadingAttachmentStore.uploadsFinished('new_story'),
      fromOnboarding: RouterContainer.get().getCurrentQuery().o
    }
  }

  render() {
    const { showErrorMessage } = this.state
    const { changelog, story, isCreating } = this.props

    if (!changelog) {
      return null
    }

    return (
      <DocumentTitle title={["New story", changelog.name].join(' · ')}>
        <div>
          <ChangelogNavbar changelog={changelog} size="small" />
          <div className="container py4 px2 sm-px0">
            <StoryFormWalkthrough>
              {this.renderSuccessBanner()}
              <StoryForm story={story}
                showErrorMessage={showErrorMessage}
                changelog={changelog}
                onChange={this.handleOnChange.bind(this)} />
            </StoryFormWalkthrough>
            <div className="py2 right-align">
              <Button
                color="orange"
                style="outline"
                action={this.handleOnPublish.bind(this)}
                disabled={isCreating}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  renderSuccessBanner() {
    const { isCreating, story: { title } } = this.props
    if (isCreating) {
      return (
        <div className="bg-blue center p2 mb2 rounded">
          <h4 className="bold mb0 mt0 white">
            {title} is being published &mdash; sit tight!
          </h4>
        </div>
      )
    }
  }

  handleOnChange(fields) {
    StoryFormActions.change(fields)
  }

  handleOnPublish(e) {
    const { story: { errorMessage }, uploadsFinished, fromOnboarding, changelogId } = this.props
    e.preventDefault()

    if (uploadsFinished || confirm('Attachments are still uploading; are you sure you want to post?')) {
      if (!StoryFormStore.isValid() || errorMessage) {
        if (errorMessage.indexOf('emoji') > -1) {
          this.props.dispatch(EmojiInputActions.open())
        }
        this.setState({showErrorMessage: true})
      } else {
        if (fromOnboarding) {
          return StoryActions.publish(changelogId, StoryFormStore.data, false, () => {
            RouterContainer.transitionTo('changelog', {changelogId: changelogId})
          })
        }
        StoryActions.publish(changelogId, StoryFormStore.data)
      }
    }
  }
}
