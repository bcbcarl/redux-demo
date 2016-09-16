import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const middlewares = [thunk];

const prodStore = (middlewares) => {
  return createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  );
};

const devStore = (middlewares) => {
  return createStore(
    rootReducer,
    compose(
      applyMiddleware(...middlewares, createLogger()),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
};

const configureStore = () => {
  if (process.env.NODE_ENV !== 'production') {
    return devStore(middlewares);
  }
  return prodStore(middlewares);
}

export default configureStore;
