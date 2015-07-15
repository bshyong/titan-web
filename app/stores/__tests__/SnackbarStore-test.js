import {
  MEMBERSHIP_UPDATED,
  MEMBERSHIP_UPDATE_FAILED,
  PENDING_MEMBERSHIP_UPDATED,
  SNACKBAR_ADD_TOAST,
  SNACKBAR_CLEAR,
} from 'constants'

describe('SnackbarStore', () => {
  let Dispatcher, SnackbarStore

  beforeEach(() => {
    Dispatcher = require('../../lib/dispatcher')
    SnackbarStore = require('../SnackbarStore')
  })

  it('responds to MEMBERSHIP_UPDATED', () => {
    spyOn(SnackbarStore, 'emitChange').and.returnValue(true)

    Dispatcher.dispatch({
      type: MEMBERSHIP_UPDATED,
      userId: 'user'
    })

    expect(SnackbarStore.emitChange).toHaveBeenCalled()
  })

  it('responds to MEMBERSHIP_UPDATE_FAILED', () => {
    spyOn(SnackbarStore, 'emitChange').and.returnValue(true)

    Dispatcher.dispatch({
      type: MEMBERSHIP_UPDATE_FAILED,
      userId: 'user'
    })

    expect(SnackbarStore.emitChange).toHaveBeenCalled()
  })

  it('responds to PENDING_MEMBERSHIP_UPDATED', () => {
    spyOn(SnackbarStore, 'emitChange').and.returnValue(true)

    Dispatcher.dispatch({
      type: PENDING_MEMBERSHIP_UPDATED,
      userId: 'user'
    })

    expect(SnackbarStore.emitChange).toHaveBeenCalled()
  })
})
