import ApplicationNavbar from '../components/application_navbar.jsx'
import Button from '../ui/Button.jsx'
import ChangelogBootstrapFlow from '../components/ChangelogBootstrapFlow.jsx'
import ChangelogCreation from '../components/ChangelogCreation.jsx'
import ChangelogStore from '../stores/changelog_store'
import NewChangelogActions from '../actions/new_changelog_actions'
import NewChangelogStore from '../stores/new_changelog_store'
import React from 'react'
import RouterContainer from '../lib/router_container'
import StoryActions from '../actions/story_actions'
import StoryForm from '../components/Story/StoryForm.jsx'
import StoryFormStore from '../stores/story_form_store'
import connectToStores from '../lib/connectToStores.jsx'
import StoryGifSrc from '../images/interface.gif'
import TeamAdder from '../components/team_adder.jsx'

class Slide extends React.Component {
  render() {
    const { active, children, next, title, onNext, onNextValid } = this.props
    if (!active) {
      return <div/>
    }
    return (
      <div>
        <ApplicationNavbar title="New changelog" />
        <div className="flex flex-center full-width">
          <div className="container full-width px2">
            <div className="sm-col-8 mx-auto px2">
              <h2 className="center mb3">{title}</h2>
              {children}
            </div>
          </div>
        </div>
        <div className="full-width border-top p2">
          <div className="container">
            <div className="sm-col-8 mx-auto p1 right-align">
              <Button disabled={!onNextValid} color="green" bg="white" style="outline" action={this.handleOnNext.bind(this)}>{next}</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleOnNext(e) {
    this.props.onNext(e)
  }
}

Slide.defaultProps = {
  onNextValid: true
}

@connectToStores(NewChangelogStore, ChangelogStore, StoryFormStore)
export default class ChangelogOnboardingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      slide: 0
    }
    this.goToSlide = this._goToSlide.bind(this)
  }

  static getPropsFromStores(props) {
    return {
      memberships: NewChangelogStore.memberships,
      changelogId: ChangelogStore.slug,
      changelog: ChangelogStore.changelog
    }
  }

  render() {
    const { slide } = this.state
    return (
      <div>
        <Slide
          title="Start a new Changelog"
          next="Next"
          onNext={this.handleChangelogCreation.bind(this)}
          onNextValid={NewChangelogStore.isValid}
          active={slide === 0}>
            <div className="mb4 center">
              Changelogs make it easy to share what you and your team have accomplished, from fixing bugs and releasing new features, to organizational updates.
            </div>
            <ChangelogCreation />
        </Slide>

        <Slide title="Invite your team" active={slide === 1} next={"Next"} onNext={this.goToSlide(2)}>
          <TeamAdder memberships={this.props.memberships} changelog={this.props.changelog} changelogId={this.props.changelogId} showBlankEntries={true} />
        </Slide>

        <Slide
          next="Start writing"
          active={slide === 2}
          onNext={this.goToSlide(3)}
          onNextValid={true}>
          <p className="h2 mb4 mt4">
            Be as <img src="https://twemoji.maxcdn.com/svg/1f60e.svg" alt="casual" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> or <img src="https://twemoji.maxcdn.com/svg/1f4bc.svg" alt="formal" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> as you want. Even better, give credit to anyone who has helped out by adding them as a contributor.
          </p>
          <div className="mb0">
            <img src={StoryGifSrc} />
          </div>
        </Slide>
        <Slide
          title="Write your first post"
          next="Post"
          active={slide === 3}
          onNext={this.handleStoryCreation(this.handleTransitionToChangelog())}
          onNextValid={StoryFormStore.isValid()}>

          <StoryForm />
        </Slide>

      </div>
    )
  }

  handleChangelogCreation() {
    NewChangelogActions.create(this.goToSlide(1))
  }

  handleStoryCreation(callback) {
    const storyData = StoryFormStore.data
    const changelogId = ChangelogStore.slug
    return () => {
      StoryActions.publish(changelogId, storyData, false, callback)
    }
  }

  handleTransitionToChangelog() {
    const changelogId = ChangelogStore.slug
    return () => {
      RouterContainer.get().transitionTo("changelog", {changelogId: changelogId})
    }
  }

  _goToSlide(n) {
    return () => {
      this.setState({slide: n})
    }
  }
}
