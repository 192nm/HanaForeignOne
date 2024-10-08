// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // authSlice 불러오기
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // 세션 스토리지를 사용
import { combineReducers } from 'redux';

// persist 설정
const persistConfig = {
  key: 'root',
  storage: sessionStorage, // 세션 스토리지 사용
};

// 리듀서를 합침
const rootReducer = combineReducers({
  auth: authReducer,
});

// persistReducer로 리듀서를 감쌈
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // persist 관련 액션 무시
      },
    }),
});

// persistor 생성
export const persistor = persistStore(store);
