/* eslint-disable unicorn/prefer-spread */
import type { Middleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { name as terminalSliceName } from '~/features/terminal/terminal-reducer';

import customStorage from './custom-storage';
import { rootReducer } from './root-reducer';
import { rootSaga } from './root-saga';

const persistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: [terminalSliceName],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const logger: Middleware = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false })
      .concat(logger)
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
