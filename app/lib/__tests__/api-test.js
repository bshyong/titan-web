import api from 'lib/api'
import membershipInvite from 'lib/membershipInvite'

describe('api', () => {
  it('sends membership_invite header', () => {
    spyOn(window, 'fetch').and.returnValue(new Promise((resolve, reject) => {}))
    spyOn(membershipInvite, 'get').and.returnValue('invite-1')

    api.req('some-url', {})

    expect(window.fetch.calls.argsFor(0)).toEqual(
      ['undefined/some-url', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'membership-invite': 'invite-1'
        }
      }]
    )
  })
})
