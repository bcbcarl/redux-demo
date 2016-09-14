import { merge } from 'ramda';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import sagaMonitor from '../saga-monitor';

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
let sagaEnhancer = applyMiddleware(sagaMiddleware);

if (process.env.NODE_ENV !== 'production') {
  sagaEnhancer = compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const configureStore = () => merge(
  createStore(
    rootReducer,
    sagaEnhancer
  ),
  { runSaga: sagaMiddleware.run });

export default configureStore;
