declare module '@reduxjs/toolkit' {
  import {
    combineReducers,
    ConfigureStoreOptions,
    Middleware,
    Reducer,
    ReducersMapObject,
  } from '@reduxjs/toolkit';

  export {
    configureStore,
    createSlice,
    PayloadAction,
    createAsyncThunk,
    createAction,
  } from '@reduxjs/toolkit';

  export type {
    SliceCaseReducers,
    ValidateSliceCaseReducers,
    CaseReducerActions,
  } from '@reduxjs/toolkit';
}
