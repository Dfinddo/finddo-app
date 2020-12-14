import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

import { UserState } from './modules/user/types';
import { AdressesState } from './modules/adresses/types';
import { ChatState } from './modules/chats/types';
import { CardsState } from './modules/cards/types';
import { ProfessionalsState } from './modules/professionals/types';
import { ServiceState } from './modules/services/types';

export interface State {
  user: UserState,
  adresses: AdressesState,
  chats: ChatState,
  cards: CardsState,
  services: ServiceState,
  professionals: ProfessionalsState,
}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middlewares)
));

sagaMiddleware.run(rootSaga);

export default store;