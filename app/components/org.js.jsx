require('basscss/css/basscss.css')
import {List} from 'immutable'
import {RouteHandler} from 'react-router'
import Avatar from 'components/avatar.js.jsx'
import NewPost from 'components/new_post.js.jsx'
import OrgHeader from 'components/org_header.js.jsx'
import Post from 'components/post.js.jsx'
import PostsActionCreator from 'actions/posts_action_creator'
import PostsStore from 'stores/posts_store'
import React from 'react'
import Tile from 'components/ui/tile.js.jsx'
import Timeline from 'components/ui/timeline.js.jsx'

const ASSEMBLY_ORG_ID = '6f0a1898-cffa-4798-8abd-6964d7fd68ee'

const Org = React.createClass({
  getInitialState() {
    return {
      posts: []
    }
  },

  componentDidMount() {
    PostsStore.addChangeListener(this.onPostAdded)
    PostsActionCreator.fetchAll(ASSEMBLY_ORG_ID)
  },

  componentWillUnmount() {
    PostsStore.removeChangeListener(this.onPostAdded)
  },


  onPostAdded() {
    this.setState({
      posts: PostsStore.all()
    })
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {
    const posts = List(this.state.posts).sortBy((post) => { return post.created_at }).reverse().map((post) => {
      return (
        <div className="mb2" key={post.id}>
          <Post post={post} />
        </div>
      )
    })

    return (
      <div>
        <OrgHeader />

        <div className="container sm-col-8">
          <Timeline>
            <div className="ml2 px3 py2 mid-gray">Today</div>

            <div className="mxn2 mb3">
              <Tile>
                <div className="clearfix py2 px2">
                  <div className="left">
                    <Avatar user={{username: 'chrislloyd'}} size="2rem" />
                  </div>
                  <div className="px2 overflow-hidden">
                    <NewPost org={{id: ASSEMBLY_ORG_ID}} />
                  </div>
                </div>

              </Tile>
            </div>
            {posts}
          </Timeline>

          <RouteHandler />
        </div>
      </div>
    )
  }
})

export default Org
