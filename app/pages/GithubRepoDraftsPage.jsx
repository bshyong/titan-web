import { connect } from 'redux/react'
import * as AuthenticationFormActions from 'actions/authenticationFormActions'
import Authenticated from 'components/mixins/authenticated_mixin.jsx'
import Button from 'ui/Button.jsx'
import connectToStores from 'lib/connectToStores.jsx'
import ContributorsStore from 'stores/ContributorsStore'
import GithubOnboardingActions from 'actions/github_onboarding_actions'
import GithubOnboardingStore from 'stores/github_onboarding_store'
import Icon from 'ui/Icon.jsx'
import Link from 'components/Link.jsx'
import LoadingBar from 'ui/LoadingBar.jsx'
import moment from 'moment'
import React from 'react'
import Router from 'lib/router_container'
import SessionStore from 'stores/session_store'
import statics from 'lib/statics'
import {publish} from 'actions/storyActions'
import StoryForm from 'components/Story/StoryForm.jsx'
import * as storyFormActions from 'actions/storyFormActions'

@Authenticated()
@connect(state => ({
  changelog: state.currentChangelog.changelog,
  changelogId: state.currentChangelog.slug,
  errorMessage: state.storyFields.errorMessage,
  isCreating: state.storyFields.isCreating,
  publishToTwitter: state.storyFields.publishToTwitter,
  storyFields: state.storyFields,
}))
@connectToStores(GithubOnboardingStore, SessionStore)
@statics({
  getPropsFromStores() {
    return {
      drafts: GithubOnboardingStore.drafts,
      draftsLoading: GithubOnboardingStore.loadingDrafts,
      story: {
        contributors: ContributorsStore.contributors,
      },
      error: GithubOnboardingStore.error,
      user: SessionStore.user,
    }
  },
})
export default class GithubRepoDraftsPage extends React.Component {
  constructor(props) {
    super(props)

    this.handleOnChange = this.handleOnChange.bind(this)
    this.state = {
      currentDraftIndex: 0,
    }
  }

  componentWillMount() {
    const user = SessionStore.user
    if (!user) {
      this.props.dispatch(AuthenticationFormActions.changeForm({
        formComponent: 'login',
        formContent: { redirectTo: window.location.pathname },
      }))
    }
  }

  componentDidMount() {
    const { drafts, changelogId, draftsLoading } = this.props

    if (drafts.isEmpty() && !draftsLoading) {
      setTimeout(() => {GithubOnboardingActions.fetchDrafts(changelogId)}, 0)
    }

    if (!drafts.isEmpty()) {
      setTimeout(() => {
        this.props.dispatch(storyFormActions.change({
          title: drafts.get(0).title,
          body: drafts.get(0).body,
          emoji_id: drafts.get(0).emoji_id,
          created_at: moment(drafts.get(0).updated_at).toISOString(),
        }))
      })
    }
  }

  render() {
    const { draftsLoading, error, user } = this.props

    if (!user) {
      return this.renderLoggedOutState()
    }

    const content = () => {
      if (error) {
        return this.renderErrorState()
      }

      return draftsLoading ? this.renderLoadingState() : this.renderDraftStoryForms()
    }()

    return <div className="container">
      {content}
    </div>
  }

  renderLoggedOutState() {
    return (
      <div className="p3 h2 pointer">
        Please <a onClick={() => {
          this.props.dispatch(AuthenticationFormActions.changeForm({
            formComponent: 'login',
            formContent: { redirectTo: window.location.pathname },
          }))
        }}>log in</a> to Assembly to visit this page!
      </div>
    )
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
    const { drafts, storyFields, changelog } = this.props
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
              story={storyFields}
              changelog={changelog}
              onChange={this.handleOnChange}
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
                  action={this.handleOnPublish.bind(this)} disabled={!storyFields.title}>
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
      currentDraftIndex: this.state.currentDraftIndex + 1,
    }, () => {
      GithubOnboardingActions.deleteDraft(changelogId, lastDraft.id)
      const nextDraft = drafts.get(this.state.currentDraftIndex)

      if (nextDraft) {
        this.props.dispatch(storyFormActions.change({
          body: nextDraft.body,
          contributors: nextDraft.contributors,
          created_at: moment(nextDraft.updated_at).toISOString(),
          emoji_id: lastDraft.emoji_id,
          isPublic: true,
          title: nextDraft.title,
        }))
      } else {
        Router.transitionTo('changelog', {changelogId: changelogId})
      }
    })
  }

  handleOnChange(fields) {
    this.props.dispatch(storyFormActions.change(fields))
  }

  handleOnPublish(e) {
    e.preventDefault()
    const { storyFields } = this.props
    const payload = {
      body: storyFields.body,
      contributors: ContributorsStore.validTokensAsString,
      created_at: storyFields.created_at,
      emoji_id: storyFields.emoji_id,
      team_member_only: !storyFields.isPublic,
      title: storyFields.title,
    }
    this.props.dispatch(publish(this.props.changelogId, payload, false, this.handleDraftDeletion.bind(this)))
  }

}
