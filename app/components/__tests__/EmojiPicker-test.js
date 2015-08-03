describe('EmojiPicker', () => {
  let React, TestUtils, EmojiPicker

  beforeEach(() => {
    React = require('react/addons')
    TestUtils = React.addons.TestUtils
    EmojiPicker = require('../EmojiPicker.jsx').Component
  })

  describe('input', () => {
    let picker, input
    beforeEach(() => {
      picker = React.render(<EmojiPicker />, document.body)
      input = picker.refs.search.getDOMNode()
    })

    // describe('search', () => {
    //   it('searches for emoji if given an emoji name', () => {
    //     TestUtils.Simulate.change(input, { target: { value: 's' } })
    //     expect(picker.state.query).toEqual('s')
    //   })
    // })

    // describe('search with emoji', () => {
    //   it('finds an emoji by character if given an emoji', () => {
    //     TestUtils.Simulate.change(input, { target: { value: '😀' } })
    //     expect(picker.state.query).toEqual('😀')
    //   })
    // })
  })
})
