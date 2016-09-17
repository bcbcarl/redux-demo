import { take, put, call, fork, select } from 'redux-saga/effects';

import {
  requestPosts,
  receivePosts
} from '../actions';
import {
  selectedRedditSelector,
  postsByRedditSelector
} from '../reducers/selectors';

export const fetchPostsApi = (reddit) =>
  fetch(`http://www.reddit.com/r/${reddit}.json`)
    .then((response) => response.json())
    .then((json) => json.data.children.map((child) => child.data));

export function* fetchPosts(reddit) {
  yield put(requestPosts({reddit}));
  const posts = yield call(fetchPostsApi, reddit);
  yield put(receivePosts({
    reddit,
    posts,
    receivedAt: Date.now()
  }));
}

export function* invalidateReddit() {
  while (true) {
    const {
      payload: {reddit}
    } = yield take('INVALIDATE_REDDIT');
    yield call(fetchPosts, reddit);
  }
}

export function* nextRedditChange() {
  while (true) {
    const prevReddit = yield select(selectedRedditSelector);
    yield take('SELECT_REDDIT');

    const newReddit = yield select(selectedRedditSelector);
    const postsByReddit = yield select(postsByRedditSelector);
    if (prevReddit !== newReddit && !postsByReddit[newReddit])
      yield fork(fetchPosts, newReddit);
  }
}

export function* startup() {
  const selectedReddit = yield select(selectedRedditSelector);
  yield fork(fetchPosts, selectedReddit);
}

export default function* root() {
  yield fork(startup);
  yield fork(nextRedditChange);
  yield fork(invalidateReddit);
}
