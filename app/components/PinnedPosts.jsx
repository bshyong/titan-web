import Badge from './Badge.jsx'
import ChangelogStore from '../stores/changelog_store'
import Link from '../components/Link.jsx'
import PinPostButton from './PinPostButton.jsx'
import React from 'react'
import paramsFor from '../lib/paramsFor'

export default class PinnedPosts extends React.Component {
  static propTypes = {
    changelog: React.PropTypes.object.isRequired,
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
    const { changelog } = this.props

    return <div className="flex-auto p1 relative" style={{minWidth: '50%'}} key={post.id}>
      <Link to="story" params={paramsFor.story({slug: changelog.slug}, post)} className="black">
        <div className="flex flex-center bg-smoke pinned-post p2">
          <div className="flex-none mr2">
            <Badge badge={post.emoji} size="2rem" />
          </div>
          <div className="flex-auto h3">
            {post.title}
          </div>
        </div>
      </Link>
      {this.renderPinButton(post)}
    </div>
  }

  renderPinButton(post) {
    const { changelog } = this.props

    return <div className='mt2 px1 list-reset h5 z3' style={{position: 'absolute', right: 0, top: 0}}>
      <PinPostButton post={post} changelogId={changelog.slug} disabled={!changelog.user_is_team_member} type='hoverText' />
    </div>
  }
}
