import { put, call, takeLatest } from "redux-saga/effects"
import { UPLOAD_CSV_REQUEST } from "../actions/index.ts"
import sentimentApi from "../api/index.ts"
import * as actions from "../actions/index.ts"

// function* uploadCSVRequest(data: any): any {
//     try {
//         const response = yield sentimentApi.uploadCSV(data.payload)
//         yield put(actions.uploadCSVSuccess(response.data))
//     } catch (error: any) {
//         yield put(actions.uploadCSVFailure(error.message))
//         alert(error.message)
//     }
// }

// export function* watchUploadCSVRequest() {
//     yield takeLatest(UPLOAD_CSV_REQUEST, uploadCSVRequest)
// }