import { Link, useLoaderData } from 'react-router';

import { selectAppFinishedLoading } from '~/features/app-loading/app-loading-reducer';
import { useAppSelector } from '~/redux/hooks';
import { stateContext, storeMiddleware } from '~/redux/store-middleware';

import type { Route } from './+types/_dashboard._index';

export const unstable_clientMiddleware = [storeMiddleware];

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  const state = context.get(stateContext);
  console.log('clientLoader', state);
  return { state };
}

export default function DashboardRoute() {
  const { state } = useLoaderData<typeof clientLoader>();

  const finishedLoading = useAppSelector(selectAppFinishedLoading);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{finishedLoading ? 'finished' : 'not finished'}</p>
      <Link to="/example">Example</Link>
      <p>Client loader state: {selectAppFinishedLoading(state).toString()}</p>
    </div>
  );
}
