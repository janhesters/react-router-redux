# React Router With Redux Offline Sync Prototype

This project demonstrates the integration of React Router with Redux, showcasing how to implement offline synchronization capabilities in a modern React application.

## Key Features

- **React Router Integration with Redux**: Utilizes React Router's unstable middleware API to seamlessly integrate with Redux state management.
- **Offline Synchronization**: Implements a robust offline-first approach with automatic synchronization when connectivity is restored.
- **Optimistic UI Updates**: Provides immediate UI feedback while handling asynchronous operations in the background.
- **Persistent State**: Uses Redux Persist to maintain application state across browser sessions.
- **Real-time Network Status Monitoring**: Automatically detects and responds to changes in network connectivity.

## Technology Stack

- **React 19**: Leverages the latest React features for building the UI.
- **React Router 7**: Uses the latest version with support for middleware and loaders.
- **Redux Toolkit**: Simplifies Redux state management with modern best practices.
- **Redux Saga**: Manages complex asynchronous operations and side effects.
- **Redux Persist**: Provides persistence for the Redux store.
- **TypeScript**: Ensures type safety throughout the application.
- **Tailwind CSS**: Provides utility-first CSS for styling components.

## Project Structure

```
app/
├── features/            # Feature-based modules
│   ├── app-loading/     # Application loading state management
│   └── terminal/        # Terminal feature with offline sync capabilities
├── redux/               # Redux configuration
│   ├── custom-storage.ts # Custom storage implementation for Redux Persist
│   ├── hooks.ts         # Custom Redux hooks
│   ├── root-reducer.ts  # Root reducer combining all feature reducers
│   ├── root-saga.ts     # Root saga combining all feature sagas
│   ├── store.ts         # Redux store configuration
│   └── store-middleware.ts # React Router middleware for Redux integration
└── routes/              # Application routes
    ├── _dashboard.tsx   # Dashboard layout route
    ├── _dashboard._index.tsx # Dashboard index route
    ├── _dashboard.example.tsx # Example route
    └── _dashboard.terminal.tsx # Terminal feature route
```

## Key Concepts

### React Router with Redux Integration

This project demonstrates how to use React Router's unstable middleware API to integrate with Redux. The middleware allows access to the Redux store and dispatch functions within React Router's loaders and actions.

```typescript
// app/redux/store-middleware.ts
export const dispatchContext = unstable_createContext<AppDispatch>();
export const stateContext = unstable_createContext<RootState>();

export const storeMiddleware: Route.unstable_ClientMiddlewareFunction = ({
  context,
}) => {
  context.set(dispatchContext, store.dispatch);
  context.set(stateContext, store.getState());
};
```

### Offline Synchronization

The application implements an offline-first approach using Redux Saga and Redux Persist:

1. **Optimistic Updates**: UI changes are applied immediately while synchronization happens in the background.
2. **Network Status Monitoring**: The application listens for online/offline events and adjusts behavior accordingly.
3. **Data Synchronization**: When the application comes back online, it synchronizes local changes with the server.

#### How Synchronization Works

- **Persistent Local Storage**: The terminal state is always stored in local storage using Redux Persist, ensuring data is available even when offline.
- **Timestamp-Based Conflict Resolution**: Each state update includes a timestamp. When syncing with the server, the application compares timestamps to determine which data is more recent:
  ```typescript
  // From terminal-reducer.ts
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
  ```
- **Sync Triggers**: Synchronization with the server is triggered by several events:
  1. **Network Status Changes**: When the application detects that it's back online after being offline
  2. **User Actions**: Whenever a user adds or removes a widget
  3. **Initial Load**: When the application first loads

```typescript
// From terminal-saga.ts
function* watchNetworkStatus() {
  const channel = yield call(createNetworkChannel);

  yield takeEvery(channel, function* (isOnline) {
    yield put(onlineStatusChanged({ isOnline }));

    if (isOnline) {
      // Refresh from server when coming online.
      yield call(handleFetchLayoutSync);
    }
  });
}

// Sync after user actions
function* handleAddWidgetClicked(action: ReturnType<typeof addWidgetClicked>) {
  const { position } = action.payload;
  const id: ReturnType<typeof createId> = yield call(createId);
  const lastSync: ReturnType<typeof getNow> = yield call(getNow);
  yield put(addWidget({ position, widget: { id }, lastSync }));
  const layout: ReturnType<typeof selectLayout> = yield select(selectLayout);
  yield call(updateLayout, { layout, lastSync });
}
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-router-redux.git
   cd react-router-redux
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production Mode

```bash
npm run start
# or
yarn start
```

## Testing Offline Functionality

To test the offline functionality:

1. Open the application in your browser
2. Navigate to the Terminal page
3. Add or remove widgets
4. Disconnect from the internet (you can use browser developer tools to simulate offline mode)
5. Continue making changes to the layout
6. Reconnect to the internet and observe how the application synchronizes with the server

## Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t react-router-redux .

# Run the container
docker run -p 3000:3000 react-router-redux
```

## License

This project is open source and available under the [MIT License](LICENSE).
