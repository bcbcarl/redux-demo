import { merge } from 'ramda';
import { combineReducers } from 'redux';

import {
  SELECT_REDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS
} from '../actions';

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.payload.reddit;
    default:
      return state;
  }
};

const posts = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return merge(state, {
        isFetching: true
      });
    case RECEIVE_POSTS:
      return merge(state, {
        isFetching: false,
        items: action.payload.posts,
        lastUpdated: action.payload.receivedAt
      });
    default:
      return state;
  }
};

const postsByReddit = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return merge(state, {
        [action.payload.reddit]: posts(state[action.payload.reddit], action)
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
