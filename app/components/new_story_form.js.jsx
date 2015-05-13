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
import StoryStore from 'stores/story_store'
import MarkdownArea from 'components/ui/markdown_area.jsx'
import React from 'react'

export default AuthenticatedMixin(class NewStoryForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      title: this.props.title,
      body: this.props.body,
      isPublic: this.props.isPublic,
      storyId: this.props.id,
      contributors: (this.props.contributors || []).map(c => '@' + c.username).join(', ')
    }

    this.handleChanged = this._handleChanged.bind(this)
    this.handlePublish = this._handlePublish.bind(this)
    this.handleUploaded = this._handleUploaded.bind(this)
    this.handleUploading = this._handleUploading.bind(this)
    this.onStoreChange = this._onStoreChange.bind(this)
    this.handleTogglePrivacy = this._handleTogglePrivacy.bind(this)
  }

  static get defaultProps() {
    return {
      changelogId: RouterContainer.get().getCurrentParams().changelogId
    }
  }

  componentDidMount() {
    StoryFormStore.addChangeListener(this.onStoreChange)
  }

  componentWillUnmount() {
    StoryFormStore.removeChangeListener(this.onStoreChange)
  }

  componentWillReceiveProps(nextProps) {
    let contributors = nextProps.contributors

    if (Array.isArray(contributors)) {
      contributors = contributors.map(c => '@' + c.username).join(', ')
    }

    this.setState({
      ...nextProps,
      contributors: contributors
    })
  }

  render() {
    const {title, body, isPublic, storyId, contributors} = this.state

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
                <Icon icon={isPublic ? 'globe' : 'lock'} fw={true} /> {isPublic ? 'Public' : 'Private'}
              </a>
            </div>

          </div>

          <div className="right">
            <Button bg="white" text={StoryFormStore.isValid() ? 'green' : 'gray' } action={this.props.onPublish || this.handlePublish}>{storyId ? 'Update' : 'Publish'}</Button>
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

  _handleChanged() {
    StoryFormActions.change({
      title: React.findDOMNode(this.refs.title).value,
      body:  React.findDOMNode(this.refs.body).value,
      contributors: React.findDOMNode(this.refs.contributors).value,
      isPublic: this.state.isPublic
    })
  }

  _handleTogglePrivacy() {
    this.setState({
      isPublic: !this.state.isPublic
    }, this.handleChanged)
  }

  _handlePublish(e) {
    e.preventDefault()

    StoriesActionCreator.publish(ChangelogStore.slug, {
      title: this.state.title,
      body:  this.state.body,
      contributors: this.state.contributors,
      team_member_only: !this.state.isPublic
    })
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
        contributors: React.findDOMNode(this.refs.contributors).value
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
        contributors: React.findDOMNode(this.refs.contributors).value
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

})
