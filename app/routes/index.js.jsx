import {
  NotFoundRoute,
  Route,
  DefaultRoute
} from 'react-router'
import AdminPage from 'pages/AdminPage.jsx'
import AppPage from 'pages/AppPage.jsx'
import ChangelogByDatePage from 'pages/ChangelogByDatePage.jsx'
import ChangelogBySetsPage from 'pages/ChangelogBySetsPage.jsx'
import ChangelogPage from 'pages/ChangelogPage.jsx'
import ChangelogSettings from 'components/settings/ChangelogSettings.jsx'
import DashboardPage from 'pages/DashboardPage.jsx'
import EditStoryForm from 'components/edit_story_form.js.jsx'
import FeedPage from 'pages/FeedPage.jsx'
import GithubCallback from 'components/GithubCallback.jsx'
import GithubRepoDraftsPage from 'pages/GithubRepoDraftsPage.jsx'
import GithubRepoSelectionPage from 'pages/GithubRepoSelectionPage.jsx'
import HighlightPicker from 'components/HighlightPicker.jsx'
import HomePage from 'pages/HomePage.jsx'
import ImpersonatePage from 'pages/ImpersonatePage.jsx'
import InvitationPage from 'pages/InvitationPage.jsx'
import InviteChangelogMembersPage from 'pages/InviteChangelogMembersPage.jsx'
import NewChangelogPage from 'pages/NewChangelogPage.jsx'
import NewStoryPage from 'pages/NewStoryPage.jsx'
import NotFound from 'pages/NotFoundPage.jsx'
import PasswordResetPage from 'components/Authentication/PasswordResetPage.jsx'
import ProfileSettings from 'components/ProfileSettings.jsx'
import React from 'react'
import SettingsPage from 'pages/SettingsPage.jsx'
import SignupPage from 'pages/SignupPage.jsx'
import SingleDateChangelogPage from 'pages/SingleDateChangelogPage.jsx'
import StoryComposer from 'components/story_composer.js.jsx'
import StoryPage from 'pages/StoryPage.jsx'
import TermsPage from 'pages/TermsPage.jsx'
import TwitterCallback from 'components/TwitterCallback.jsx'
import UserPage from 'pages/UserPage.jsx'
import FaqPage from 'pages/FaqPage.jsx'
import NewFaqPage from 'pages/NewFaqPage.jsx'
import migration from 'pages/migration.jsx'

var internal = (
  <Route handler={AppPage} name="root" path="/">
    <DefaultRoute handler={HomePage} name="home" />
    <NotFoundRoute handler={NotFound} name="not_found" />

    <Route handler={AdminPage} path="/admin" />
    <Route handler={HomePage} path="/home" />
    <Route handler={NewFaqPage} path="/new-assembly-faq" name="newAssemblyFaq" />
    <Route handler={migration} path="/migration" name="migration" />

    <Route handler={NewChangelogPage} path="/new" name="newChangelog" />

    <Route handler={TwitterCallback} path="/auth/twitter/callback" name="twitterCallback" />
    <Route handler={GithubCallback} path="/auth/github/callback" name="githubCallback" />
    <Route handler={PasswordResetPage} path="/password/reset" name="passwordReset" />
    <Route handler={UserPage} path="/users/:userId" name="profile" />
    <Route handler={ImpersonatePage} path="/users/:userId/impersonate" name="impersonate" />
    <Route handler={FeedPage} path="/feed" name="feed" />
    <Route handler={TermsPage} path="/terms" name="terms" />
    <Route handler={TermsPage} path="/tos" name="tos" />

    <Route handler={SettingsPage} name="settings" path="/settings">
      <Route handler={ChangelogSettings} name="changelog_settings" path=":changelogId" />
      <DefaultRoute handler={ProfileSettings} name="profile_settings" />
    </Route>

    <Route handler={DashboardPage} path="/dashboard" name="dashboard" />
    <Route handler={InvitationPage} path="/invitations/:invite_token" name="invitation" />

    <Route handler={SignupPage} path="/signup" name="signup" />
    <Route handler={ChangelogPage} path="/:changelogId">
      <DefaultRoute handler={ChangelogByDatePage} name="changelog" />
      <Route handler={GithubRepoSelectionPage} path="github" name="githubRepos" />
      <Route handler={GithubRepoDraftsPage} path="github/drafts" name="githubDrafts" />

      <Route handler={InviteChangelogMembersPage} path="invite" name="inviteChangelogMembers" />

      <Route handler={ChangelogBySetsPage} name="changelog_by_sets" path="sets" />

      <Route handler={EditStoryForm} path=":storyId/edit" name="edit" />

      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={NewStoryPage} name="new" />

        <Route handler={HighlightPicker} path="highlights:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":year/:month/:day/:storyId" name="story" />
      <Route handler={StoryPage} path=":year/:month/:day/:storyId#:commentId" name="storyWithComment" />
      <Route handler={SingleDateChangelogPage} path="date/:date/:timeInterval" name="changelog_date" />
    </Route>

    <Route handler={FaqPage} path="/faq" name="faq" />

  </Route>
)

// For sites on custom domains
var external = (
  <Route handler={AppPage} name="root" path="/">
    <Route handler={TwitterCallback} path="/auth/twitter/callback" name="twitterCallback" />
    <Route handler={GithubCallback} path="/auth/github/callback" name="githubCallback" />
    <Route handler={ChangelogPage}>
      <DefaultRoute handler={ChangelogByDatePage} name="changelog" />

      <Route handler={GithubRepoSelectionPage} path="github" name="githubRepos" />
      <Route handler={GithubRepoDraftsPage} path="github/drafts" name="githubDrafts" />

      <Route handler={ChangelogBySetsPage} name="changelog_by_sets" path="sets" />

      <Route handler={EditStoryForm} path=":storyId/edit" name="edit" />

      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={NewStoryPage} name="new" />

        <Route handler={HighlightPicker} path="highlights:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":year/:month/:day/:storyId" name="story" />
      <Route handler={StoryPage} path=":year/:month/:day/:storyId#:commentId" name="storyWithComment" />
      <Route handler={SingleDateChangelogPage} path="date/:date/:timeInterval" name="changelog_date" />
    </Route>
  </Route>
)

export default {
  internal, external
}
