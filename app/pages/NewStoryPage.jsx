import AuthenticatedMixin from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from 'stores/changelog_store'
import connectToStores from '../lib/connectToStores.jsx'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsStore from '../stores/ContributorsStore'
import EmojiStore from '../stores/emoji_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/Story/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import StoryFormWalkthrough from '../components/Story/StoryFormWalkthrough.jsx'
import UploadingAttachmentStore from '../stores/uploading_attachment_store'

@AuthenticatedMixin()
@connectToStores(StoryFormStore, UploadingAttachmentStore)
export default class NewStoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    if (query.highlight) {
      // TODO load if page refreshed
    } else if (query.type=="helloWorld") {
      StoryFormActions.change({
        title: "Hello World",
        team_member_only: false,
        contributors: [],
        body: `Hey @core\n\n
        I set up this Changelog so we can better share our daily work and collect
        feedback amongst our group.\n\n
        It's simple to use; just log a quick note everytime you finish something
        or have something to share. You can also add a quick description, image,
        or link if you want too. Here are some examples.\n\n* 'Emojified all the
        things, replaced all nouns with an emoji'\n* 'Just finished the new
        homepage design, feedback?'\n* 'Released Version 2 in production'\n\n
        What do you think?`
      })
    } else {
      StoryFormActions.clearAll()
      ContributorsActions.resetContributors(SessionStore.user)
    }
  }

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
    }
  }

  render() {
    const { showErrorMessage } = this.state

    return (
      <div className="container py4 px2 sm-px0">
        <StoryFormWalkthrough>
          {this.renderSuccessBanner()}
          <StoryForm story={this.props.story}
            showErrorMessage={showErrorMessage}
            changelog={this.props.changelog}
            onChange={this.handleOnChange.bind(this)} />
        </StoryFormWalkthrough>
        <div className="py2 right-align">
          <Button
            color="orange"
            style="outline"
            action={this.handleOnPublish.bind(this)}
            disabled={this.props.isCreating}>
            Post
          </Button>
        </div>
      </div>
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
    const { story: { errorMessage }, uploadsFinished } = this.props
    e.preventDefault()

    if (uploadsFinished || confirm('Attachments are still uploading; are you sure you want to post?')) {
      if (!StoryFormStore.isValid() || errorMessage) {
        this.setState({showErrorMessage: true})
      } else {
        StoryActions.publish(this.props.changelogId, StoryFormStore.data)
      }
    }
  }
}
