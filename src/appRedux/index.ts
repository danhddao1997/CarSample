import {combineReducers, configureStore} from '@reduxjs/toolkit';
import jobsReducer from './slices/jobs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

const reducers = {
  jobs: jobsReducer,
};

const persistConfigs = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(
  {
    ...persistConfigs,
    whitelist: ['jobs'],
  },
  combineReducers(reducers),
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: __DEV__,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
