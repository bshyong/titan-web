import React from 'react'
import ChangelogBootstrapFlow from '../components/ChangelogBootstrapFlow.jsx'

import ApplicationNavbar from '../components/application_navbar.jsx'
import Button from '../ui/Button.jsx'

import ChangelogCreation from '../components/ChangelogCreation.jsx'
import StoryForm from '../components/Story/StoryForm.jsx'

import NewChangelogActions from '../actions/new_changelog_actions'

class Slide extends React.Component {
  render() {
    const { active, children, next, title, onNext } = this.props
    if (!active) {
      return <div/>
    }
    return (
      <div>
        <ApplicationNavbar title="New changelog" />
        <div className="flex flex-center full-width" style={{height: "calc(100vh - 3.5rem - 2.25rem - 4rem - 2px)"}}>
          <div className="container full-width p2">
            <div className="md-col-8 mx-auto">
              <h1 className="center mb4">{title}</h1>
              {children}
            </div>
          </div>
        </div>
        <div className="bg-smoke p3">
          <div className="container right-align">
            <Button color="orange" bg="white" style="outline" action={this.handleOnNext.bind(this)}>{next}</Button>
          </div>
        </div>
      </div>
    )
  }

  handleOnNext(e) {
    this.props.onNext(e)
  }
}

export default class ChangelogOnboardingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      slide: 0
    }
    this.goToSlide = this._goToSlide.bind(this)
  }

  handleChangelogCreation() {
    NewChangelogActions.create(this.goToSlide.bind(this, 1))
  }

  render() {
    const { slide } = this.state
    return (
      <div>
        <Slide
          title="Start a Changelog"
          next="Next"
          onNext={this.handleChangelogCreation.bind(this)}
          active={slide === 0}>
            <ChangelogCreation />
        </Slide>
        <Slide title="Fill out your new changelog" next="Ok, got it!" active={slide === 1} onNext={this.goToSlide(2)}>
          <p className="h3 mb3 gray">
            Be as <img src="https://twemoji.maxcdn.com/svg/1f60e.svg" alt="casual" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> or <img src="https://twemoji.maxcdn.com/svg/1f4bc.svg" alt="formal" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> as you want. Even better, give credit to anyone who has helped out by adding them as a contributor.
          </p>
        </Slide>
        <Slide title="Start with 3 posts: 1 of 3" next="Write another post" active={slide === 2} onNext={this.goToSlide(3)}>

          <div className="mb4">

            <div className="flex flex-justify pill overflow-hidden" style={{height: ".5rem"}}>
              <div className="flex-auto bg-green"></div>
              <div className="flex-auto border-left border-white bg-smoke"></div>
              <div className="flex-auto border-left border-white bg-smoke"></div>
            </div>

          </div>

          <StoryForm />
        </Slide>
        <Slide title="Start with 3 posts: 2 of 3" next="Write one more post" active={slide === 3} onNext={this.goToSlide(4)}>

          <div className="mb4">

            <div className="flex flex-justify pill overflow-hidden" style={{height: ".5rem"}}>
              <div className="flex-auto bg-green"></div>
              <div className="flex-auto border-left border-white bg-green"></div>
              <div className="flex-auto border-left border-white bg-smoke"></div>
            </div>

          </div>

          <StoryForm />
        </Slide>
        <Slide title="Start with 3 posts: 3 of 3" next="Check out your new changelog" active={slide === 4} onNext={function() { alert('going to changelog') }}>

          <div className="mb4">

            <div className="flex flex-justify pill overflow-hidden" style={{height: ".5rem"}}>
              <div className="flex-auto bg-green"></div>
              <div className="flex-auto border-left border-white bg-green"></div>
              <div className="flex-auto border-left border-white bg-green"></div>
            </div>
          </div>

          <StoryForm />
        </Slide>
      </div>
    )
  }

  _goToSlide(n) {
    return () => {
      this.setState({slide: n})
    }
  }
}
