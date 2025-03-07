import { unstable_createContext } from 'react-router';

import type { Route } from '../routes/+types/_dashboard';
import { type AppDispatch, type RootState, store } from './store';

export const dispatchContext = unstable_createContext<AppDispatch>();
export const stateContext = unstable_createContext<RootState>();

// @ts-expect-error - Type mismatch with unstable API
export const storeMiddleware: Route.unstable_ClientMiddlewareFunction = ({
  context,
}) => {
  context.set(dispatchContext, store.dispatch);
  context.set(stateContext, store.getState());
};
