describe('StoryForm', () => {
  let React,
      RouterContainer,
      EmojiActions,
      StoryForm,
      TestUtils

  beforeEach(() => {
    React = require('react/addons')
    RouterContainer = require('../../lib/router_container')
    EmojiActions = require('../../actions/emoji_actions')

    spyOn(RouterContainer, 'get').and.callFake(() => {
      return {
        getCurrentParams() {
          return { changelogId: 1 }
        }
      }
    })
    spyOn(RouterContainer, 'changelogSlug').and.callFake(() => {
      return 1
    })
    spyOn(EmojiActions, 'fetch').and.returnValue([])

    StoryForm = require('../StoryForm.jsx').Component.Component
    TestUtils = React.addons.TestUtils
  })

  describe('render()', () => {
    it('renders without any props', () => {
      const form = TestUtils.renderIntoDocument(<StoryForm />)

      expect(form instanceof StoryForm).toBe(true)
    })
  })

  describe('props', () => {
    let form

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(<StoryForm />)
    })

    describe('.title', () => {
      it('is undefined by default', () => {
        expect(form.props.title).toBeUndefined()
      })

      it('triggers an update on change', () => {
        spyOn(form, 'updateForm')
        TestUtils.Simulate.change(form.refs.title, { target: { value: 'a' } })

        expect(form.updateForm).toHaveBeenCalledWith('title', 'a')
      })
    })

    describe('.body', () => {
      it('is undefined by default', () => {
        expect(form.props.body).toBeUndefined()
      })

      it('triggers an update on change', () => {
        spyOn(form, 'updateForm')

        let body = TestUtils.findRenderedDOMComponentWithTag(
          form.refs.body.refs.textarea,
          'textarea'
        )
        let updatedBody = body.getDOMNode()
        updatedBody.value = 'a'
        TestUtils.Simulate.change(body, { target: updatedBody })

        expect(form.updateForm).toHaveBeenCalledWith('body', 'a')
      })
    })

    describe('.isPublic', () => {
      it('is true by default', () => {
        expect(form.props.isPublic).toBe(true)
      })

      it('toggles on click', () => {
        spyOn(form, 'updateForm')
        TestUtils.Simulate.click(form.refs.isPublic)

        expect(form.updateForm).toHaveBeenCalledWith('isPublic', false)
      })
    })
  })
})
