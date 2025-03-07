import { combineReducers } from '@reduxjs/toolkit';

import {
  name as appLoadingSliceName,
  reducer as appLoadingReducer,
} from '~/features/app-loading/app-loading-reducer';
import {
  name as terminalSliceName,
  reducer as terminalReducer,
} from '~/features/terminal/terminal-reducer';

export const rootReducer = combineReducers({
  [appLoadingSliceName]: appLoadingReducer,
  [terminalSliceName]: terminalReducer,
});
