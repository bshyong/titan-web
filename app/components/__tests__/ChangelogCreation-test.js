describe('ChangelogCreation', () => {
  let React,
      TestUtils,
      ChangelogCreation,
      RadioGroup,
      NewChangelogActions

  beforeEach(() => {
    React = require('react/addons')
    TestUtils = React.addons.TestUtils
    ChangelogCreation = require('../ChangelogCreation.jsx').Component
    RadioGroup = require('react-radio-group')
    NewChangelogActions = require('../../actions/new_changelog_actions')
  })

  describe('visibility', () => {
    let component

    beforeEach(() => {
      component = React.render(
        <ChangelogCreation changelog={{ is_members_only: false }} />,
        document.body
      )
    })

    it('toggles visibility on change', () => {
      spyOn(NewChangelogActions, 'formChange')
      let radioGroup = TestUtils.
        findRenderedComponentWithType(component, RadioGroup)

      TestUtils.Simulate.change(radioGroup.refs.private.getDOMNode(), {})

      expect(NewChangelogActions.formChange).
        toHaveBeenCalledWith('is_members_only', true)
    })
  })
})
