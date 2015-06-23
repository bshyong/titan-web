import classnames from 'classnames'
import RadioGroup from 'react-radio-group'
import React from 'react'

export default class VisibilityToggler extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { is_members_only } = this.props.changelog

    return (
      <div className="flex flex-center py2">
        <div className="flex-auto">
          <h4 className="mt0 mb0">Choose who can see your Changelog</h4>
          <h4 className="mt0 mb1 gray">You can change this setting later.</h4>
          <RadioGroup name="privacy"
            selectedValue={is_members_only ? 'private' : 'public'}
            onChange={this.props.onChange}>
            {Radio => (
              <div>
                <div className="mb1">
                  <label className="flex">
                    <div className="flex-none mr1"><Radio value="public" ref="public" /></div>
                    <div>
                      <h4 className="m0">Public</h4>
                      <p className="mb0 gray">Anyone wil be able to see it, follow it, and comment on it.</p>
                    </div>
                  </label>
                </div>
                <div>
                  <label className="flex">
                    <div className="flex-none mr1"><Radio value="private" ref="private" /></div>
                    <div>
                      <h4 className="m0">Private</h4>
                      <p className="mb0 gray">Only those you invite will be able to see and comment on it.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>
      </div>
    )
  }
}

VisibilityToggler.propTypes = {
  changelog: React.PropTypes.object,
  onChange: React.PropTypes.func
}
