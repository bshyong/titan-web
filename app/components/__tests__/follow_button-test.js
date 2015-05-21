'use strict'

jest.dontMock('../follow_button.jsx')

describe('FollowButton', () => {
  let React, FollowButton, TestUtils

  beforeEach(() => {
    React = require('react/addons')
    FollowButton = require('../follow_button.jsx')
    TestUtils = React.addons.TestUtils
  })

  describe('handleClick()', () => {
    let SessionActions

    beforeEach(() => {
      SessionActions = require('../../actions/session_actions')
    })

    describe('not signed in', () => {
      it('calls SessionActions.signin()', () => {
        let followButton = TestUtils.renderIntoDocument(
          <FollowButton changelogId="changelog" toggled={true} />
        )

        let button = TestUtils.findRenderedDOMComponentWithTag(
          followButton,
          'button'
        )

        TestUtils.Simulate.click(button)

        expect(SessionActions.signin).toBeCalled()
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

        SessionStore.isSignedIn.mockImpl(() => {
          return true
        })
      })

      it('calls FollowActions.unfollow() if toggled', () => {
        TestUtils.Simulate.click(makeButton(true))

        expect(FollowActions.unfollow).toBeCalledWith('changelog')
      })

      it('calls FollowActions.follow() if untoggled', () => {
        TestUtils.Simulate.click(makeButton(false))

        expect(FollowActions.follow).toBeCalledWith('changelog')
      })
    })
  })
})