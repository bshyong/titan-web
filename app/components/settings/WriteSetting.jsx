import React, {PropTypes} from 'react'
import RadioGroup from 'react-radio-group'

export default class WriteSetting extends React.Component {
  render() {
    const { changelog } = this.props
    if (changelog.is_members_only) {
      return <div />
    }

    return (
      <div className="flex flex-center py2">
        <div className="flex-auto">
          <label className="bold mt0 mb0">Choose who can write to your Changelog</label>
          <h4 className="mt0 mb2 gray">You can change this setting anytime.</h4>
          <RadioGroup name="writeability"
            selectedValue={changelog.anyone_can_write ? 'anyone' : 'members_only'}
            onChange={this.props.onChange}>
            {Radio => (
              <div>
                <div className="mb2">
                  <label className="flex">
                    <div className="flex-none mr1"><Radio value="members_only" ref="members_only" /></div>
                    <div>
                      <h4 className="m0">Members can write</h4>
                      <h5 className="m0 gray">Only members of this Changelog will be able to write new posts.</h5>
                    </div>
                  </label>
                </div>
                <div>
                  <label className="flex">
                    <div className="flex-none mr1"><Radio value="anyone" ref="anyone" /></div>
                    <div>
                      <h4 className="m0">Anyone can write</h4>
                      <h5 className="m0 gray">Any Assembly member can write new posts.</h5>
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
