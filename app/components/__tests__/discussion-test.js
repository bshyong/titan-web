// import { createRedux } from 'redux'
// import { Provider } from 'redux/react'
// import { List } from 'immutable'
//
// describe('Discussion', () => {
//   let React, Discussion, TestUtils
//
//   beforeEach(() => {
//     React = require('react/addons')
//     Discussion = require('../discussion.jsx').Component
//     TestUtils = React.addons.TestUtils
//   })
//
//   it('has comments count', () => {
//     const redux = createRedux({ test: () => ({}) });
//     const discussion = TestUtils.renderIntoDocument(
//       <Provider redux={redux}>
//         {() => <Discussion story={{}} comments={List()} commentsCount={0} ref="discussion" />}
//       </Provider>
//     )
//
//     const text = TestUtils.findRenderedDOMComponentWithClass(
//       discussion.refs.discussion,
//       'ref-comments-count'
//     )
//     expect(text.getDOMNode().textContent).toEqual('0 Comments');
//   })
// })
