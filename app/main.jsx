require('basscss/css/basscss.min.css')
require('./styles.css')

import React from 'react'
import Router from 'react-router'

const {Route, DefaultRoute, RouteHandler, HistoryLocation} = Router
import {List} from 'immutable'

import NewPost from './components/new_post.js.jsx'
import Post from './components/post.js.jsx'
import PostsActionCreator from './actions/posts_action_creator'
import PostsStore from './stores/posts_store'
import Tile from './components/ui/tile.js.jsx'
import Navbar from './components/ui/navbar.js.jsx'
import Avatar from './components/avatar.js.jsx'

const ASSEMBLY_ORG_ID = '8ace1942-bfc3-4d2e-95dc-8882785cf7f4'

const App = React.createClass({

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

  render() {

    const posts = List(this.state.posts).sortBy((post) => { return post.created_at }).reverse().map((post) => {
      return (
        <div className="mb2" key={post.id}>
          <Tile>
            <div className="px2">
              <Post post={post} />
            </div>
          </Tile>
        </div>
      )
    })

    return <div>
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
      <Navbar>
        <div className="clearfix">
          <div className="left">
            Assembly <span className="mid-gray">Changelog</span>
          </div>
          <div className="right">
            <Avatar user={{username: 'chrislloyd'}} size={24} />
          </div>
        </div>
      </Navbar>

      <div className="container col-8">
        <div className="mb3">
          <Tile>
            <div className="p2">
              <NewPost />
            </div>
          </Tile>
        </div>

        <div>
          {posts}
        </div>

        <RouteHandler />
      </div>
    </div>
  },

  onPostAdded() {
    this.setState({
      posts: PostsStore.all()
    })
  }
})


const routes = (
  <Route handler={App} path="*">
  </Route>
)

Router.run(routes, HistoryLocation, (Handler) => {
  React.render(<Handler />, document.body)
})
