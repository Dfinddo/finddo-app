import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';

import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from './modules/rootSaga';
import { UserState } from './modules/user/types';
import { AdressesState } from './modules/adresses/types';

export interface State {
  user: UserState,
  adresses: AdressesState,
}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middlewares)
));

sagaMiddleware.run(rootSaga);

export default store;