import React, { PropTypes } from 'react';
import { compose, setPropTypes, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
  selectReddit,
  fetchPostsIfNeeded,
  invalidateReddit
} from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

const AppPropTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

const enhance = compose(
  setPropTypes(AppPropTypes),
  lifecycle({
    componentDidMount() {
      const { dispatch, selectedReddit } = this.props;
      dispatch(fetchPostsIfNeeded(selectedReddit));
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.selectedReddit !== this.props.selectedReddit) {
        const { dispatch, selectedReddit } = nextProps;
        dispatch(fetchPostsIfNeeded(selectedReddit));
      }
    }
  })
);

const mapStateToProps = ({ selectedReddit, postsByReddit }) => {
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  };

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated
  };
}

const App = enhance(({
  selectedReddit,
  posts,
  isFetching,
  lastUpdated,
  dispatch
}) => {
  const handleChange = (nextReddit) =>
    dispatch(selectReddit({ reddit: nextReddit }));

  const handleRefreshClick = (e) => {
    e.preventDefault();
    dispatch(invalidateReddit({ reddit: selectedReddit }));
    dispatch(fetchPostsIfNeeded(selectedReddit));
  };

  const isEmpty = posts.length === 0;

  return (
    <div>
      <Picker value={selectedReddit}
        onChange={handleChange}
        options={['reactjs', 'frontend']} />
      <p>
        {lastUpdated &&
          <span>
            Last updated at { new Date(lastUpdated).toLocaleTimeString() }.
            {' '}
          </span>
        }
        {!isFetching &&
          <a href="#"
            onClick={handleRefreshClick}>
            Refresh
          </a>
        }
      </p>
      {isEmpty
        ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
        : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={posts} />
        </div>
      }
    </div>
  );
});

export default connect(mapStateToProps)(App);
