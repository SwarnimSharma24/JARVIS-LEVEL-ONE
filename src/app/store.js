import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/userSlice";


// export const store = configureStore({
//     reducer: {
//         login: loginReducer,
//     },
// });

import createSagaMiddleware from 'redux-saga';
// import { configureStore } from '@reduxjs/toolkit';
// import loginReducer from "../features/login/userSlice";
import rootSaga from "../middleware/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

