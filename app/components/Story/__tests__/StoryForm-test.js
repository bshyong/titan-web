describe('StoryForm', () => {
  let React,
      RouterContainer,
      EmojiActions,
      StoryForm,
      TestUtils

  beforeEach(() => {
    React = require('react/addons')
    EmojiActions = require('../../../actions/emoji_actions')
    spyOn(EmojiActions, 'fetch').and.returnValue([])

    StoryForm = require('../StoryForm.jsx')
    TestUtils = React.addons.TestUtils
  })

  describe('render()', () => {
    it('renders with an empty story', () => {
      const form = TestUtils.renderIntoDocument(
        <StoryForm story={{}} />
      )

      expect(form instanceof StoryForm).toBe(true)
    })
  })

  describe('props', () => {
    let form

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(
        <StoryForm story={{}} onChange={function() {}} />
      )
    })

    describe('.title', () => {
      it('triggers an update on change', () => {
        spyOn(form.props, 'onChange')
        TestUtils.Simulate.change(form.refs.title, { target: { value: 'a' } })

        expect(form.props.onChange).toHaveBeenCalledWith({title: 'a'})
      })
    })

    describe('.body', () => {
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
      it('toggles on click', () => {
        spyOn(form.props, 'onChange')
        TestUtils.Simulate.click(form.refs.isPublic)

        expect(form.props.onChange).toHaveBeenCalledWith({'isPublic', false})
      })
    })
  })
})
