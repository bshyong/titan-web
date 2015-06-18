import React from 'react'
import pluralize from '../lib/pluralize'
import SteppedStoryForm from './SteppedStoryForm.jsx'
import {List} from 'immutable'
import StoryCell from './Story/StoryCell.jsx'
import Button from '../ui/Button.jsx'
import StoryForm from './Story/StoryForm.jsx'

const MaxStories = 3

export default class ChangelogBootstrapFlow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: true,
      stories: List([])
    }
  }

  render() {
    return (
      <div>
        <h2 className="mb2">
          Aww, your <img src="https://twemoji.maxcdn.com/svg/261d.svg" alt="first"  style={{height: "1.5rem", verticalAlign: "middle"}} /> post
        </h2>
        <p className="h3 mb3 gray">
          Be as <img src="https://twemoji.maxcdn.com/svg/1f60e.svg" alt="casual" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> or <img src="https://twemoji.maxcdn.com/svg/1f4bc.svg" alt="formal" className="inline-block" style={{height: "1.25rem", verticalAlign: 'middle'}} /> as you want. Even better, give credit to anyone who has helped out by adding them as a contributor.
        </p>
        {this.renderStoriesCount()}
        {this.renderFormOrList()}
      </div>
    )
  }

  renderStoriesCount() {
    if (this.state.stories.isEmpty()) {
      return
    }
    return (
      <p>{this.state.stories.count()} / {pluralize(MaxStories, 'story', 'stories')} written</p>
    )
  }

  renderFormOrList() {
    if (this.state.editing) {
      return this.renderStoryForm()
    } else {
      return <div>
        {this.renderStoriesList()}
        <Button action={this.handleEdit.bind(this)}>Write another</Button>
      </div>
    }
  }

  renderStoryForm() {
    return <StoryForm onSubmit={this.handleSubmitStoryForm.bind(this)} />
  }

  handleSubmitStoryForm(story) {
    this.setState({
      stories: this.state.stories.push(story),
      editing: false,
    })
  }

  handleEdit() {
    this.setState({
      editing: true
    })
  }
}
