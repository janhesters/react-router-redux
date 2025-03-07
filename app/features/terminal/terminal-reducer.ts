import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { prop } from 'ramda';

type Widget = {
  id: string;
};

export type Position = 'top' | 'bottom' | 'left' | 'right';

export type Layout = Record<
  string,
  {
    position: Position;
    widget: Widget;
  }
>;

export const {
  actions: {
    addWidget,
    layoutFirstServerSynced,
    onlineStatusChanged,
    layoutSyncedAfterOnlineChange,
    removeWidget,
  },
  name,
  reducer,
  selectors: { selectLayout, selectLastSync, selectIsOnline },
} = createSlice({
  initialState: {
    isOnline: navigator.onLine,
    lastSync: '',
    layout: {} as Layout,
  },
  name: 'terminal',
  reducers: {
    addWidget: (
      state,
      action: PayloadAction<{
        widget: Widget;
        position: Position;
        lastSync: string;
      }>,
    ) => {
      state.layout[action.payload.widget.id] = {
        position: action.payload.position,
        widget: action.payload.widget,
      };
      state.lastSync = action.payload.lastSync;
    },
    removeWidget: (
      state,
      action: PayloadAction<{ id: string; lastSync: string }>,
    ) => {
      delete state.layout[action.payload.id];
      state.lastSync = action.payload.lastSync;
    },
    layoutFirstServerSynced: (
      state,
      action: PayloadAction<{ layout: Layout; lastSync: string }>,
    ) => {
      // Only update if lastSync is not set or the payload's lastSync is newer.
      if (
        !state.lastSync ||
        new Date(action.payload.lastSync) > new Date(state.lastSync)
      ) {
        state.layout = action.payload.layout;
        state.lastSync = action.payload.lastSync;
      }
    },
    onlineStatusChanged: (
      state,
      action: PayloadAction<{ isOnline: boolean }>,
    ) => {
      state.isOnline = action.payload.isOnline;
    },
    layoutSyncedAfterOnlineChange: (
      state,
      action: PayloadAction<{ layout: Layout; lastSync: string }>,
    ) => {
      // Only update if lastSync is not set or the payload's lastSync is newer.
      if (
        !state.lastSync ||
        new Date(action.payload.lastSync) > new Date(state.lastSync)
      ) {
        state.layout = action.payload.layout;
        state.lastSync = action.payload.lastSync;
      }
    },
  },
  selectors: {
    selectLayout: prop<'layout'>('layout'),
    selectLastSync: prop<'lastSync'>('lastSync'),
    selectIsOnline: prop<'isOnline'>('isOnline'),
  },
});

// Helper function to find a widget by position.
const findWidgetByPosition = (layout: Layout, position: Position) => {
  // Find the first widget ID that matches the position.
  const widgetId = Object.keys(layout).find(
    id => layout[id].position === position,
  );

  // Return the widget with its ID if found, otherwise undefined.
  return widgetId ? { id: widgetId, ...layout[widgetId] } : undefined;
};

// Memoized selector factory function for widgets by position.
export const selectWidgetByPosition = (position: Position) =>
  createSelector(selectLayout, layout =>
    findWidgetByPosition(layout, position),
  );
