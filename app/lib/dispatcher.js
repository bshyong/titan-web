import {Dispatcher} from 'flux'

class AppDispatcher extends Dispatcher {
  dispatch(payload) {
    if (!payload.type) {
      console.error('Cannot dispatch undefined type.');
      return;
    }

    super.dispatch(payload);
  }
}
export default new AppDispatcher()
