import { createAction } from 'redux-actions';

export const selectReddit = createAction('SELECT_REDDIT');
export const invalidateReddit = createAction('INVALIDATE_REDDIT');
const requestPosts = createAction('REQUEST_POSTS');
const receivePosts = createAction('RECEIVE_POSTS');

const fetchPostsApi = (reddit) =>
  fetch(`http://www.reddit.com/r/${reddit}.json`)
    .then((response) => response.json())
    .then((json) => json.data.children.map((child) => child.data));

const fetchPosts = (reddit) =>
  (dispatch) => {
    dispatch(requestPosts({reddit}));
    return fetchPostsApi(reddit)
      .then((posts) => dispatch(receivePosts({
        reddit,
        posts,
        receivedAt: Date.now()
      })));
  };

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
};

export const fetchPostsIfNeeded = (reddit) =>
  (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit));
    }
  };
