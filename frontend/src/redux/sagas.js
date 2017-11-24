import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './actionTypes';
import spotify from '../client/spotify';
import youTube from '../client/youTube';


export function* fetchSpotifyAccessToken(action) {
  try {
    const token = yield call(spotify.fetchSpotifyAccessToken, action.payload);
    yield put({ type: types.FETCH_SPOTIFY_TOKEN_SUCCEEDED, payload: token });
  } catch (e) {
    yield put({ type: types.FETCH_SPOTIFY_TOKEN_FAILED, message: e.message });
  }
}

export function* determineSimilarArtists(action) {
  try {
    const initialArtistInfo = yield call(spotify.fetchInitialArtist, ...action.payload);
    yield put({ type: types.FETCH_INITIAL_ARTIST_SUCCEEDED, payload: initialArtistInfo });

    action.payload[0] = initialArtistInfo;
    const similarArtists = yield call(spotify.determineSimilarArtists, ...action.payload);
    yield put({ type: types.DETERMINE_SIMILAR_ARTISTS_SUCCEEDED, payload: similarArtists });

  } catch (e) { // figure out this part
    yield put({ type: types.DETERMINE_SIMILAR_ARTISTS_FAILED, message: e.message });
  }
}

export function* fetchVideos(action) {
  try {
    const videos = yield call(youTube.fetchVideos, ...action.payload);
    yield put({ type: types.FETCH_VIDEOS_SUCCEEDED, payload: videos });
  } catch (e) {
    yield put({ type: types.FETCH_VIDEOS_FAILED, message: e.message });
  }
}


function* sagas() {
  yield all([
    takeLatest(types.FETCH_SPOTIFY_TOKEN_REQUESTED, fetchSpotifyAccessToken),
    takeLatest(types.DETERMINE_SIMILAR_ARTISTS_REQUESTED, determineSimilarArtists),
    takeLatest(types.FETCH_VIDEOS_REQUESTED, fetchVideos)
  ]);
}


export default sagas;
