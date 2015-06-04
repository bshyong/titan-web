describe('EmojiPicker', () => {
  let React, TestUtils, EmojiPicker, EmojiActions

  beforeEach(() => {
    React = require('react/addons')
    TestUtils = React.addons.TestUtils
    EmojiPicker = require('../EmojiPicker.jsx').Component
    EmojiActions = require('../../actions/emoji_actions')
    spyOn(EmojiActions, 'fetch')
  })

  describe('input', () => {
    let picker, input
    beforeEach(() => {
      picker = React.render(<EmojiPicker />, document.body)
      input = TestUtils.findRenderedDOMComponentWithTag(
        picker,
        'input'
      ).getDOMNode()

      spyOn(EmojiActions, 'search')
      spyOn(EmojiActions, 'find')
    })

    describe('search', () => {
      it('searches for emoji if given an emoji name', () => {
        TestUtils.Simulate.change(input, { target: { value: 's' } })

        expect(EmojiActions.search).toHaveBeenCalledWith('s')
        expect(EmojiActions.find).not.toHaveBeenCalled()
      })
    })

    describe('find', () => {
      it('finds an emoji by character if given an emoji', () => {
        TestUtils.Simulate.change(input, { target: { value: '😀' } })

        expect(EmojiActions.search).not.toHaveBeenCalled()
        expect(EmojiActions.find).toHaveBeenCalledWith('😀')
      })
    })
  })
})
