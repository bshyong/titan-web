import { List } from 'immutable'

describe('Discussion', () => {
  var React, Discussion, TestUtils

  beforeEach(() => {
    React = require('react/addons')
    Discussion = require('../discussion.jsx').Component
    TestUtils = React.addons.TestUtils
  })

  it('has comments count', () => {
    var discussion = TestUtils.renderIntoDocument(
      <Discussion story={{}} comments={List()} commentsCount={0} />
    )

    var text = TestUtils.findRenderedDOMComponentWithClass(
      discussion, 'ref-comments-count');
    expect(text.getDOMNode().textContent).toEqual('0 Comments');
  })
})
