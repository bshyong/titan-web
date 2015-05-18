import {Dispatcher} from 'flux'

class AppDispatcher extends Dispatcher {
  dispatch(payload) {
    if (!payload.type) {
      console.error('Cannot dispatch undefined type.');
      // don't break in IE < 11 or Safari < 7.0.1, but try
      // to provide a stack trace if available
      console.trace && console.trace();
      return;
    }

    super.dispatch(payload);
  }
}
export default new AppDispatcher()
