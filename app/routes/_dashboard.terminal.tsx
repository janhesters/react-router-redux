import { retrieveLayout } from '~/features/terminal/terminal-api';
import type { Position } from '~/features/terminal/terminal-reducer';
import {
  layoutFirstServerSynced,
  selectIsOnline,
  selectLastSync,
  selectWidgetByPosition,
} from '~/features/terminal/terminal-reducer';
import {
  addWidgetClicked,
  removeWidgetClicked,
} from '~/features/terminal/terminal-saga';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { dispatchContext, storeMiddleware } from '~/redux/store-middleware';

import type { Route } from './+types/_dashboard';

export const unstable_clientMiddleware = [storeMiddleware];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const dispatch = context.get(dispatchContext);

  // Await the response before dispatching the action.
  const response = await retrieveLayout();
  dispatch(layoutFirstServerSynced(response));

  return;
}

/**
 * Header component that displays the online status and sync information
 */
function OnlineStatusHeader() {
  const isOnline = useAppSelector(selectIsOnline);
  const lastSync = useAppSelector(selectLastSync);

  const formattedLastSync = lastSync || 'Never';

  return (
    <div
      className={`rounded-md p-4 text-white ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`mr-2 h-3 w-3 rounded-full ${
              isOnline ? 'bg-green-300' : 'bg-red-300'
            }`}
          />
          <h2 className="text-lg font-semibold">
            {isOnline ? 'Online' : 'Offline'}
          </h2>
        </div>
        <div className="text-sm">Last synced: {formattedLastSync}</div>
      </div>
      <p className="mt-2 text-sm">
        {isOnline
          ? 'Changes are being saved and synced with the server in real-time.'
          : 'Changes are being saved locally and will sync when you reconnect.'}
      </p>
    </div>
  );
}

// Component for the plus button that adds a widget.
type AddWidgetButtonProps = {
  position: Position;
};

function AddWidgetButton({ position }: AddWidgetButtonProps) {
  const dispatch = useAppDispatch();

  const handleAddWidget = () => {
    dispatch(addWidgetClicked({ position }));
  };

  return (
    <button
      onClick={handleAddWidget}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white hover:bg-blue-600"
    >
      +
    </button>
  );
}

// Component for displaying a widget with a delete button.
type WidgetDisplayProps = {
  widgetId: string;
};

function WidgetDisplay({ widgetId }: WidgetDisplayProps) {
  const dispatch = useAppDispatch();

  const handleRemoveWidget = () => {
    dispatch(removeWidgetClicked({ id: widgetId }));
  };

  return (
    <>
      <div className="font-mono text-lg">{widgetId}</div>
      <button
        onClick={handleRemoveWidget}
        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
      >
        ×
      </button>
    </>
  );
}

// Component for a position cell that can contain a widget or an add button.
type PositionCellProps = {
  position: Position;
};

function PositionCell({ position }: PositionCellProps) {
  // Use the selectWidgetByPosition selector to get the widget for this position
  const widget = useAppSelector(selectWidgetByPosition(position));

  return (
    <div className="relative flex items-center justify-center rounded-lg border">
      {widget ? (
        <WidgetDisplay widgetId={widget.widget.id} />
      ) : (
        <AddWidgetButton position={position} />
      )}
    </div>
  );
}

export default function TerminalRoute() {
  return (
    <div className="flex h-screen w-full flex-col px-4 py-2">
      <OnlineStatusHeader />

      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4 py-2">
        <PositionCell position="top" />
        <PositionCell position="right" />
        <PositionCell position="bottom" />
        <PositionCell position="left" />
      </div>
    </div>
  );
}
