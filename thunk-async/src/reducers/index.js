import { merge, repeat, zipObj } from 'ramda';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

const selectedReddit = handleActions({
  SELECT_REDDIT: (state, action) =>
    action.payload.reddit
}, 'reactjs');

const posts = handleActions({
  INVALIDATE_REDDIT: (state, action) =>
    merge(state, {
      didInvalidate: true
    }),
  REQUEST_POSTS: (state, action) =>
    merge(state, {
      isFetching: true,
      didInvalidate: false
    }),
  RECEIVE_POSTS: (state, action) =>
    merge(state, {
      isFetching: false,
      didInvalidate: false,
      items: action.payload.posts,
      lastUpdated: action.payload.receivedAt
    })
}, {
    isFetching: false,
    didInvalidate: false,
    items: []
  });

const postsByReddit = handleActions(zipObj(
  ['INVALIDATE_REDDIT', 'RECEIVE_POSTS', 'REQUEST_POSTS'],
  repeat((state, action) => {
    const { payload: {reddit} } = action;
    return merge(state, {
      [reddit]: posts(state[reddit], action)
    });
  }, 3)
), {});

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
