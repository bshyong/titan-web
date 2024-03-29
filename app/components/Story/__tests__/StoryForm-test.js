// import { createRedux } from 'redux'
// import { Provider } from 'redux/react'
// import { List, Map } from 'immutable'
// import stubRouterContext from '../../../lib/stubRouterContext'
//
// describe('StoryForm', () => {
//   let React,
//       RouterContainer,
//       EmojiActions,
//       StoryForm,
//       TestUtils,
//       api
//
//   beforeEach(() => {
//     api = require('../../../lib/api')
//     spyOn(api, 'get').and.returnValue({ then: () => {} })
//
//     React = require('react/addons')
//     EmojiActions = null
//     spyOn(EmojiActions, 'fetch').and.returnValue([])
//
//     StoryForm = require('../StoryForm.jsx')
//     TestUtils = React.addons.TestUtils
//   })
//
//   describe('render()', () => {
//     it('renders with an empty story', () => {
//       const redux = createRedux({ emojiInput: () => Map({ emojis: List() }) })
//       const Subject = stubRouterContext(StoryForm, {
//         changelog: { is_members_only: false },
//         story: {}
//       })
//
//       expect(
//         TestUtils.renderIntoDocument.bind(
//           TestUtils,
//           <Provider redux={redux}>
//             {() => <Subject ref="subject" />}
//           </Provider>
//         )
//       ).not.toThrow()
//     })
//   })
//
//   describe('props', () => {
//     let form, onChange
//
//     beforeEach(() => {
//       onChange = jasmine.createSpy('onChange')
//       const changelog = {
//         is_members_only: false,
//         user_is_team_member: true,
//       }
//
//       const redux = createRedux({ emojiInput: () => Map({ emojis: List() }) });
//       const Subject = stubRouterContext(StoryForm, {
//         changelog: changelog,
//         story: {},
//         onChange: onChange
//       })
//       form = TestUtils.renderIntoDocument(
//         <Provider redux={redux}>
//           {() => <Subject ref="subject" />}
//         </Provider>
//       ).refs.subject.refs.stub
//     })
//
//     describe('.title', () => {
//       it('triggers an update on change', () => {
//         const el = TestUtils.scryRenderedDOMComponentsWithTag(
//           form,
//           'textarea'
//         )[0]
//
//         TestUtils.Simulate.change(el, { target: { value: 'a' } })
//
//         expect(onChange).toHaveBeenCalledWith({title: 'a'})
//       })
//     })
//
//     describe('.body', () => {
//       it('triggers an update on change', () => {
//         const body = TestUtils.scryRenderedDOMComponentsWithTag(
//           form,
//           'textarea'
//         )[1]
//
//         let updatedBody = body.getDOMNode()
//         updatedBody.value = 'a'
//         TestUtils.Simulate.change(body, { target: updatedBody })
//
//         expect(onChange).toHaveBeenCalledWith({body: 'a'})
//       })
//     })
//
//     describe('.team_member_only', () => {
//       it('toggles on click', () => {
//         const isPublic = TestUtils.scryRenderedDOMComponentsWithClass(
//           form,
//           'gray underline bold pointer'
//         )[0].getDOMNode()
//         TestUtils.Simulate.click(isPublic)
//         expect(onChange).toHaveBeenCalledWith({team_member_only: true})
//       })
//     })
//   })
// })
