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
        <StoryForm story={{}} changelog={{is_members_only: false}} />
      )

      expect(form instanceof StoryForm).toBe(true)
    })
  })

  describe('props', () => {
    let form, onChange

    beforeEach(() => {
      onChange = jasmine.createSpy('onChange')
      const changelog = {
        is_members_only: false,
        user_is_team_member: true,
      }
      form = TestUtils.renderIntoDocument(
        <StoryForm story={{}} changelog={changelog} onChange={onChange} />
      )
    })

    describe('.title', () => {
      it('triggers an update on change', () => {
        const el = TestUtils.findRenderedDOMComponentWithTag(
          form.refs.title, 'textarea'
        )

        TestUtils.Simulate.change(el, { target: { value: 'a' } })

        expect(onChange).toHaveBeenCalledWith({title: 'a'})
      })
    })

    describe('.body', () => {
      it('triggers an update on change', () => {

        let body = TestUtils.findRenderedDOMComponentWithTag(
          form.refs.body.refs.textarea,
          'textarea'
        )

        let updatedBody = body.getDOMNode()
        updatedBody.value = 'a'
        TestUtils.Simulate.change(body, { target: updatedBody })

        expect(onChange).toHaveBeenCalledWith({body: 'a'})
      })
    })

    describe('.team_member_only', () => {
      it('toggles on click', () => {
        TestUtils.Simulate.click(form.refs.isPublic)
        expect(onChange).toHaveBeenCalledWith({team_member_only: true})
      })
    })
  })
})
