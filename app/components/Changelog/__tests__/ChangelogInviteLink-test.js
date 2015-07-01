import React from 'react/addons'
import ChangelogInviteLink from '../ChangelogInviteLink.jsx'
const TestUtils = React.addons.TestUtils


describe(ChangelogInviteLink, () => {
  it('renders', () => {
    const changelog = {id: 'changelog-1', invite_hash: 'abc-123'}
    expect(() => {
      TestUtils.renderIntoDocument(
        <ChangelogInviteLink changelog={changelog} />
      )
    }).not.toThrow()
  })
})
