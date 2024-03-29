import * as EmojiInputActions from 'actions/EmojiInputActions'
import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import Button from 'ui/Button.jsx'
import ChangelogNavbar from 'components/Changelog/ChangelogNavbar.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import ContributorsActions from 'actions/ContributorsActions'
import ContributorsStore from 'stores/ContributorsStore'
import DocumentTitle from 'react-document-title'
import React from 'react'
import RouterContainer from 'lib/router_container'
import SessionStore from 'stores/session_store'
import statics from 'lib/statics'
import {publish} from 'actions/storyActions'
import StoryForm from 'components/Story/StoryForm.jsx'
import * as storyFormActions from 'actions/storyFormActions'
import StoryFormWalkthrough from 'components/Story/StoryFormWalkthrough.jsx'
import { connect } from 'redux/react'
import { showTweetScrim } from 'actions/TweetScrimActions'

@AuthenticatedMixin()
@connect(state => ({
  attachments: state.attachments,
  changelog: state.currentChangelog.changelog,
  errorMessage: state.storyFields.errorMessage,
  isCreating: state.storyFields.isCreating,
  publishToTwitter: state.storyFields.publishToTwitter,
  storyFields: state.storyFields,
}))
@connectToStores(ContributorsStore)
@statics({
  getPropsFromStores() {
    return {
      contributors: ContributorsStore.contributors,
      fromOnboarding: RouterContainer.get().getCurrentQuery().o,
    }
  },
})
export default class NewStoryPage extends React.Component {
  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug(),
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
      showErrorMessage: false,
    }

    this.handleOnPublish = this.handleOnPublish.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
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
    const { isCreating, storyFields } = this.props
    if (isCreating) {
      return (
        <div className="bg-blue center p2 mb2 rounded">
          <h4 className="bold mb0 mt0 white">
            {storyFields.title} is being published &mdash; sit tight!
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
      attachments,
      changelogId,
      dispatch,
      fromOnboarding,
      publishToTwitter,
      storyFields,
    } = this.props

    const uploadsFinished = !attachments.new_story

    if (uploadsFinished || confirm('Attachments are still uploading; are you sure you want to post?')) {
      if (!storyFields.title || !storyFields.emoji_id || storyFields.errorMessage) {
        if (storyFields.errorMessage.indexOf('emoji') > -1) {
          dispatch(EmojiInputActions.open())
        }
        this.setState({showErrorMessage: true})
      } else {
        if (fromOnboarding) {
          return this.props.dispatch(publish(changelogId, storyFields, false, () => {
            RouterContainer.transitionTo('changelog', {changelogId: changelogId})
          }))
        }

        const callback = publishToTwitter ? (story) => {
          const {
            title,
            urlParams: {
              day,
              month,
              storyId,
              year,
            },
          } = story
          const fullUrl = `${MAIN_HOST}/${changelogId}/${year}/${month}/${day}/${storyId}`
          const text = `${title}: ${fullUrl} via @asm`

          dispatch(showTweetScrim(text))
        } : () => {}

        this.props.dispatch(publish(changelogId, storyFields, true, callback))
      }
    }
  }
}
