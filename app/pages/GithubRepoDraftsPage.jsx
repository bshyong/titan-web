import ApplicationNavbar from '../components/application_navbar.jsx'
import Button from '../ui/Button.jsx'
import ContributorsStore from '../stores/ContributorsStore'
import GithubOnboardingActions from '../actions/github_onboarding_actions'
import GithubOnboardingStore from '../stores/github_onboarding_store'
import Link from '../components/Link.jsx'
import LoadingBar from '../ui/LoadingBar.jsx'
import React from 'react'
import Router from '../lib/router_container'
import SessionActions from '../actions/SessionActions'
import SessionStore from '../stores/session_store'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/Story/StoryForm.jsx'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import connectToStores from '../lib/connectToStores.jsx'
import Icon from '../ui/Icon.jsx'
import moment from 'moment'
import ContributorsActions from '../actions/ContributorsActions'
import ChangelogStore from '../stores/changelog_store'

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
      },
      changelog: ChangelogStore.changelog,
      error: GithubOnboardingStore.error,
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
        body: drafts.get(0).body,
        created_at: moment(drafts.get(0).updated_at).toISOString()
      })})
    }
  }

  render() {
    const { draftsLoading, error } = this.props

    const content = () => {
      if (error) {
        return this.renderErrorState()
      } else {
        return draftsLoading ? this.renderLoadingState() : this.renderDraftStoryForms()
      }
    }()

    return <div className="container">
      {content}
    </div>
  }

  renderErrorState() {
    const { error, changelogId } = this.props
    return (
      <div className="p3">
        <h2>{error}</h2>
        <a href={`${API_URL}/auth/github?origin=${window.location.origin}${Router.get().makeHref('githubRepos', {changelogId})}`}>Click to authenticate with Github</a>
      </div>
    )
  }

  renderLoadingState() {
    const { draftsLoading } = this.props

    return (
      <div className="p3">
        <h2>Generating drafts..</h2>
        <LoadingBar loading={draftsLoading} />
      </div>
    )
  }

  renderDraftStoryForms() {
    const { drafts, story, changelog } = this.props
    const { currentDraftIndex } = this.state

    if (drafts.isEmpty() || currentDraftIndex > drafts.size) { return this.renderEmptyState() }

    return (
      <div>
        <h4 className="gray pointer" onClick={this.handleDeleteAll.bind(this)}>
          <Icon icon="angle-left" /> Back to Changelog
        </h4>
        <div className="p3">
          <div className="mt2">
            <StoryForm
              story={story}
              changelog={changelog}
              onChange={this.handleOnChange.bind(this)}
              showDetails={true} />
            <div className="py2 flex flex-center">
              <div className="flex-auto" />
              <div className="gray flex-none mr2">
                Draft: {currentDraftIndex + 1} of {drafts.size + 1}
              </div>
              <div className="mr2 flex-none">
                <Button
                  color="gray"
                  style="outline"
                  action={this.handleDraftDeletion.bind(this)}>
                  Skip
                </Button>
              </div>
              <div className="flex-none">
                <Button
                  color="orange"
                  style="outline"
                  action={this.handleOnPublish.bind(this)} disabled={!StoryFormStore.isValid()}>
                  Post
                </Button>
              </div>
            </div>
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
          <Link to="githubRepos" params={{changelogId: changelogId}}>Click here to generate drafts from another Github repo</Link>
        </div>
      </div>
    )
  }

  handleDeleteAll() {
    const { changelogId } = this.props
    GithubOnboardingActions.deleteAllDrafts(changelogId)
    Router.transitionTo('changelog', {changelogId: changelogId})
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
        body: nextDraft.body,
        contributors: nextDraft.contributors,
        created_at: moment(nextDraft.updated_at).toISOString(),
        isPublic: true,
        title: nextDraft.title,
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
