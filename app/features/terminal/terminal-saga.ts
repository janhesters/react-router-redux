/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createId } from '@paralleldrive/cuid2';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { retrieveLayout, updateLayout } from './terminal-api';
import type { Position } from './terminal-reducer';
import {
  addWidget,
  layoutSyncedAfterOnlineChange,
  name,
  onlineStatusChanged,
  removeWidget,
  selectLayout,
} from './terminal-reducer';

const getNow = () => new Date().toISOString();

/*
Add Widget
*/

export const addWidgetClicked = createAction<{ position: Position }>(
  `${name}/addWidgetClicked`,
);

/**
 * Saga to handle the addWidgetClicked action.
 *
 * This saga optimistically updates the layout by immediately dispatching the
 * addWidget action with a newly generated widget ID and the specified position.
 * It then selects the updated layout from the state and calls the updateLayout
 * API with the new layout and the current timestamp to sync with the server.
 *
 * @param action - The action object containing the position where the widget
 * should be added.
 */
function* handleAddWidgetClicked(action: ReturnType<typeof addWidgetClicked>) {
  const { position } = action.payload;
  const id: ReturnType<typeof createId> = yield call(createId);
  const lastSync: ReturnType<typeof getNow> = yield call(getNow);
  yield put(addWidget({ position, widget: { id }, lastSync }));
  const layout: ReturnType<typeof selectLayout> = yield select(selectLayout);
  yield call(updateLayout, { layout, lastSync });
}

function* watchAddWidgetClicked() {
  yield takeEvery(addWidgetClicked, handleAddWidgetClicked);
}

/*
Remove Widget
*/

export const removeWidgetClicked = createAction<{ id: string }>(
  `${name}/removeWidgetClicked`,
);

/**
 * Saga to handle the removeWidgetClicked action.
 *
 * This saga optimistically updates the layout by immediately dispatching the
 * removeWidget action with the specified widget ID.
 * It then selects the updated layout from the state and calls the updateLayout
 * API with the new layout and the current timestamp to sync with the server.
 *
 * @param action - The action object containing the ID of the widget to remove.
 */
function* handleRemoveWidgetClicked(
  action: ReturnType<typeof removeWidgetClicked>,
) {
  const { id } = action.payload;
  const lastSync: ReturnType<typeof getNow> = yield call(getNow);
  yield put(removeWidget({ id, lastSync }));
  const layout: ReturnType<typeof selectLayout> = yield select(selectLayout);
  yield call(updateLayout, { layout, lastSync });
}

function* watchRemoveWidgetClicked() {
  yield takeEvery(removeWidgetClicked, handleRemoveWidgetClicked);
}

/*
Sync layout
*/

function* handleFetchLayoutSync() {
  const { layout, lastSync }: Awaited<ReturnType<typeof retrieveLayout>> =
    yield call(retrieveLayout);
  yield put(layoutSyncedAfterOnlineChange({ layout, lastSync }));
}

/*
Online Status
*/

function* watchNetworkStatus() {
  const channel: ReturnType<typeof createNetworkChannel> =
    yield call(createNetworkChannel);

  yield takeEvery(channel, function* (isOnline) {
    yield put(onlineStatusChanged({ isOnline }));

    if (isOnline) {
      // Refresh from server when coming online.
      yield call(handleFetchLayoutSync);
    }
  });
}

function createNetworkChannel() {
  return eventChannel<boolean>(emitter => {
    // Only add event listeners if we're in a browser environment.
    if (globalThis.window !== undefined) {
      const onlineHandler = () => emitter(true);
      const offlineHandler = () => emitter(false);

      globalThis.addEventListener('online', onlineHandler);
      globalThis.addEventListener('offline', offlineHandler);

      return () => {
        globalThis.removeEventListener('online', onlineHandler);
        globalThis.removeEventListener('offline', offlineHandler);
      };
    }

    // If not in browser, just return a no-op cleanup function.
    return () => {
      // No-op cleanup function for non-browser environments.
    };
  });
}

/*
Root terminal saga
*/

export function* terminalSaga() {
  yield all([
    watchAddWidgetClicked(),
    watchRemoveWidgetClicked(),
    watchNetworkStatus(),
  ]);
}
