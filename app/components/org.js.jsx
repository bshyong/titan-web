require('basscss/css/basscss.css')
import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import AuthenticatedComponent from 'components/authenticated_component.js.jsx'
import NewPost from 'components/new_post.js.jsx'
import OrgHeader from 'components/org_header.js.jsx'
import Story from 'components/story.js.jsx'
import PostsActionCreator from 'actions/posts_action_creator'
import PostsStore from 'stores/posts_store'
import React from 'react'
import RouterContainer from 'lib/router_container'
import Timeline from 'components/ui/timeline.js.jsx'

export default AuthenticatedComponent(class Org extends React.Component {
  constructor(props) {
    props.changelogId = RouterContainer.get().getCurrentParams().changelogId
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    this.changeListener = this.onPostAdded.bind(this)
    PostsStore.addChangeListener(this.changeListener)
    PostsActionCreator.fetchAll(this.props.changelogId)
  }

  componentWillUnmount() {
    PostsStore.removeChangeListener(this.changeListener)
  }

  onPostAdded() {
    this.setState({
      posts: PostsStore.all()
    })
  }

  render() {
    const posts = List(this.state.posts).sortBy((post) => { return post.created_at }).reverse().map((post) => {
      return (
        <div className="mb2" key={post.id}>
          <Story story={post} />
        </div>
      )
    })

    return (
      <div>
        <OrgHeader />

        <div className="container sm-col-8">
          <Timeline>
            <div className="ml2 px3 py2 mid-gray">Today</div>

            {this.props.signedIn ? <NewPost org={{id: this.props.changelogId}} /> : null}
            {posts}
          </Timeline>

          <RouteHandler />
        </div>
      </div>
    )
  }
})
