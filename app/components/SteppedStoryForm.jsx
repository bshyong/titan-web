import AuthenticatedMixin from './mixins/authenticated_mixin.jsx'
import AutocompleteUserInput from './autocomplete_user_input.jsx'
import Button from '../ui/Button.jsx'
import ChangelogStore from '../stores/changelog_store'
import ContributorsActions from '../actions/ContributorsActions'
import ContributorsInput from './ContributorsInput.jsx'
import EmojiPicker from './EmojiPicker.jsx'
import EmojiStore from '../stores/emoji_store'
import HighlightsActionCreator from '../actions/highlight_actions'
import HighlightsStore from '../stores/highlights_store'
import Icon from '../ui/Icon.jsx'
import MarkdownArea from '../ui/markdown_area.jsx'
import React from 'react'
import RouterContainer from '../lib/router_container'
import SessionStore from '../stores/session_store'
import StoriesActionCreator from '../actions/story_actions'
import StoryActions from '../actions/story_actions'
import StoryFormActions from '../actions/story_form_actions'
import StoryFormStore from '../stores/story_form_store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'
import connectToStores from '../lib/connectToStores.jsx'
import {List, Map, Set} from 'immutable'

@AuthenticatedMixin()
export default class SteppedStoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      slide: 0
    }
  }

  render() {
    return this.renderCurrentSlide.bind(this)()
  }

  renderCurrentSlide() {
    return this[`renderSlide${this.state.slide}`]()
  }

  renderSlide0() {
    return (
      <div>
        <p className="h3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis euismod sollicitudin. Curabitur vitae ligula leo. Proin posuere id erat at placerat. Donec nisl neque, condimentum non est sit amet, luctus condimentum nisi. Cras lobortis at dolor sed bibendum. Etiam egestas imperdiet convallis. Praesent sed ultrices elit. Maecenas ultricies sapien diam, in vehicula massa congue quis. Aenean nec ante ac sapien maximus tempus.
        </p>
        <div className="mb2">
          <input type="text"
            className="field-light block full-width h2"
            style={{height: "auto"}}
            placeholder="What's happened?" />
        </div>
        <div className="right-align">
          <Button action={this.goToSlide(1)}>Next: add a label</Button>
        </div>
      </div>
    )
  }

  renderSlide1() {
    return (
      <div>
        <p className="h3">
          Fusce non luctus nibh. Praesent ac elementum lorem. Sed in eros sit amet ante accumsan fermentum sit amet ac arcu. Integer suscipit finibus nisl sit amet volutpat. Praesent porta, erat eget consequat rutrum, diam metus blandit nunc, ut semper lectus mauris vel turpis. Pellentesque id posuere lorem. Integer tortor ex, tincidunt eget nisi vitae, varius elementum dui. Quisque sed convallis est, nec venenatis ligula. Suspendisse quis consectetur velit.
        </p>
        <div className="mb2">
          <EmojiPicker />
        </div>
        <div className="right-align">
          <Button action={this.goToSlide(2)}>Next: add contributors</Button>
        </div>
      </div>
    )
  }

  renderSlide2() {
    return (
      <div>
        <p className="h3">
          Fusce non luctus nibh. Praesent ac elementum lorem. Sed in eros sit amet ante accumsan fermentum sit amet ac arcu. Integer suscipit finibus nisl sit amet volutpat. Praesent porta, erat eget consequat rutrum, diam metus blandit nunc, ut semper lectus mauris vel turpis. Pellentesque id posuere lorem. Integer tortor ex, tincidunt eget nisi vitae, varius elementum dui. Quisque sed convallis est, nec venenatis ligula. Suspendisse quis consectetur velit.
        </p>
        <div className="mb2">
          <ContributorsInput className="field-light full-width block h3" style={{height: "auto"}} />
        </div>
        <div className="right-align">
          <Button bg="green" action={this.handleOnSubmit.bind(this)}>Post</Button>
        </div>
      </div>
    )
  }

  // FIXME: @chrislloyd actually implement this
  handleOnSubmit(e) {
    this.props.onSubmit({
      title: 'Dummy Title',
      contributors: '@chrislloyd',
      emoji_id: 'abc-123',
    })
  }

  goToSlide(n) {
    return () => { this.setState({slide: n}) }
  }
}

SteppedStoryForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}
