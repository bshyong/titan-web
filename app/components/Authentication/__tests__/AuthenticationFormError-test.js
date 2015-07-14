import { createRedux } from 'redux'
import { Provider } from 'redux/react'
import React from 'react/addons'
import { Map } from 'immutable'
import AuthenticationFormError from '../AuthenticationFormError.jsx'
import LoginForm from '../LoginForm.jsx'

const TestUtils = React.addons.TestUtils

describe('AuthenticationFormError', () => {
  it('renders if there is an error', () => {
    const redux = createRedux({ authenticationForm: () => Map({ error: "oh sh*t" }) });
    const c = TestUtils.renderIntoDocument(
      <Provider redux={redux}>
        {() => <AuthenticationFormError
          dispatch={() => {}}
          ref="error" />}
      </Provider>
    )
    const h5 = TestUtils.findRenderedDOMComponentWithClass(c, 'h5').getDOMNode()

    expect(h5.innerText).toEqual("oh sh*t")
  })
})
