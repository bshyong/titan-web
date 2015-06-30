import React from 'react/addons'
import { ImportFromCovePanel } from '../ImportFromCovePanel.jsx'

const TestUtils = React.addons.TestUtils

describe('ImportFromCovePanel', () => {
  it('calls import on button click', () => {
    const changelog = {id: 'changelog-1'}
    const importProject = jasmine.createSpy('importProject')

    const c = TestUtils.renderIntoDocument(
      <ImportFromCovePanel changelog={changelog}
                           importProject={importProject}/>
    )
    React.findDOMNode(c.refs.url).value = 'https://assembly.com/awws0m'
    TestUtils.Simulate.submit(c.refs.form)

    expect(importProject).toHaveBeenCalledWith('changelog-1', 'https://assembly.com/awws0m')
  })
})
