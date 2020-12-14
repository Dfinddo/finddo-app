/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { all } from 'redux-saga/effects';

import user from './user/sagas';

export default function* rootSaga() {
  return yield all([
    user,
  ]);
}; 