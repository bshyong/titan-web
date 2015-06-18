import {
  NotFoundRoute,
  Redirect,
  Route,
  Routes,
  DefaultRoute
} from 'react-router'
import AdminPage from '../pages/AdminPage.jsx'
import AppPage from '../pages/AppPage.jsx'
import Changelog from '../components/changelog.js.jsx'
import ChangelogPage from '../pages/ChangelogPage.jsx'
import ChangelogBySetsPage from '../pages/ChangelogBySetsPage.jsx'
import ChangelogByDatePage from '../pages/ChangelogByDatePage.jsx'
import ChangelogSettings from '../components/settings/ChangelogSettings.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import EditStoryForm from '../components/edit_story_form.js.jsx'
import FeedPage from '../pages/FeedPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import HighlightPicker from '../components/highlight_picker.js.jsx'
import NewChangelogPage from '../pages/NewChangelogPage.jsx'
import NewStoryPage from '../pages/NewStoryPage.jsx'
import NotFound from '../pages/NotFoundPage.jsx'
import ProfileSettings from '../components/ProfileSettings.jsx'
import React from 'react'
import SettingsPage from '../pages/SettingsPage.jsx'
import SigninSSO from '../components/signin_sso.js.jsx'
import SingleDateChangelogPage from '../pages/SingleDateChangelogPage.jsx'
import StoryComposer from '../components/story_composer.js.jsx'
import StoryPage from '../pages/StoryPage.jsx'
import UserPage from '../pages/UserPage.jsx'
import ChangelogOnboardingPage from '../pages/ChangelogOnboardingPage.jsx'

var internal = (
  <Route handler={AppPage} name="root" path="/">
    <DefaultRoute handler={HomePage} name="home" />
    <NotFoundRoute handler={NotFound} name="not_found" />

    <Route handler={AdminPage} path="/admin/?" />
    <Route handler={HomePage} path="/home/?" />

    <Route handler={ChangelogOnboardingPage} path="/new/?" name="newChangelog" />

    <Route handler={SigninSSO} path="/signin/sso/?" name="sso" />
    <Route handler={UserPage} path="/users/:userId/?" name="profile" />
    <Route handler={FeedPage} path="/feed/?" name="feed" />

    <Route handler={SettingsPage} name="settings" path="/settings/?">
      <Route handler={ChangelogSettings} name="changelog_settings" path=":changelogId/?" />
      <DefaultRoute handler={ProfileSettings} name="profile_settings" />
    </Route>

    <Route handler={DashboardPage} path="/dashboard/?" name="dashboard" />

    <Route handler={ChangelogPage} path="/:changelogId/?">
      <DefaultRoute handler={ChangelogByDatePage} name="changelog" />

      <Route handler={ChangelogBySetsPage} name="changelog_by_sets" path="sets" />

      <Route handler={EditStoryForm} path=":storyId/edit" name="edit" />

      <Route handler={StoryComposer} path="new">
        <DefaultRoute handler={NewStoryPage} name="new" />

        <Route handler={HighlightPicker} path="highlights/?:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":year/:month/:day/:storyId" name="story" />
      <Route handler={StoryPage} path=":year/:month/:day/:storyId#:commentId" name="storyWithComment" />
      <Route handler={SingleDateChangelogPage} path="date/:date/:timeInterval" name="changelog_date" />
    </Route>
  </Route>
)

// For sites on custom domains
var external = (
  <Route handler={AppPage} name="root" path="/">
    <Route handler={ChangelogPage}>
      <Route handler={SigninSSO} path="/signin/sso" name="sso" />

      <DefaultRoute handler={ChangelogByDatePage} name="changelog" />

      <Route handler={ChangelogBySetsPage} name="changelog_by_sets" path="sets" />

      <Route handler={EditStoryForm} path=":storyId/edit/?" name="edit" />

      <Route handler={StoryComposer} path="new/?">
        <DefaultRoute handler={NewStoryPage} name="new" />

        <Route handler={HighlightPicker} path="highlights/?:filter?" name="highlights" />
      </Route>

      <Route handler={StoryPage} path=":year/:month/:day/:storyId/?" name="story" />
      <Route handler={StoryPage} path=":year/:month/:day/:storyId#:commentId" name="storyWithComment" />
      <Route handler={SingleDateChangelogPage} path="date/:date/:timeInterval/?" name="changelog_date" />
    </Route>
  </Route>
)

export default {
  internal, external
}
