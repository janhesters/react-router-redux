import { all } from 'redux-saga/effects';

import { terminalSaga } from '~/features/terminal/terminal-saga';

export function* rootSaga() {
  yield all([terminalSaga()]);
}
