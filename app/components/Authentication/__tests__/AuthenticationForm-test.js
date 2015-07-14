import { createRedux } from 'redux'
import { Provider } from 'redux/react'
import React from 'react/addons'
import { Map } from 'immutable'
import AuthenticationForm from '../AuthenticationForm.jsx'
import LoginForm from '../LoginForm.jsx'

const TestUtils = React.addons.TestUtils

describe('AuthenticationForm', () => {
  it("renders the form that matches the formComponent string it's passed", () => {
    spyOn(LoginForm.prototype, 'render').and.returnValue(<div />)
    const redux = createRedux({ authenticationForm: () => Map({ formContent: Map() }) });
    const c = TestUtils.renderIntoDocument(
      <Provider redux={redux}>
        {() => <AuthenticationForm
          dispatch={() => {}}
          formComponent="login"
          formContent={{}}
          ref="form" />}
      </Provider>
    )

    expect(LoginForm.prototype.render).toHaveBeenCalled()
  })
})
