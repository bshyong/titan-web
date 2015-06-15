import React from 'react'
import classnames from 'classnames'

export default class Switch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      switched: this.props.switched
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      switched: nextProps.switched
    })
  }

  render() {
    const { switched } = this.state
    let styles = {
      container: {
        padding: '.25rem'
      },
      bar: {
        width: '3rem',
        height: '1rem',
      },
      button: {
        width: '1.5rem',
        height: '1.5rem',
        top: 0,
      },
    }

    if (switched) {
      // 50% opacity of the green variable
      styles.bar.backgroundColor = '#C9DE8C'

      styles.button.right = 0
      styles.button.backgroundColor = '#93BD16'
    } else {
      styles.button.left = 0
    }

    return (
      <div className="relative pointer"
           style={styles.container}
           onClick={this.handleSwitch.bind(this)}
           onTouchStart={this.handleSwitch.bind(this)}>
        <div className="pill bg-silver" style={styles.bar} />
        <div className="circle bg-white shadow absolute" style={styles.button} />
      </div>
    )
  }

  handleSwitch(e) {
    const switched = !this.state.switched
    this.setState({switched: switched})
    this.props.onSwitched(switched)
  }
}

Switch.propTypes = {
  switched: React.PropTypes.bool.isRequired,
  onSwitched: React.PropTypes.func.isRequired,
}

Switch.defaultProps = {
  switched: false,
}
