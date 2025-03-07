import { combineReducers } from '@reduxjs/toolkit';

import {
  name as appLoadingSliceName,
  reducer as appLoadingReducer,
} from '~/features/app-loading/app-loading-reducer';

export const rootReducer = combineReducers({
  [appLoadingSliceName]: appLoadingReducer,
});
