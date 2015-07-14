import { createRedux } from 'redux'
import { Provider } from 'redux/react'

describe('FollowButton', () => {
  let React, FollowButton, TestUtils

  beforeEach(() => {
    React = require('react/addons')
    FollowButton = require('../follow_button.jsx')
    TestUtils = React.addons.TestUtils
  })

  describe('handleClick()', () => {
    let AuthenticationFormActions

    beforeEach(() => {
      AuthenticationFormActions = require('../../actions/AuthenticationFormActions')
    })

    describe('not signed in', () => {
      it('calls AuthenticationFormActions.changeForm()', () => {
        spyOn(AuthenticationFormActions, 'changeForm')

        const redux = createRedux({ test: () => ({}) });
        let followButton = TestUtils.renderIntoDocument(
          <Provider redux={redux}>
            {() => <FollowButton changelogId="changelog" toggled={true} ref="button" />}
          </Provider>
        )

        let button = TestUtils.findRenderedDOMComponentWithTag(
          followButton.refs.button,
          'button'
        )

        TestUtils.Simulate.click(button)

        expect(AuthenticationFormActions.changeForm).toHaveBeenCalled()
      })
    })

    describe('signed in', () => {
      const makeButton = (toggled) => {
        const redux = createRedux({ test: () => ({}) });
        let followButton = TestUtils.renderIntoDocument(
          <Provider redux={redux}>
            {() => <FollowButton changelogId="changelog" toggled={toggled} ref="button" />}
          </Provider>
        )

        return TestUtils.findRenderedDOMComponentWithTag(
          followButton.refs.button,
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
