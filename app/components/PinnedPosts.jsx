import Badge from './Badge.jsx'
import PinPostButton from './PinPostButton.jsx'
import React from 'react'

export default class PinnedPosts extends React.Component {
  static propTypes = {
    changelogId: React.PropTypes.string.isRequired,
    posts: React.PropTypes.object.isRequired,
  }

  render() {
    const { posts } = this.props
    if (posts.isEmpty()) {
      return null
    }
    return <div className="mt2 flex flex-wrap">
      {posts.sortBy(p => p.pinned_at).map(p => {
        return this.renderPinnedPost(p)
      })}
    </div>
  }

  renderPinnedPost(post) {
    const { changelogId } = this.props

    return <div className="flex-auto p1 visible-hover-wrapper relative" style={{minWidth: '50%'}} key={post.id}>
        <div className="flex flex-center bg-smoke pinned-post p2">
          <div className="flex-none mr2">
            <Badge badge={post.emoji} size="2rem" />
          </div>
          <div className="flex-auto h3">
            {post.title}
          </div>
        </div>
        <div className="py2 px1 pointer list-reset h5" style={{position: 'absolute', right: 0, top: 0}}>
          <PinPostButton post={post} changelogId={changelogId} type='hover' />
        </div>
    </div>
  }
}
