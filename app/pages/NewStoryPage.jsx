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
import * as storyFormActions from 'actions/storyFormActions'
import StoryFormWalkthrough from 'components/Story/StoryFormWalkthrough.jsx'
import UploadingAttachmentStore from 'stores/uploading_attachment_store'
import { connect } from 'redux/react'
import { showTweetScrim } from 'actions/TweetScrimActions'

@AuthenticatedMixin()
@connect(state => ({
  isCreating: state.storyFields.isCreating,
  storyFields: state.storyFields,
  errorMessage: state.storyFields.errorMessage,
  publishToTwitter: state.storyFields.publishToTwitter,
}))
@connectToStores(ChangelogStore, UploadingAttachmentStore, ContributorsStore)
export default class NewStoryPage extends React.Component {
  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.dispatch(storyFormActions.clearAll())
      ContributorsActions.resetContributors(SessionStore.user)
    }, 0)
  }

  constructor(props) {
    super(props)

    this.state = {
      showErrorMessage: false
    }

    this.handleOnPublish = this.handleOnPublish.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  static getPropsFromStores(props) {
    return {
      changelog: ChangelogStore.changelog,
      contributors: ContributorsStore.contributors,
      uploadsFinished: UploadingAttachmentStore.uploadsFinished('new_story'),
      fromOnboarding: RouterContainer.get().getCurrentQuery().o
    }
  }

  render() {
    const { showErrorMessage } = this.state
    const { changelog, storyFields, contributors, isCreating } = this.props

    if (!changelog) {
      return null
    }

    const story = {...storyFields, ...contributors}

    return (
      <DocumentTitle title={["New story", changelog.name].join(' · ')}>
        <div>
          <ChangelogNavbar changelog={changelog} size="small" />
          <div className="container py4 px2 sm-px0">
            <StoryFormWalkthrough>
              {this.renderSuccessBanner()}
              <StoryForm story={story}
                ref="form"
                showErrorMessage={showErrorMessage}
                changelog={changelog}
                onChange={this.handleOnChange} />
            </StoryFormWalkthrough>
            <div className="py2 right-align">
              <Button
                color="orange"
                style="outline"
                action={this.handleOnPublish}
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
    const { isCreating } = this.props
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
    this.props.dispatch(storyFormActions.change(fields))
  }

  handleOnPublish(e) {
    e.preventDefault()
    const {
      changelogId,
      dispatch,
      fromOnboarding,
      publishToTwitter,
      storyFields,
      uploadsFinished,
    } = this.props

    if (uploadsFinished || confirm('Attachments are still uploading; are you sure you want to post?')) {
      if (!storyFields.title || !storyFields.emoji_id || storyFields.errorMessage) {
        if (storyFields.errorMessage.indexOf('emoji') > -1) {
          dispatch(EmojiInputActions.open())
        }
        this.setState({showErrorMessage: true})
      } else {
        if (fromOnboarding) {
          return StoryActions.publish(changelogId, storyFields, false, () => {
            RouterContainer.transitionTo('changelog', {changelogId: changelogId})
          })
        }

        const callback = publishToTwitter ? (story) => {
          const {
            title,
            urlParams: {
              changelogId,
              day,
              month,
              storyId,
              year
            }
          } = story
          const fullUrl = `${MAIN_HOST}/${changelogId}/${year}/${month}/${day}/${storyId}`
          const text = `${title}: ${fullUrl} via @asm`

          dispatch(showTweetScrim(text))
        } : () => {}

        StoryActions.publish(changelogId, storyFields, true, callback)
      }
    }
  }
}
