import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';

import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from './modules/rootSaga';
import { UserState } from './modules/user/types';


export interface State {
  userStore: UserState,
}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middlewares)
));

sagaMiddleware.run(rootSaga);

export default store;