import { put, call, takeLatest } from "redux-saga/effects"
import { MULTI_PREDICT_REQUEST } from "../actions/index.ts"
import sentimentApi from "../api/index.ts"
import * as actions from "../actions/index.ts"

function* multiPredictRequest(data: any): any {
    try {
        const response = yield sentimentApi.multiPredictSentiment(data.payload)
        yield put(actions.multiPredictSuccess(response.data))
    } catch (error: any) {
        yield put(actions.multiPredictFailure(error.message))
        alert(error.message)
    }
}

export function* watchMultiPredictRequest() {
    yield takeLatest(MULTI_PREDICT_REQUEST, multiPredictRequest)
}