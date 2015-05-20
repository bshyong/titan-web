'use strict'

jest.dontMock('../discussion.jsx')
jest.dontMock('../../lib/pluralize')

describe('Discussion', () => {
  var React, Discussion, TestUtils

  beforeEach(() => {
    React = require('react/addons')
    Discussion = require('../discussion.jsx').Component
    TestUtils = React.addons.TestUtils
  })

  it('has comments count', () => {
    var discussion = TestUtils.renderIntoDocument(
      <Discussion comments={[]} commentsCount={0} />
    )

    var text = TestUtils.findRenderedDOMComponentWithTag(
      discussion, 'h5');
    expect(text.getDOMNode().textContent).toEqual('0 Comments');
  })

})
