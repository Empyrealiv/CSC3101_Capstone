import { all } from "redux-saga/effects";
import { watchMultiPredictRequest } from "../sagas/index.ts";

export default function* rootSaga() {
    yield all([watchMultiPredictRequest()])
}
