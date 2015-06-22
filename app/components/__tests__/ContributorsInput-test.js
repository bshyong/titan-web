describe('ContributorsInput', () => {
  let React,
      TestUtils,
      ContributorsInput,
      ContributorsActions,
      Immutable,
      List

  beforeEach(() => {
    React = require('react/addons')
    TestUtils = React.addons.TestUtils
    ContributorsInput = require('../ContributorsInput.jsx').Component
    ContributorsActions = require('../../actions/ContributorsActions')
    List = require('immutable').List
  })

  describe('handleChange()', () => {
    let input

    beforeEach(() => {
      input = React.render(<ContributorsInput validTokens={List([])} />, document.body)
    })

    it('updates this.selectionStart', () => {
      expect(input.selectionStart).toBeFalsy()
      TestUtils.Simulate.change(
        React.findDOMNode(input.refs.input).querySelectorAll('input')[0],
        { target: { value: '@', selectionStart: 1 } }
      )
      expect(input.selectionStart).toEqual(1)
    })

    it('calls ContributorsActions.setContributorsFromString()', () => {
      spyOn(ContributorsActions, 'setContributorsFromString')

      TestUtils.Simulate.change(
        React.findDOMNode(input.refs.input).querySelectorAll('input')[0],
        { target: { value: '@han_solo', selectionStart: 1 } }
      )

      expect(ContributorsActions.setContributorsFromString).
        toHaveBeenCalledWith('@han_solo')
    })
  })
})
