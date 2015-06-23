import React from 'react'
import connectToStores from '../lib/connectToStores.jsx'
import SnackbarStore from '../stores/SnackbarStore'
import {clear} from '../actions/SnackbarActions'
import Button from '../ui/Button.jsx'

@connectToStores(SnackbarStore)
export default class Snackbar extends React.Component {
  static getPropsFromStores() {
    return {
      toasts: SnackbarStore.toasts
    }
  }

  render() {
    const { toasts } = this.props
    return (
      <div className="fixed bottom-0 left-0 px1">
        {this.props.toasts.reverse().map((toast, i) =>
          <div className="mb1" key={i}>
            <Toast toast={toast} />
          </div>
        )}
      </div>
    )
  }
}

const ToastTimeout = 1200

class Toast extends React.Component {

  componentDidMount() {
    this.timeout = setTimeout(() => {
      clear(this.props.toast.id)
    }, ToastTimeout)
  }

  componentDidUpdate() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      clear(this.props.toast.id)
    }, ToastTimeout)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const {toast: {msg}} = this.props
    return (
      <div className="inline-block rounded px1 bg-black white">
        <div className="flex flex-center">
          <div className="p1">{msg}</div>
        </div>
      </div>
    )
  }
}
