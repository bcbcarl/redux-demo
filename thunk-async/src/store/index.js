import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

let middleware = [thunk];
let enhancer = applyMiddleware(...middleware);

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
  enhancer = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const configureStore = () =>
  createStore(
    rootReducer,
    enhancer
  );

export default configureStore;
