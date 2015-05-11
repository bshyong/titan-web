export default class Reporters extends React.Component {
  constructor() {
    this.state = {}
  }

  render() {
    if (this.state.user) {
      return <div className="container sm-col-8">
        Welcome {this.state.user.username}
      </div>
    }

    return <div className="container sm-col-8">
      Signing in...
    </div>
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this)
    SessionStore.addChangeListener(this.changeListener)
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this.changeListener)
  }

  _onChange() {
    this.setState({
      user: SessionStore.user
    })
  }
}
