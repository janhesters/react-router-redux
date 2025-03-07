/* eslint-disable unicorn/prefer-spread */
import type { Middleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './root-reducer';

const logger: Middleware = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
