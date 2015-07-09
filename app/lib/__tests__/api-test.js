import api from 'lib/api'
import membershipInvite from 'lib/membershipInvite'

describe('api', () => {
  it('sends membership_invite header', () => {
    spyOn(window, 'fetch').and.returnValue(new Promise((resolve, reject) => {}))
    spyOn(membershipInvite, 'get').and.returnValue('invite-1')

    api.req('some-url', {})

    const args = window.fetch.calls.argsFor(0)
    expect(args[0]).toEqual('undefined/some-url')

    const headers = args[1].headers
    expect(headers['membership-invite']).toEqual('invite-1')
  })
})
