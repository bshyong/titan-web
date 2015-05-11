import {Link} from 'react-router'
import {List} from 'immutable'
import AuthenticatedMixin from 'components/mixins/authenticated_mixin.jsx'
import Button from 'components/ui/button.js.jsx'
import ChangelogStore from 'stores/changelog_store'
import HighlightsActionCreator from 'actions/highlight_actions'
import HighlightsStore from 'stores/highlights_store'
import Icon from 'components/ui/icon.js.jsx'
import Router from 'lib/router_container'
import RouterContainer from 'lib/router_container'
import StoriesActionCreator from 'actions/story_actions'
import StoryFormActions from 'actions/story_form_actions'
import StoryFormStore from 'stores/story_form_store'
import StoryActions from 'actions/story_actions'
import StoryPageStore from 'stores/story_page_store'
import StoriesStore from 'stores/stories_store'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import React from 'react'

export default AuthenticatedMixin(class StoryForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.getInitialState()

    this.handleChanged = this._handleChanged.bind(this)
    this.handlePublish = this._handlePublish.bind(this)
    this.handleUploaded = this._handleUploaded.bind(this)
    this.handleUploading = this._handleUploading.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
    this.onStoryFetched = this._onStoryFetched.bind(this)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  componentDidMount() {
    StoryPageStore.addChangeListener(this.onStoryFetched)
    StoryFormStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    StoryPageStore.removeChangeListener(this.onStoryFetched)
    StoryFormStore.removeChangeListener(this.onStoreChange)
  }

  render() {
    const {title, body, isPublic, contributors, storyId} = this.state

    return (
      <div className="flex flex-column">

        <div className="mb2">
          <input type="text"
            className="field-light full-width block mb0"
            placeholder="What changed?"
            value={title}
            onChange={this.handleChanged}
            ref="title" />
        </div>

        <div className="mb2">
          <MarkdownArea
            placeholder="What did you do?"
            ref="body"
            value={body}
            onChange={this.handleChanged} />
        </div>

        <div className="mb2">
          <input type="text" className="field-light full-width block mb0" placeholder="@mention any contributors who helped" value={contributors} onChange={this.handleChanged} ref="contributors" />
        </div>

        <div className="clearfix border-top">
          <div className="left">

            <div className="clearfix">
              <a className="block left p1 black" onClick={this.handleTogglePrivacy} onTouchStart={this.handleTogglePrivacy}>
                <Icon icon={this.state.isPublic ? 'globe' : 'lock'} fw={true} />
              </a>
            </div>

          </div>

          <div className="right">
            <Button bg="white" text={StoryFormStore.isValid() ? 'green' : 'gray' } action={this.handlePublish}>{storyId ? 'Update' : 'Publish'}</Button>
          </div>
        </div>

        <div className="mt2">
          <Link to="highlights" params={{changelogId: this.props.changelogId}}>
            View Highlights
          </Link>
        </div>
      </div>
    )
  }

  _handleChanged(e) {
    StoryFormActions.change({
      title: React.findDOMNode(this.refs.title).value,
      body:  React.findDOMNode(this.refs.body).value,
      contributors: React.findDOMNode(this.refs.contributors).value,
      isPublic: false
    })
  }

  _handlePublish(e) {
    e.preventDefault()

    if (this.state.storyId) {
      StoriesActionCreator.edit(ChangelogStore.slug, this.state.storyId, {
        title: this.state.title,
        body:  this.state.body,
        contributors: this.state.contributors
      })
    } else {
      StoriesActionCreator.publish(ChangelogStore.slug, {
        title: this.state.title,
        body:  this.state.body,
        contributors: this.state.contributors
      })
    }
  }

  _handleUploaded(oldText, fileText) {
    let body = React.findDOMNode(this.refs.body)
    let value = body && body.value

    if (!value) {
      return
    }

    // next tick
    setTimeout(() => {

      StoryFormActions.change({
        title: React.findDOMNode(this.refs.title).value,
        body:  value.replace(oldText, fileText),
        contributors: React.findDOMNode(this.refs.contributors).value,
        isPublic: false
      })
    }, 0)
  }

  _handleUploading(fileText) {
    let body = React.findDOMNode(this.refs.body)
    let value = body && body.value

    if (!value) {
      return
    }

    // next tick
    setTimeout(() => {
      StoryFormActions.change({
        title: React.findDOMNode(this.refs.title).value,
        body: `${React.findDOMNode(this.refs.body).value} ${fileText}`,
        contributors: React.findDOMNode(this.refs.contributors).value,
        isPublic: false
      })
    }, 0)
  }

  getStateFromStores() {
    const { storyId, changelogId } = Router.get().getCurrentParams()

    return {
      storyId:      storyId,
      changelogId:  changelogId,
      title:        StoryFormStore.title,
      body:         StoryFormStore.body,
      contributors: StoryFormStore.contributors,
      isPublic:     StoryFormStore.isPublic
    }
  }

  _onStoreChange() {
    this.setState(this.getStateFromStores())
  }

  _onStoryFetched() {
    const story = StoryPageStore.story

    if (story) {
      this.setState({
        title: story.title,
        body: story.body,
        contributors: story.contributors.map(u => '@' + u.username).join(', '),
        isPublic: story.isPublic
      })
    }
  }

  // if storyId exists, try to fetch from existing store;
  // if not found, fetch it from API
  // if storyId doesn't exist, use the blank slate from StoryFormStore
  getInitialState() {
    const { storyId, changelogId } = Router.get().getCurrentParams()

    if (storyId) {
      const story = StoriesStore.get(storyId)

      if (story) {
        return {
          storyId:      storyId,
          changelogId:  changelogId,
          title:        story.title,
          body:         story.body,
          contributors: story.contributors.map(c => '@' + c.username).join(', '),
          isPublic:     story.isPublic
        }
      } else {
        StoryActions.fetch(changelogId, storyId)
        return {
          storyId: storyId,
          changelogId: changelogId
        }
      }
    } else {
      return this.getStateFromStores()
    }
  }

})
