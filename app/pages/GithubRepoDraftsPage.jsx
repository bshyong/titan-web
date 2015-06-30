import ApplicationNavbar from '../components/application_navbar.jsx'
import Button from '../ui/Button.jsx'
import ContributorsStore from '../stores/ContributorsStore'
import GithubOnboardingActions from '../actions/github_onboarding_actions'
import GithubOnboardingStore from '../stores/github_onboarding_store'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import React from 'react'
import Router from '../lib/router_container'
import RouterContainer from '../lib/router_container'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/Story/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import connectToStores from '../lib/connectToStores.jsx'

@connectToStores(GithubOnboardingStore, StoryFormStore)
export default class GithubRepoDraftsPage extends React.Component {
  static willTransitionTo(transition, params, query) {
    const user = SessionStore.user
    if (!user){ SessionActions.signin() }
  }

  static getPropsFromStores(props) {
    return {
      drafts: GithubOnboardingStore.drafts,
      draftsLoading: GithubOnboardingStore.loadingDrafts,
      changelogId: Router.get().getCurrentParams().changelogId,
      story: {
        ...StoryFormStore.data,
        contributors: ContributorsStore.contributors
      }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentDraftIndex: 0
    }
  }

  componentDidMount() {
    const { drafts, changelogId, draftsLoading } = this.props

    if (drafts.isEmpty() && !draftsLoading) {
      setTimeout(() => {GithubOnboardingActions.fetchDrafts(changelogId)}, 0)
    }

    if (!drafts.isEmpty()) {
      setTimeout(() => {StoryFormActions.change({
        title: drafts.get(0).title,
        body: drafts.get(0).body
      })})
    }
  }

  render() {
    const { draftsLoading } = this.props

    return <div className="container">
        { draftsLoading ? this.renderLoadingState() : this.renderDraftStoryForms() }
      </div>
  }

  renderLoadingState() {
    const { draftsLoading } = this.props

    return (
      <div className="p3">
        <h2>Loading drafts..</h2>
        <LoadingBar loading={draftsLoading} />
      </div>
    )
  }

  renderDraftStoryForms() {
    const { drafts, story } = this.props
    const { currentDraftIndex } = this.state

    if (drafts.isEmpty() || currentDraftIndex > drafts.size) { return this.renderEmptyState() }

    return (
      <div className="p3">
        <h2>Drafts</h2>
        <div className="bg-smoke p2 flex">
          <div className="flex-auto">
            Reviewing {currentDraftIndex + 1} of {drafts.size + 1} drafts
          </div>
          <div className="flex-none">Delete all drafts</div>
        </div>
        <div className="mt2">
          <StoryForm
            story={story}
            onChange={this.handleOnChange.bind(this)} />
          <div className="py2 right-align">
            <div className="mr2 inline">
              <Button
                color="gray"
                style="outline"
                action={this.handleDraftDeletion.bind(this)}>
                Delete
              </Button>
            </div>
            <Button
              color="orange"
              style="outline"
              action={this.handleOnPublish.bind(this)} disabled={!StoryFormStore.isValid()}>
              Post
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderEmptyState() {
    const { changelogId } = this.props

    return (
      <div className="p3">
        <h2>No drafts</h2>
        <div>
          <Link to="githubRepos" params={{changelogId: changelogId}}>Click here to generate drafts from a Github repo</Link>
        </div>
      </div>
    )
  }

  handleDraftDeletion() {
    const { drafts, changelogId } = this.props
    const lastDraft = drafts.get(this.state.currentDraftIndex)

    this.setState({
      currentDraftIndex: this.state.currentDraftIndex + 1
    }, () => {
      GithubOnboardingActions.deleteDraft(changelogId, lastDraft.id)
      const nextDraft = drafts.get(this.state.currentDraftIndex)
      StoryFormActions.change({
        title: nextDraft.title,
        body: nextDraft.body
      })
    })
  }

  handleOnChange(fields) {
    StoryFormActions.change(fields)
  }

  handleOnPublish(e) {
    e.preventDefault()
    const payload = {
      body:  StoryFormStore.body,
      contributors: ContributorsStore.validTokensAsString,
      created_at: StoryFormStore.created_at,
      emoji_id: StoryFormStore.emoji_id,
      team_member_only: !StoryFormStore.isPublic,
      title: StoryFormStore.title,
    }
    StoryActions.publish(this.props.changelogId, payload, false, this.handleDraftDeletion.bind(this))
  }

}
