import { Outlet } from 'react-router';

import { finishedAppLoading } from '~/features/app-loading/app-loading-reducer';
import { dispatchContext, storeMiddleware } from '~/redux/store-middleware';

import type { Route } from './+types/_dashboard';

export const unstable_clientMiddleware = [storeMiddleware];

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  const dispatch = context.get(dispatchContext);
  const promise = new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
    dispatch(finishedAppLoading());
  });
  return { promise };
}

export default function DashboardLayoutRoute() {
  return <Outlet />;
}
