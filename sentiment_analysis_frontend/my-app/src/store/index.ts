import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"
import rootReducer from "./rootReducer.ts"
import rootSaga from "./rootSaga.ts"

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  });
sagaMiddleware.run(rootSaga)

export default store
