import RadioGroup from 'react-radio-group'
import React from 'react/addons'
import { Map } from 'immutable'
import { NewChangelog } from '../NewChangelog.jsx'

const TestUtils = React.addons.TestUtils

describe('NewChangelog', () => {
  it('calls formChange on field changed', () => {
    const formChange = jasmine.createSpy('formChange')
    const c = TestUtils.renderIntoDocument(
      <NewChangelog fields={Map()} formChange={formChange}/>
    )

    TestUtils.Simulate.change(c.refs.name, {target: {value: 'HEY!'}})

    expect(formChange).toHaveBeenCalledWith('name', 'HEY!')
  })
})
