import AuthenticatedMixin from '../components/mixins/authenticated_mixin.jsx'
import Button from '../ui/Button.jsx'
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
import connectToStores from '../lib/connectToStores.jsx'

@AuthenticatedMixin()
@connectToStores(StoryFormStore)
export default class NewStoryPage extends React.Component {
  static willTransitionTo(transition, params, query) {

    if (query.highlight) {
      // TODO load if page refreshed
    } else if (query.type=="helloWorld") {
      StoryFormActions.change({
        title: "Hello World",
        team_member_only: false,
        contributors: [],
        body: "Hey @core\n\nI set up this Changelog so we can better share our daily work and collect feedback amongst our group.\n\nIt's simple to use; just log a quick note everytime you finish something or have something to share. You can also add a quick description, image, or link if you want too. Here are some examples.\n\n* 'Emojified all the things, replaced all nouns with an emoji'\n* 'Just finished the new homepage design, feedback?'\n* 'Released Version 2 in production'\n\nWhat do you think?"
      })
    }
    else {
      StoryFormActions.clearAll()
      ContributorsActions.resetContributors(SessionStore.user)
    }
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.changelogSlug()
    }
  }

  static getPropsFromStores(props) {
    return {
      ...props,
      story: {
        ...StoryFormStore.data,
        contributors: ContributorsStore.contributors
      }
    }
  }

  render() {
    return (
      <div className="container py4 px2 sm-px0">
        <StoryFormWalkthrough>
          <StoryForm story={this.props.story} onChange={this.handleOnChange.bind(this)} />
        </StoryFormWalkthrough>
        <div className="py2 right-align">
          <Button
            color="orange"
            style="outline"
            action={this.handleOnPublish.bind(this)} disabled={!StoryFormStore.isValid()}>
            Post
          </Button>
        </div>
      </div>
    )
  }

  handleOnChange(fields) {
    StoryFormActions.change(fields)
  }

  handleOnPublish(e) {
    e.preventDefault()
    StoryActions.publish(this.props.changelogId, StoryFormStore.data)
  }
}
