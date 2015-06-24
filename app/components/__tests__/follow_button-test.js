describe('FollowButton', () => {
  let React, FollowButton, TestUtils

  beforeEach(() => {
    React = require('react/addons')
    FollowButton = require('../follow_button.jsx')
    TestUtils = React.addons.TestUtils
  })

  describe('handleClick()', () => {
    let SigninScrimActions

    beforeEach(() => {
      SigninScrimActions = require('../../actions/SigninScrimActions')
    })

    describe('not signed in', () => {
      it('calls SigninScrimActions.initialize()', () => {
        spyOn(SigninScrimActions, 'initialize')

        let followButton = TestUtils.renderIntoDocument(
          <FollowButton changelogId="changelog" toggled={true} />
        )

        let button = TestUtils.findRenderedDOMComponentWithTag(
          followButton,
          'button'
        )

        TestUtils.Simulate.click(button)

        expect(SigninScrimActions.initialize).toHaveBeenCalled()
      })
    })

    describe('signed in', () => {
      const makeButton = (toggled) => {
        let followButton = TestUtils.renderIntoDocument(
          <FollowButton changelogId="changelog" toggled={toggled} />
        )

        return TestUtils.findRenderedDOMComponentWithTag(
          followButton,
          'button'
        )
      }

      let FollowActions, SessionStore

      beforeEach(() => {
        FollowActions = require('../../actions/follow_actions')
        SessionStore = require('../../stores/session_store')

        spyOn(SessionStore, 'isSignedIn').and.callFake(() => {
          return true
        })
      })

      it('calls FollowActions.unfollow() if toggled', () => {
        spyOn(FollowActions, 'unfollow')

        TestUtils.Simulate.click(makeButton(true))

        expect(FollowActions.unfollow).toHaveBeenCalledWith('changelog')
      })

      it('calls FollowActions.follow() if untoggled', () => {
        spyOn(FollowActions, 'follow')

        TestUtils.Simulate.click(makeButton(false))

        expect(FollowActions.follow).toHaveBeenCalledWith('changelog')
      })
    })
  })
})
